import type { Varchar } from '@prisma/orm-postgres/target/codec-types';
import type { PrismaService } from '../../../../prisma/prisma.service.js';
import { User, type NewUser } from '../../domain/entities/user.js';
import {
  EmailAlreadyInUseError,
  UsernameAlreadyTakenError,
} from '../../domain/errors/user-errors.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import { DisplayName } from '../../domain/value-objects/display-name.js';
import { Email } from '../../domain/value-objects/email.js';
import { PasswordHash } from '../../domain/value-objects/password-hash.js';
import { Username } from '../../domain/value-objects/username.js';
import { findUniqueViolationConstraint } from './unique-violation.js';

const USERNAME_UNIQUE = 'users_usr_username_key';
const EMAIL_UNIQUE = 'users_usr_email_key';

// Os value objects já garantem que o valor cabe na coluna varchar(N).
const varchar = <N extends number>(value: string) => value as Varchar<N>;

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get users() {
    return this.prisma.db.orm.public.User;
  }

  async existsByUsername(username: Username): Promise<boolean> {
    const row = await this.users
      .where({ usr_username: varchar<30>(username.value) })
      .select('usr_id')
      .first();
    return row !== null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const row = await this.users
      .where({ usr_email: varchar<255>(email.value) })
      .select('usr_id')
      .first();
    return row !== null;
  }

  async create(user: NewUser): Promise<User> {
    try {
      const row = await this.users
        .select('usr_id', 'usr_username', 'usr_display_name', 'usr_email', 'usr_password_hash', 'usr_created_at')
        .create({
          usr_username: varchar<30>(user.username.value),
          usr_display_name: varchar<100>(user.displayName.value),
          usr_email: varchar<255>(user.email.value),
          usr_password_hash: varchar<255>(user.passwordHash.value),
        });

      return User.restore({
        id: row.usr_id,
        username: Username.create(row.usr_username),
        displayName: DisplayName.create(row.usr_display_name),
        email: Email.create(row.usr_email),
        passwordHash: PasswordHash.fromString(row.usr_password_hash),
        createdAt: row.usr_created_at,
      });
    } catch (error) {
      const constraint = findUniqueViolationConstraint(error);
      if (constraint === USERNAME_UNIQUE) throw new UsernameAlreadyTakenError();
      if (constraint === EMAIL_UNIQUE) throw new EmailAlreadyInUseError();
      throw error;
    }
  }
}
