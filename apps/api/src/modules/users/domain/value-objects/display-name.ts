import { InvalidDisplayNameError } from '../errors/user-errors.js';

export class DisplayName {
  static readonly MAX_LENGTH = 100;

  private constructor(readonly value: string) {}

  static create(raw: string): DisplayName {
    const trimmed = raw.trim();

    if (trimmed.length === 0) {
      throw new InvalidDisplayNameError('Nome de exibição é obrigatório.');
    }

    if ([...trimmed].length > DisplayName.MAX_LENGTH) {
      throw new InvalidDisplayNameError(
        `Nome de exibição deve ter no máximo ${DisplayName.MAX_LENGTH} caracteres.`,
      );
    }

    return new DisplayName(trimmed);
  }
}
