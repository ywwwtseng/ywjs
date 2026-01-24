import { Role } from './constants';

export interface AuthContext {
  jwtSecret: string;
  appName: string;
  role: (address: string) => Promise<Role>;
}

export type QueryParams = Record<string, string | number | boolean>;

export interface MutateBody<T = Record<string, unknown>> {
  type: 'mutate';
  action: string;
  payload?: T;
}

export interface QueryBody {
  type: 'query';
  key: string;
  path: string;
  params: QueryParams;
}

export type ApiRequestBody = MutateBody | QueryBody;

export interface Command {
  type: 'update' | 'merge' | 'replace' | 'unshift' | 'push' | 'delete';
  target?: string;
  payload: unknown;
}

export interface Notify {
  type?: 'success' | 'error' | 'default';
  message: string;
}

export interface ResponseData<T = unknown> {
  error?: number;
  message?: string;
  commands?: Command[];
  data?: T;
  notify?: Notify;
  navigate?: {
    screen: string;
    params?: Record<string, string | number | boolean | null>;
  };
  ok?: boolean;
}

export interface QueryContext {
  headers: Headers;
  user: { id: string; } & Record<string, unknown>;
  start_param: string | null;
}

export interface MutationContext {
  name: string;
  headers: Headers;
  user: { id: string; } & Record<string, unknown>;
  start_param: string | null;
}

export type Mutation<T = MutateBody['payload']> = (
  body: T,
  context: MutationContext
) => Promise<ResponseData>;

export type MutationValidate<T = MutateBody['payload']> = (
  body: T,
  context: MutationContext
) => Promise<boolean>;

export type Query = (
  body: QueryBody,
  context: QueryContext,
) => Promise<ResponseData>;

export type Queries = Record<string, Query>;

export type MutationValidators = Record<string, MutationValidate>;

export type Mutations = Record<string, Mutation<unknown>>;

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;