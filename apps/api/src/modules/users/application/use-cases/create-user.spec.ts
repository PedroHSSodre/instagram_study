import { beforeEach, describe, expect, it } from 'vitest';
import { User, type NewUser } from '../../domain/entities/user.js';
import {
  EmailAlreadyInUseError,
  InvalidPasswordError,
  UsernameAlreadyTakenError,
} from '../../domain/errors/user-errors.js';
import type { UserRepository } from '../../domain/repositories/user-repository.js';
import type { PasswordHasher } from '../../domain/services/password-hasher.js';
import type { Email } from '../../domain/value-objects/email.js';
import { PasswordHash } from '../../domain/value-objects/password-hash.js';
import type { PlainPassword } from '../../domain/value-objects/plain-password.js';
import type { Username } from '../../domain/value-objects/username.js';
import { CreateUser } from './create-user.js';

class InMemoryUserRepository implements UserRepository {
  readonly users: User[] = [];
  raceOn: 'username' | 'email' | null = null;

  async existsByUsername(username: Username) {
    return this.users.some((user) => user.username.equals(username));
  }

  async existsByEmail(email: Email) {
    return this.users.some((user) => user.email.equals(email));
  }

  async create(data: NewUser) {
    if (this.raceOn === 'username') throw new UsernameAlreadyTakenError();
    if (this.raceOn === 'email') throw new EmailAlreadyInUseError();

    const user = User.restore({
      ...data,
      id: `id-${this.users.length + 1}`,
      createdAt: '2026-09-28T00:00:00.000Z',
    });
    this.users.push(user);
    return user;
  }
}

class FakePasswordHasher implements PasswordHasher {
  async hash(password: PlainPassword) {
    return PasswordHash.fromString(`hashed:${password.value}`);
  }
}

const validInput = {
  username: 'Pedro_Sodre',
  displayName: 'Pedro Sodré',
  email: 'Pedro@Mail.com',
  password: 'Senha_forte',
};

describe('CreateUser', () => {
  let users: InMemoryUserRepository;
  let createUser: CreateUser;

  beforeEach(() => {
    users = new InMemoryUserRepository();
    createUser = new CreateUser(users, new FakePasswordHasher());
  });

  it('cria o usuário normalizado e grava só o hash da senha', async () => {
    const output = await createUser.execute(validInput);

    expect(output).toEqual({
      id: 'id-1',
      username: 'pedro_sodre',
      displayName: 'Pedro Sodré',
      email: 'pedro@mail.com',
      createdAt: '2026-09-28T00:00:00.000Z',
    });
    expect(output).not.toHaveProperty('password');
    expect(output).not.toHaveProperty('passwordHash');
    expect(users.users[0]?.passwordHash.value).toBe('hashed:Senha_forte');
  });

  it('rejeita username já usado, ignorando maiúsculas', async () => {
    await createUser.execute(validInput);

    await expect(
      createUser.execute({ ...validInput, username: 'PEDRO_SODRE', email: 'outro@mail.com' }),
    ).rejects.toBeInstanceOf(UsernameAlreadyTakenError);
  });

  it('rejeita e-mail já usado, ignorando maiúsculas', async () => {
    await createUser.execute(validInput);

    await expect(
      createUser.execute({ ...validInput, username: 'outro', email: 'PEDRO@MAIL.COM' }),
    ).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it('propaga o conflito detectado pelo UNIQUE do banco na corrida', async () => {
    users.raceOn = 'email';

    await expect(createUser.execute(validInput)).rejects.toBeInstanceOf(EmailAlreadyInUseError);
  });

  it('rejeita senha fora da política sem gravar', async () => {
    await expect(
      createUser.execute({ ...validInput, password: 'senhafraca' }),
    ).rejects.toBeInstanceOf(InvalidPasswordError);
    expect(users.users).toHaveLength(0);
  });
});
