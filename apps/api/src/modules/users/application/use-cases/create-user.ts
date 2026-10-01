import {
  EmailAlreadyInUseError,
  UsernameAlreadyTakenError,
} from '../../domain/errors/user-errors.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import type { PasswordHasher } from '../../domain/services/password-hasher.js';
import { DisplayName } from '../../domain/value-objects/display-name.js';
import { Email } from '../../domain/value-objects/email.js';
import { PlainPassword } from '../../domain/value-objects/plain-password.js';
import { Username } from '../../domain/value-objects/username.js';
import type { CreateUserInput, CreateUserOutput } from '../dto/create-user.dto.js';

export class CreateUser {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const username = Username.create(input.username);
    const displayName = DisplayName.create(input.displayName);
    const email = Email.create(input.email);
    const password = PlainPassword.create(input.password);

    if (await this.users.existsByUsername(username)) {
      throw new UsernameAlreadyTakenError();
    }

    if (await this.users.existsByEmail(email)) {
      throw new EmailAlreadyInUseError();
    }

    const passwordHash = await this.passwordHasher.hash(password);

    const user = await this.users.create({
      username,
      displayName,
      email,
      passwordHash,
    });

    return {
      id: user.id,
      username: user.username.value,
      displayName: user.displayName.value,
      email: user.email.value,
      createdAt: user.createdAt,
    };
  }
}
