import type { DisplayName } from '../value-objects/display-name.js';
import type { Email } from '../value-objects/email.js';
import type { PasswordHash } from '../value-objects/password-hash.js';
import type { Username } from '../value-objects/username.js';

export interface NewUser {
  readonly username: Username;
  readonly displayName: DisplayName;
  readonly email: Email;
  readonly passwordHash: PasswordHash;
}

export interface UserProps extends NewUser {
  readonly id: string;
  readonly createdAt: string;
}

export class User {
  private constructor(private readonly props: UserProps) {}

  static restore(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }

  get username(): Username {
    return this.props.username;
  }

  get displayName(): DisplayName {
    return this.props.displayName;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): PasswordHash {
    return this.props.passwordHash;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }
}
