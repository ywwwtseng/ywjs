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
    readonly UNAUTHORIZED: 40100;
    readonly SESSION_MISMATCH: 40101;
    readonly SESSION_EXPIRED: 40102;
    readonly INVALID_TOKEN: 40103;
    readonly EXPIRED_TOKEN: 40104;
    readonly INVALID_SIGNATURE: 40105;
    readonly FORBIDDEN: 40301;
    readonly INSUFFICIENT_PERMISSIONS: 40302;
    readonly COMING_SOON: 40303;
    readonly SYSTEM_MAINTENANCE: 40304;
    readonly BLACKLIST_USER: 40305;
    readonly WITHDRAWAL_RESTRICTION: 40306;
    readonly NOT_FOUND: 40401;
    readonly ALREADY_EXISTED: 40901;
    readonly INSUFFICIENT: 40902;
    readonly NOT_SUPPORT: 40903;
    readonly MANY_REQUESTS: 40904;
    readonly INTERNAL_SERVER_ERROR: 50001;
    readonly NOT_IMPLEMENTED: 50101;
    readonly BAD_GATEWAY: 50201;
    readonly SERVICE_UNAVAILABLE: 50301;
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
declare const parseError: (error: unknown) => {
    error_code: number;
    status: number;
    message: string;
    info: any;
};

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

interface Locale {
    [key: string]: string | Locale;
}
type Locales = Record<string, Locale>;
declare function getLocale(locales: Locales, lang: string, callback?: Locale): Locale;
declare function translate(locale: Locale, key: string, params?: Record<string, string | number>): any;

declare function loadImage(url: string): Promise<Blob | null>;

declare class InMemoryCache {
    static instance: InMemoryCache;
    private data;
    static getInstance(): InMemoryCache;
    get<T>(key: string): T | null;
    set(key: string, value: unknown, ttl?: number): void;
    delete(key: string): void;
    clear(): void;
}

export { AppError, type DeepPartial, ErrorCodes, type ErrorResponse, InMemoryCache, type Locale, type Locales, allowed, errorToResponse, get, getLocale, ip, isObject, loadImage, merge, parseError, parseJSON, prune, retry, sleep, translate, update, validate };
