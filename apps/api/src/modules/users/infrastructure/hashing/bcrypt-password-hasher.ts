import bcrypt from 'bcryptjs';
import type { PasswordHasher } from '../../domain/services/password-hasher.js';
import { PasswordHash } from '../../domain/value-objects/password-hash.js';
import type { PlainPassword } from '../../domain/value-objects/plain-password.js';

export class BcryptPasswordHasher implements PasswordHasher {
  constructor(private readonly cost = 12) {}

  async hash(password: PlainPassword): Promise<PasswordHash> {
    return PasswordHash.fromString(await bcrypt.hash(password.value, this.cost));
  }
}
