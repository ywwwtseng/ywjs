declare const isObject: (obj: any) => boolean;
declare function update<T extends Record<string, any>>(obj: T, path: string | string[], value: any): T;
declare const get: (obj: Record<string, any>, path: string | string[], callback?: any) => any;
declare const prune: (src: Record<string, unknown>) => Record<string, unknown>;
declare const merge: (target: any, ...sources: any[]) => any;

declare const parseJSON: (src: unknown) => unknown;

declare const sleep: (ms: number) => Promise<unknown>;

type DeepPartial<T> = T extends object ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : T;

declare const ErrorCodes: {
    readonly INVALID_PARAMS: 40001;
    readonly SESSION_MISMATCH: 40101;
    readonly SESSION_EXPIRED: 40102;
    readonly INVALID_TOKEN: 40103;
    readonly EXPIRED_TOKEN: 40104;
    readonly INVALID_SIGNATURE: 40105;
    readonly INSUFFICIENT_PERMISSIONS: 40301;
    readonly COMING_SOON: 40302;
    readonly SYSTEM_MAINTENANCE: 40303;
    readonly BLACKLIST_USER: 40304;
    readonly WITHDRAWAL_RESTRICTION: 40305;
    readonly NOT_FOUND: 40401;
    readonly ALREADY_EXISTED: 40901;
    readonly INSUFFICIENT: 40902;
    readonly NOT_SUPPORT: 40903;
    readonly MANY_REQUESTS: 40904;
    readonly INTERNAL_SERVER_ERROR: 50001;
};
declare class AppError extends Error {
    readonly status: number;
    cause: {
        code: number;
        message: string;
        info?: Record<string, unknown>;
        status: number;
    };
    constructor(code: number, message: string, info?: Record<string, unknown>, status?: number);
}

declare const ip: (headers: Headers) => string;

interface RetryOptions {
    retries: number;
    delay?: number | ((attempts: number) => number);
}
declare const retry: ({ retries, delay }: RetryOptions) => <F extends () => Promise<Awaited<ReturnType<F>>>>(exec: F) => Promise<[Awaited<ReturnType<F>> | undefined, unknown]>;

declare const validate: (params: Record<string, unknown>, schema: Record<string, {
    type: "string" | "number" | "boolean" | "enum";
    enum?: string[];
    nullable?: boolean;
    required?: boolean;
}>) => {
    error: string;
};
declare const allowed: (params: Record<string, unknown>, schema: Record<string, {
    type: "string" | "number" | "boolean" | "enum";
    enum?: string[];
    nullable?: boolean;
}>) => {
    error: string;
};

interface ErrorResponse {
    error: string;
    message: string;
    error_code: number;
    info?: Record<string, unknown>;
}
declare const errorToResponse: (error: unknown) => Response;

type Locale = Record<string, Record<string, string>>;
type Locales = Record<string, Locale>;
declare function getLocale(locales: Locales, lang: string, callback?: Locale): Locale;
declare function translate(locale: Locale, key: string, params?: Record<string, string | number>): any;

export { AppError, type DeepPartial, ErrorCodes, type ErrorResponse, type Locale, type Locales, allowed, errorToResponse, get, getLocale, ip, isObject, merge, parseJSON, prune, retry, sleep, translate, update, validate };
