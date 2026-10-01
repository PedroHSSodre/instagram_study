import type { CreateUserInput } from '../../application/dto/create-user.dto.js';

const FIELDS = ['username', 'displayName', 'email', 'password'] as const;

export type FieldErrors = Partial<Record<(typeof FIELDS)[number] | 'body', string>>;

export type CreateUserValidation =
  | { ok: true; value: CreateUserInput }
  | { ok: false; errors: FieldErrors };

export function validateCreateUserBody(body: unknown): CreateUserValidation {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, errors: { body: 'Corpo da requisição deve ser um objeto JSON.' } };
  }

  const record = body as Record<string, unknown>;
  const errors: FieldErrors = {};

  for (const field of FIELDS) {
    const value = record[field];
    if (value === undefined || value === null || value === '') {
      errors[field] = 'Campo obrigatório.';
    } else if (typeof value !== 'string') {
      errors[field] = 'Deve ser um texto.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      username: record.username as string,
      displayName: record.displayName as string,
      email: record.email as string,
      password: record.password as string,
    },
  };
}
