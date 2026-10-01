import { describe, expect, it } from 'vitest';
import {
  InvalidDisplayNameError,
  InvalidEmailError,
  InvalidPasswordError,
  InvalidUsernameError,
} from '../errors/user-errors.js';
import { DisplayName } from './display-name.js';
import { Email } from './email.js';
import { PlainPassword } from './plain-password.js';
import { Username } from './username.js';

describe('Username', () => {
  it('normaliza para minúsculas', () => {
    expect(Username.create('Pedro').value).toBe('pedro');
    expect(Username.create('PEDRO').equals(Username.create('pedro'))).toBe(true);
  });

  it('aceita caracteres especiais ASCII', () => {
    expect(Username.create('pedro_sodre').value).toBe('pedro_sodre');
    expect(Username.create('p.e-d@r!o~').value).toBe('p.e-d@r!o~');
  });

  it.each(['ab', 'a'.repeat(31)])('rejeita tamanho fora de 3 a 30: %s', (raw) => {
    expect(() => Username.create(raw)).toThrow(InvalidUsernameError);
  });

  it('aceita os limites de 3 e 30 caracteres', () => {
    expect(Username.create('abc').value).toBe('abc');
    expect(Username.create('a'.repeat(30)).value).toBe('a'.repeat(30));
  });

  it.each(['pedro sodre', 'pedrô', 'ped\tro', 'pedro😀'])('rejeita não ASCII ou espaço: %s', (raw) => {
    expect(() => Username.create(raw)).toThrow(InvalidUsernameError);
  });
});

describe('Email', () => {
  it('normaliza para minúsculas e remove espaços nas pontas', () => {
    expect(Email.create('  Pedro@Mail.COM ').value).toBe('pedro@mail.com');
  });

  it.each(['', 'pedro', 'pedro@', '@mail.com', 'pedro@mail', 'pe dro@mail.com', 'pedro@mail..com'])(
    'rejeita formato inválido: "%s"',
    (raw) => {
      expect(() => Email.create(raw)).toThrow(InvalidEmailError);
    },
  );

  it('rejeita mais de 255 caracteres', () => {
    const raw = `${'a'.repeat(246)}@mail.com`;
    expect(raw.length).toBe(255);
    expect(Email.create(raw).value).toBe(raw);
    expect(() => Email.create(`a${raw}`)).toThrow(InvalidEmailError);
  });
});

describe('PlainPassword', () => {
  it('aceita senha com minúscula, maiúscula e especial', () => {
    expect(() => PlainPassword.create('Senha_ok')).not.toThrow();
  });

  it.each([
    ['curta', 'Sen_ha1'],
    ['longa', `Aa!${'a'.repeat(70)}`],
    ['sem minúscula', 'SENHA_FORTE'],
    ['sem maiúscula', 'senha_forte'],
    ['sem especial', 'SenhaForte1'],
  ])('rejeita senha %s', (_case, raw) => {
    expect(() => PlainPassword.create(raw)).toThrow(InvalidPasswordError);
  });

  it('aceita exatamente 72 caracteres', () => {
    expect(() => PlainPassword.create(`Aa!${'a'.repeat(69)}`)).not.toThrow();
  });

  it('rejeita senha que passa de 72 bytes em UTF-8', () => {
    expect(() => PlainPassword.create(`Aa!${'é'.repeat(40)}`)).toThrow(InvalidPasswordError);
  });

  it('não expõe o valor ao serializar', () => {
    const password = PlainPassword.create('Senha_ok');
    expect(JSON.stringify({ password })).not.toContain('Senha_ok');
    expect(String(password)).toBe('[REDACTED]');
  });
});

describe('DisplayName', () => {
  it('remove espaços nas pontas', () => {
    expect(DisplayName.create('  Pedro Sodré ').value).toBe('Pedro Sodré');
  });

  it.each(['', '   ', 'a'.repeat(101)])('rejeita vazio ou acima de 100: "%s"', (raw) => {
    expect(() => DisplayName.create(raw)).toThrow(InvalidDisplayNameError);
  });
});
