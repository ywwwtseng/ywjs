import { parseError } from './error';

export interface ErrorResponse {
  error: string;
  message: string;
  error_code: number;
  info?: Record<string, unknown>;
}

export const errorToResponse = (error: unknown) => {
  const { error_code, status, message, info } = parseError(error);

  return Response.json(
    {
      error,
      message,
      error_code,
      info,
    },
    { status }
  );
};
