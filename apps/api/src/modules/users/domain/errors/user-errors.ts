import { DomainError } from '../../../../shared/domain/domain-error.js';

export type UserField = 'username' | 'email' | 'password' | 'displayName';

export abstract class InvalidUserDataError extends DomainError {
  constructor(
    readonly field: UserField,
    message: string,
  ) {
    super(message);
  }
}

export class InvalidUsernameError extends InvalidUserDataError {
  readonly code = 'USER.INVALID_USERNAME';

  constructor(message: string) {
    super('username', message);
  }
}

export class InvalidEmailError extends InvalidUserDataError {
  readonly code = 'USER.INVALID_EMAIL';

  constructor(message: string) {
    super('email', message);
  }
}

export class InvalidPasswordError extends InvalidUserDataError {
  readonly code = 'USER.INVALID_PASSWORD';

  constructor(message: string) {
    super('password', message);
  }
}

export class InvalidDisplayNameError extends InvalidUserDataError {
  readonly code = 'USER.INVALID_DISPLAY_NAME';

  constructor(message: string) {
    super('displayName', message);
  }
}

export abstract class UserAlreadyExistsError extends DomainError {
  constructor(
    readonly field: Extract<UserField, 'username' | 'email'>,
    message: string,
  ) {
    super(message);
  }
}

export class UsernameAlreadyTakenError extends UserAlreadyExistsError {
  readonly code = 'USER.USERNAME_TAKEN';

  constructor() {
    super('username', 'Username já está em uso.');
  }
}

export class EmailAlreadyInUseError extends UserAlreadyExistsError {
  readonly code = 'USER.EMAIL_IN_USE';

  constructor() {
    super('email', 'E-mail já está em uso.');
  }
}
