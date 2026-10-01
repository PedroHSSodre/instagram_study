export class PasswordHash {
  private constructor(readonly value: string) {}

  static fromString(value: string): PasswordHash {
    return new PasswordHash(value);
  }

  toJSON(): string {
    return '[REDACTED]';
  }

  toString(): string {
    return '[REDACTED]';
  }
}
