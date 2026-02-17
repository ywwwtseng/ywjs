import { describe, test, expect } from 'bun:test';
import { validate, allowed } from '../src';

describe('params', () => {
  test('passes with valid string/number/email and min/max', () => {
    const params = {
      username: 'alice',
      age: 30,
      email: 'alice@example.com',
      role: 'admin',
    };

    const schema = {
      username: {
        type: 'string' as const,
        required: true,
        min: 3,
        max: 10,
      },
      age: {
        type: 'number' as const,
        required: true,
        min: 18,
        max: 60,
      },
      email: {
        type: 'email' as const,
        required: true,
        min: 5,
        max: 100,
      },
      role: {
        type: 'enum' as const,
        enum: ['admin', 'user'],
        required: true,
      },
    };

    expect(validate(params, schema)).toEqual({ error: null });
  });

  test('fails on invalid email format', () => {
    const params = {
      email: 'not-an-email',
    };

    const schema = {
      email: {
        type: 'email' as const,
        required: true,
      },
    };

    expect(validate(params, schema).error).toBe(
      'Parameter (email) is not a valid email'
    );
  });

  test('passes when string matches pattern (url)', () => {
    const params = {
      url: 'https://example.com/path',
    };

    const schema = {
      url: {
        type: 'string' as const,
        required: true,
        pattern: /^https?:\/\/.+\..+/,
      },
    };

    expect(validate(params, schema)).toEqual({ error: null });
  });

  test('fails when string does not match pattern (url)', () => {
    const params = {
      url: 'not-a-url',
    };

    const schema = {
      url: {
        type: 'string' as const,
        required: true,
        pattern: /^https?:\/\/.+\..+/,
      },
    };

    expect(validate(params, schema).error).toBe(
      'Parameter (url) does not match pattern'
    );
  });

  test('uses custom message (validate)', () => {
    const params = {};

    const schema = {
      name: {
        type: 'string' as const,
        required: true,
        message: '請輸入姓名',
      },
    };

    expect(validate(params, schema).error).toBe('請輸入姓名');
  });

  test('uses custom message for pattern (validate)', () => {
    const params = { code: 'invalid' };

    const schema = {
      code: {
        type: 'string' as const,
        required: true,
        pattern: /^[A-Z]{2,4}$/,
        message: '代碼須為 2～4 個大寫英文',
      },
    };

    expect(validate(params, schema).error).toBe('代碼須為 2～4 個大寫英文');
  });

  test('custom validator passes (validate)', () => {
    const params = { score: 50 };

    const schema = {
      score: {
        type: 'number' as const,
        required: true,
        validator: (v: unknown) => (typeof v === 'number' && v >= 0 && v <= 100 ? null : '分數須在 0～100'),
      },
    };

    expect(validate(params, schema)).toEqual({ error: null });
  });

  test('custom validator fails (validate)', () => {
    const params = { score: 150 };

    const schema = {
      score: {
        type: 'number' as const,
        required: true,
        validator: (v: unknown) => (typeof v === 'number' && v >= 0 && v <= 100 ? null : '分數須在 0～100'),
      },
    };

    expect(validate(params, schema).error).toBe('分數須在 0～100');
  });

  test('fails when below min length / value', () => {
    const params = {
      username: 'ab',
      age: 10,
    };

    const schema = {
      username: {
        type: 'string' as const,
        required: true,
        min: 3,
      },
      age: {
        type: 'number' as const,
        required: true,
        min: 18,
      },
    };

    const result = validate(params, schema);
    expect(result.error).toBeDefined();
  });

  test('allows nullable values when nullable=true (null)', () => {
    const params = {
      nickname: null,
    };

    const schema = {
      nickname: {
        type: 'string' as const,
        nullable: true,
      },
    };

    expect(validate(params, schema)).toEqual({ error: null });
  });

  test('fails when nullable field is undefined (validate)', () => {
    const params = {
      nickname: undefined,
    };

    const schema = {
      nickname: {
        type: 'string' as const,
        nullable: true,
        required: false,
      },
    };

    expect(validate(params, schema).error).toBe(
      'Parameter (nickname) cannot be undefined'
    );
  });

  test('passes with only allowed keys and valid types', () => {
    const params = {
      username: 'bob',
      age: 25,
      email: 'bob@example.com',
    };

    const schema = {
      username: {
        type: 'string' as const,
        min: 3,
      },
      age: {
        type: 'number' as const,
        min: 18,
      },
      email: {
        type: 'email' as const,
      },
    };

    expect(allowed(params, schema)).toEqual({ error: null });
  });

  test('passes when fewer params than schema (only provided keys are checked)', () => {
    const params = {
      username: 'bob',
    };

    const schema = {
      username: {
        type: 'string' as const,
        min: 2,
      },
      age: {
        type: 'number' as const,
      },
      email: {
        type: 'email' as const,
      },
    };

    expect(allowed(params, schema)).toEqual({ error: null });
  });

  test('passes when url matches pattern (allowed)', () => {
    const params = {
      homepage: 'https://example.org',
    };

    const schema = {
      homepage: {
        type: 'string' as const,
        pattern: /^https?:\/\/.+\..+/,
      },
    };

    expect(allowed(params, schema)).toEqual({ error: null });
  });

  test('fails when url does not match pattern (allowed)', () => {
    const params = {
      homepage: 'ftp://invalid',
    };

    const schema = {
      homepage: {
        type: 'string' as const,
        pattern: /^https?:\/\/.+\..+/,
      },
    };

    expect(allowed(params, schema).error).toBe(
      'Parameter (homepage) does not match pattern'
    );
  });

  test('fails when there is an extra param not in schema', () => {
    const params = {
      username: 'bob',
      age: 25,
      extra: 'not allowed',
    };

    const schema = {
      username: {
        type: 'string' as const,
      },
      age: {
        type: 'number' as const,
      },
    };

    expect(allowed(params, schema).error).toBe(
      'Parameter (extra) is not allowed'
    );
  });

  test('fails on invalid email for allowed', () => {
    const params = {
      email: 'invalid',
    };

    const schema = {
      email: {
        type: 'email' as const,
      },
    };

    expect(allowed(params, schema).error).toBe(
      'Parameter (email) is not a valid email'
    );
  });

  test('allows nullable values when nullable=true (null)', () => {
    const params = {
      nickname: null,
    };

    const schema = {
      nickname: {
        type: 'string' as const,
        nullable: true,
      },
    };

    expect(allowed(params, schema)).toEqual({ error: null });
  });

  test('fails when nullable field is undefined (allowed)', () => {
    const params = {
      nickname: undefined,
    };

    const schema = {
      nickname: {
        type: 'string' as const,
        nullable: true,
      },
    };

    expect(allowed(params, schema).error).toBe(
      'Parameter (nickname) cannot be undefined'
    );
  });

  test('uses custom message (allowed)', () => {
    const params = { email: 'bad' };

    const schema = {
      email: {
        type: 'email' as const,
        message: '請填寫正確的 Email',
      },
    };

    expect(allowed(params, schema).error).toBe('請填寫正確的 Email');
  });

  test('custom validator (allowed)', () => {
    const params = { id: 'abc' };

    const schema = {
      id: {
        type: 'string' as const,
        validator: (v: unknown, key: string) =>
          typeof v === 'string' && /^[a-z0-9-]+$/.test(v) ? null : `${key} 須為小寫英文、數字或連字號`,
      },
    };

    expect(allowed(params, schema)).toEqual({ error: null });
  });

  test('custom validator fails (allowed)', () => {
    const params = { id: 'Invalid_ID' };

    const schema = {
      id: {
        type: 'string' as const,
        validator: (v: unknown, key: string) =>
          typeof v === 'string' && /^[a-z0-9-]+$/.test(v) ? null : `${key} 須為小寫英文、數字或連字號`,
      },
    };

    expect(allowed(params, schema).error).toBe('id 須為小寫英文、數字或連字號');
  });
});
