import type { NewUser, User } from '../entities/user.js';
import type { Email } from '../value-objects/email.js';
import type { Username } from '../value-objects/username.js';

export const USER_REPOSITORY = Symbol('UserRepository');

export interface UserRepository {
  existsByUsername(username: Username): Promise<boolean>;

  existsByEmail(email: Email): Promise<boolean>;

  /**
   * @throws UsernameAlreadyTakenError | EmailAlreadyInUseError quando a
   * constraint UNIQUE do banco rejeita a gravação.
   */
  create(user: NewUser): Promise<User>;
}
