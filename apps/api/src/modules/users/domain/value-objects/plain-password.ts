import { InvalidPasswordError } from '../errors/user-errors.js';

const LOWERCASE = /\p{Ll}/u;
const UPPERCASE = /\p{Lu}/u;
const SPECIAL = /[^\p{L}\p{N}]/u;

export class PlainPassword {
  static readonly MIN_LENGTH = 8;
  static readonly MAX_LENGTH = 72;
  // bcrypt ignora silenciosamente o que passar de 72 bytes.
  static readonly MAX_BYTES = 72;

  private constructor(readonly value: string) {}

  static create(raw: string): PlainPassword {
    const length = [...raw].length;

    if (length < PlainPassword.MIN_LENGTH || length > PlainPassword.MAX_LENGTH) {
      throw new InvalidPasswordError(
        `Senha deve ter entre ${PlainPassword.MIN_LENGTH} e ${PlainPassword.MAX_LENGTH} caracteres.`,
      );
    }

    if (new TextEncoder().encode(raw).length > PlainPassword.MAX_BYTES) {
      throw new InvalidPasswordError(
        `Senha deve ocupar no máximo ${PlainPassword.MAX_BYTES} bytes; caracteres acentuados ou especiais ocupam mais de um.`,
      );
    }

    if (!LOWERCASE.test(raw)) {
      throw new InvalidPasswordError('Senha deve conter ao menos uma letra minúscula.');
    }

    if (!UPPERCASE.test(raw)) {
      throw new InvalidPasswordError('Senha deve conter ao menos uma letra maiúscula.');
    }

    if (!SPECIAL.test(raw)) {
      throw new InvalidPasswordError('Senha deve conter ao menos um caractere especial.');
    }

    return new PlainPassword(raw);
  }

  toJSON(): string {
    return '[REDACTED]';
  }

  toString(): string {
    return '[REDACTED]';
  }
}
