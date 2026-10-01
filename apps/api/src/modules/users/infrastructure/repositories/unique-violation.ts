const UNIQUE_VIOLATION = '23505';

interface SqlErrorLike {
  sqlState?: unknown;
  code?: unknown;
  constraint?: unknown;
  cause?: unknown;
  details?: unknown;
}

/**
 * Procura uma violação de UNIQUE do Postgres no erro ou na cadeia de `cause`
 * e devolve o nome da constraint. O runtime pode embrulhar o erro do driver.
 */
export function findUniqueViolationConstraint(error: unknown): string | null {
  const seen = new Set<unknown>();
  let current: unknown = error;

  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);
    const candidate = current as SqlErrorLike;

    if (candidate.sqlState === UNIQUE_VIOLATION || candidate.code === UNIQUE_VIOLATION) {
      return typeof candidate.constraint === 'string' ? candidate.constraint : '';
    }

    current = candidate.cause ?? candidate.details;
  }

  return null;
}
