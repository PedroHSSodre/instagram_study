import { InvalidEmailError } from '../errors/user-errors.js';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export class Email {
  static readonly MAX_LENGTH = 255;

  private constructor(readonly value: string) {}

  static create(raw: string): Email {
    const normalized = raw.trim().toLowerCase();

    if (normalized.length === 0) {
      throw new InvalidEmailError('E-mail é obrigatório.');
    }

    if ([...normalized].length > Email.MAX_LENGTH) {
      throw new InvalidEmailError(
        `E-mail deve ter no máximo ${Email.MAX_LENGTH} caracteres.`,
      );
    }

    if (!EMAIL_FORMAT.test(normalized)) {
      throw new InvalidEmailError('E-mail em formato inválido.');
    }

    return new Email(normalized);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
