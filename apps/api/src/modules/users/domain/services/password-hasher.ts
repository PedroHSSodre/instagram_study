import type { PasswordHash } from '../value-objects/password-hash.js';
import type { PlainPassword } from '../value-objects/plain-password.js';

export const PASSWORD_HASHER = Symbol('PasswordHasher');

export interface PasswordHasher {
  hash(password: PlainPassword): Promise<PasswordHash>;
}
