import { describe, expect, it } from 'vitest';
import { findUniqueViolationConstraint } from './unique-violation.js';

describe('findUniqueViolationConstraint', () => {
  it('lê sqlState e constraint no próprio erro', () => {
    const error = { sqlState: '23505', constraint: 'users_usr_email_key' };
    expect(findUniqueViolationConstraint(error)).toBe('users_usr_email_key');
  });

  it('segue a cadeia de cause', () => {
    const error = new Error('wrapped', {
      cause: { code: '23505', constraint: 'users_usr_username_key' },
    });
    expect(findUniqueViolationConstraint(error)).toBe('users_usr_username_key');
  });

  it('devolve null para outros erros', () => {
    expect(findUniqueViolationConstraint(new Error('boom'))).toBeNull();
    expect(findUniqueViolationConstraint({ sqlState: '23503' })).toBeNull();
  });
});
