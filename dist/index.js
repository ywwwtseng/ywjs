// src/object.ts
var isObject = (obj) => {
  return obj && typeof obj === "object" && !Array.isArray(obj);
};
function update(obj, path, value) {
  path = typeof path === "string" ? [path] : path;
  if (path.length === 0) return obj;
  const [key, ...rest] = path;
  return {
    ...obj,
    [key]: rest.length > 0 ? update(obj[key] ?? {}, rest, value) : value
  };
}
var get = (obj, path, callback) => {
  const keys = typeof path === "string" ? path.split(".") : path;
  let anchor = obj;
  for (let i = 0; i < keys.length; i++) {
    anchor = anchor[keys[i]];
    if (anchor === void 0) {
      return callback ?? void 0;
    }
  }
  return anchor;
};
var prune = (src) => {
  const obj = {};
  for (const key in src) {
    const value = src[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
      obj[key] = prune(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
};
var merge = (target, ...sources) => {
  for (const source of sources) {
    if (!isObject(source)) continue;
    for (const key in source) {
      const sourceValue = source[key];
      const targetValue = target[key];
      if (isObject(sourceValue)) {
        if (!isObject(targetValue)) {
          target[key] = {};
        }
        merge(target[key], sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
  }
  return target;
};

// src/json.ts
var parseJSON = (src) => {
  try {
    if (typeof src !== "string") {
      return src;
    }
    return JSON.parse(src);
  } catch {
    return null;
  }
};

// src/sleep.ts
var sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// src/error.ts
var ErrorCodes = {
  // 400xx - Bad Request Errors
  INVALID_PARAMS: 40001,
  // 401xx - Authentication Errors
  SESSION_MISMATCH: 40101,
  SESSION_EXPIRED: 40102,
  INVALID_TOKEN: 40103,
  EXPIRED_TOKEN: 40104,
  INVALID_SIGNATURE: 40105,
  // 403xx - Authorization Errors
  INSUFFICIENT_PERMISSIONS: 40301,
  COMING_SOON: 40302,
  SYSTEM_MAINTENANCE: 40303,
  BLACKLIST_USER: 40304,
  WITHDRAWAL_RESTRICTION: 40305,
  // 404xx - Not Found Errors
  NOT_FOUND: 40401,
  // 409xx - Conflict Errors
  // DUPLICATE_ENTRY: 40901,
  // VERSION_CONFLICT: 40902,
  ALREADY_EXISTED: 40901,
  INSUFFICIENT: 40902,
  NOT_SUPPORT: 40903,
  MANY_REQUESTS: 40904,
  // 500xx - Internal Server Errors
  INTERNAL_SERVER_ERROR: 50001
};
var AppError = class extends Error {
  constructor(code, message, info, status = Math.floor(code / 100)) {
    super(message);
    this.status = status;
    this.cause = {
      code,
      message: this.message,
      info,
      status: this.status
    };
  }
  cause;
};

// src/ip.ts
var ip = (headers) => {
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0];
  }
  return headers.get("x-real-ip") || "127.0.0.1";
};

// src/retry.ts
var retry = ({ retries, delay = 5e3 }) => async (exec) => {
  let attempts = 0;
  let result = void 0;
  while (attempts <= retries) {
    try {
      result = await exec();
      if (result) {
        return [result, null];
      }
    } catch (error) {
      if (attempts === retries) {
        return [void 0, error];
      }
    }
    attempts++;
    if (attempts < retries) {
      await sleep(typeof delay === "function" ? delay(attempts) : delay);
    }
  }
  return [void 0, new Error("Retry limit reached")];
};

// src/params.ts
var validate = (params, schema) => {
  const keys = Object.keys(schema);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (params[key] === void 0) {
      return {
        error: `Parameter (${key}) is required`
      };
    } else if (!(schema[key].nullable && params[key] === null) && schema[key].type !== "enum" && typeof params[key] !== schema[key].type) {
      return {
        error: `Parameter (${key}) type need ${schema[key]}`
      };
    } else if (schema[key].type === "enum" && !schema[key].enum?.includes(params[key])) {
      return {
        error: `Parameter (${key}) need one of (${schema[key].toString()}), but got ${params[key]}`
      };
    } else if (schema[key].required) {
      if (schema[key].type === "string" && typeof params[key] === "string" && params[key].trim() === "") {
        return {
          error: `Parameter (${key}) is required`
        };
      } else if (schema[key].type === "number" && typeof params[key] === "number" && params[key] === 0) {
        return {
          error: `Parameter (${key}) is required`
        };
      }
    }
  }
  return {
    error: null
  };
};
var allowed = (params, schema) => {
  const keys = Object.keys(params);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    if (!Object.keys(schema).includes(key)) {
      return {
        error: `Parameter (${key}) is not allowed`
      };
    } else if (!(schema[key].nullable && params[key] === null) && schema[key].type !== "enum" && typeof params[key] !== schema[key].type) {
      return {
        error: `Parameter (${key}) type need ${schema[key]}`
      };
    } else if (schema[key].type === "enum" && !schema[key].enum?.includes(params[key])) {
      return {
        error: `Parameter (${key}) need one of (${schema[key].toString()}), but got ${params[key]}`
      };
    }
  }
  return {
    error: null
  };
};

// src/response.ts
var errorToResponse = (error) => {
  let error_code = 50001;
  let status = 500;
  let message = "Unknown error";
  let info = void 0;
  if (error !== null && typeof error === "object") {
    if ("status" in error) {
      if (typeof error.status === "number") {
        status = error.status;
      }
    }
    if ("message" in error && typeof error.message === "string") {
      message = error.message;
    } else {
      message = JSON.stringify(error);
    }
    if ("cause" in error) {
      if (typeof error.cause === "object") {
        if ("code" in error.cause && typeof error.cause.code === "number") {
          error_code = error.cause.code;
        }
        if ("info" in error.cause && error.cause.info) {
          info = error.cause.info;
        }
      }
    }
  }
  return Response.json(
    {
      error,
      message,
      error_code,
      info
    },
    { status }
  );
};

// src/i18n.ts
function getLocale(locales, lang, callback) {
  lang = lang.slice(0, 2);
  return locales[lang] || callback;
}
function translate(locale, key, params) {
  if (!locale || typeof key !== "string") return key;
  const template = get(locale, key, key);
  if (!params) return template;
  return template.replace(
    /\{(\w+)\}/g,
    (_, key2) => String(params[key2]) || ""
  );
}
export {
  AppError,
  ErrorCodes,
  allowed,
  errorToResponse,
  get,
  getLocale,
  ip,
  isObject,
  merge,
  parseJSON,
  prune,
  retry,
  sleep,
  translate,
  update,
  validate
};
