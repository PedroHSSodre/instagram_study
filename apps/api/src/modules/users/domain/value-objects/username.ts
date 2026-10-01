import { InvalidUsernameError } from '../errors/user-errors.js';

const PRINTABLE_ASCII_WITHOUT_SPACE = /^[\x21-\x7E]+$/;

export class Username {
  static readonly MIN_LENGTH = 3;
  static readonly MAX_LENGTH = 30;

  private constructor(readonly value: string) {}

  static create(raw: string): Username {
    if (raw.length < Username.MIN_LENGTH || raw.length > Username.MAX_LENGTH) {
      throw new InvalidUsernameError(
        `Username deve ter entre ${Username.MIN_LENGTH} e ${Username.MAX_LENGTH} caracteres.`,
      );
    }

    if (!PRINTABLE_ASCII_WITHOUT_SPACE.test(raw)) {
      throw new InvalidUsernameError(
        'Username deve conter apenas caracteres ASCII visíveis, sem espaços.',
      );
    }

    return new Username(raw.toLowerCase());
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }
}
