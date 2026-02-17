export const validate = (
  params: Record<string, unknown>,
  schema: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | 'enum' | 'email';
      enum?: string[];
      nullable?: boolean;
      required?: boolean;
      min?: number;
      max?: number;
      pattern?: RegExp;
    }
  >
) => {
  const keys = Object.keys(schema);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];

    if (schema[key].required && params[key] === undefined) {
      return {
        error: `Parameter (${key}) is required`,
      };
    } else if (Object.prototype.hasOwnProperty.call(params, key) && params[key] === undefined) {
      return {
        error: `Parameter (${key}) cannot be undefined`,
      };
    } else if (
      !(schema[key].nullable && params[key] === null) &&
      schema[key].type !== 'enum' &&
      // type check：email 視為 string
      ((schema[key].type === 'email' && typeof params[key] !== 'string') ||
        (schema[key].type !== 'email' &&
          typeof params[key] !== schema[key].type))
    ) {
      if (schema[key].nullable && params[key] === null) {
        continue;
      }
      return {
        error: `Parameter (${key}) type need ${schema[key].type}`,
      };
    } else if (
      schema[key].type === 'enum' &&
      !schema[key].enum?.includes(params[key] as string)
    ) {
      return {
        error: `Parameter (${key}) need one of (${schema[key].enum?.join(
          ', '
        )}), but got ${params[key]}`,
      };
    } else if (schema[key].required) {
      if (
        schema[key].type === 'string' &&
        typeof params[key] === 'string' &&
        params[key].trim() === ''
      ) {
        return {
          error: `Parameter (${key}) can't be empty string`,
        };
      } else if (
        schema[key].type === 'number' &&
        typeof params[key] === 'number' &&
        params[key] === 0
      ) {
        return {
          error: `Parameter (${key}) can't be 0`,
        };
      } else if (
        schema[key].type === 'boolean' &&
        typeof params[key] !== 'boolean'
      ) {
        return {
          error: `Parameter (${key}) type need boolean, but got ${params[key]}`,
        };
      } else if (
        schema[key].type === 'email' &&
        typeof params[key] === 'string'
      ) {
        const value = (params[key] as string).trim();
        if (value === '') {
          return {
            error: `Parameter (${key}) can't be empty email`,
          };
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return {
            error: `Parameter (${key}) is not a valid email`,
          };
        }
      }
    }

    // min/max for string (length) and number (value)
    const def = schema[key];
    if (
      (def.type === 'string' || def.type === 'email') &&
      typeof params[key] === 'string'
    ) {
      const str = params[key] as string;
      const len = str.length;
      if (def.min !== undefined && len < def.min) {
        return { error: `Parameter (${key}) length must be >= ${def.min}, got ${len}` };
      }
      if (def.max !== undefined && len > def.max) {
        return { error: `Parameter (${key}) length must be <= ${def.max}, got ${len}` };
      }
      if (def.type === 'string' && def.pattern !== undefined && !def.pattern.test(str)) {
        return { error: `Parameter (${key}) does not match pattern` };
      }
    } else if (def.type === 'number' && typeof params[key] === 'number') {
      const val = params[key] as number;
      if (def.min !== undefined && val < def.min) {
        return { error: `Parameter (${key}) must be >= ${def.min}, got ${val}` };
      }
      if (def.max !== undefined && val > def.max) {
        return { error: `Parameter (${key}) must be <= ${def.max}, got ${val}` };
      }
    }
  }

  return {
    error: null,
  };
};

export const allowed = (
  params: Record<string, unknown>,
  schema: Record<
    string,
    {
      type: 'string' | 'number' | 'boolean' | 'enum' | 'email';
      enum?: string[];
      nullable?: boolean;
      min?: number;
      max?: number;
      pattern?: RegExp;
    }
  >
) => {
  const keys = Object.keys(params);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];

    if (!Object.keys(schema).includes(key)) {
      return {
        error: `Parameter (${key}) is not allowed`,
      };
    } else if (params[key] === undefined) {
      return {
        error: `Parameter (${key}) cannot be undefined`,
      };
    } else if (
      !(schema[key].nullable && params[key] === null) &&
      schema[key].type !== 'enum' &&
      // type check：email 視為 string
      ((schema[key].type === 'email' && typeof params[key] !== 'string') ||
        (schema[key].type !== 'email' &&
          typeof params[key] !== schema[key].type))
    ) {
      return {
        error: `Parameter (${key}) type need ${schema[key].type}`,
      };
    } else if (
      schema[key].type === 'enum' &&
      !schema[key].enum?.includes(params[key] as string)
    ) {
      return {
        error: `Parameter (${key}) need one of (${schema[key].enum?.join(
          ', '
        )}), but got ${params[key]}`,
      };
    } else if (schema[key].nullable && params[key] === null) {
      continue;
    } else if (
      schema[key].type === 'string' &&
      typeof params[key] !== 'string'
    ) {
      return {
        error: `Parameter (${key}) type need string, but got ${params[key]}`,
      };
    } else if (
      schema[key].type === 'number' &&
      typeof params[key] !== 'number'
    ) {
      return {
        error: `Parameter (${key}) type need number, but got ${params[key]}`,
      };
    } else if (
      schema[key].type === 'boolean' &&
      typeof params[key] !== 'boolean'
    ) {
      return {
        error: `Parameter (${key}) type need boolean, but got ${params[key]}`,
      };
    } else if (
      schema[key].type === 'email' &&
      typeof params[key] === 'string'
    ) {
      const value = (params[key] as string).trim();
      if (value === '') {
        return {
          error: `Parameter (${key}) can't be empty email`,
        };
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return {
          error: `Parameter (${key}) is not a valid email`,
        };
      }
    }

    // min/max for string (length) and number (value)
    const def = schema[key];
    if (
      (def.type === 'string' || def.type === 'email') &&
      typeof params[key] === 'string'
    ) {
      const str = params[key] as string;
      const len = str.length;
      if (def.min !== undefined && len < def.min) {
        return { error: `Parameter (${key}) length must be >= ${def.min}, got ${len}` };
      }
      if (def.max !== undefined && len > def.max) {
        return { error: `Parameter (${key}) length must be <= ${def.max}, got ${len}` };
      }
      if (def.type === 'string' && def.pattern !== undefined && !def.pattern.test(str)) {
        return { error: `Parameter (${key}) does not match pattern` };
      }
    } else if (def.type === 'number' && typeof params[key] === 'number') {
      const val = params[key] as number;
      if (def.min !== undefined && val < def.min) {
        return { error: `Parameter (${key}) must be >= ${def.min}, got ${val}` };
      }
      if (def.max !== undefined && val > def.max) {
        return { error: `Parameter (${key}) must be <= ${def.max}, got ${val}` };
      }
    }
  }

  return {
    error: null,
  };
};
