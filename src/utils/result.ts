import { StatusCode } from "hono/utils/http-status";

export class ApiError {
  errCode: string;
  constructor(errCode: string) {
    this.errCode = errCode;
  }
}

export class Result<T> {
  #statusCode: StatusCode;
  data: T | null;
  error: ApiError | null;

  constructor(
    data: T | null,
    err?: ApiError | null,
    statusCode: StatusCode = 200,
  ) {
    if (err) this.error = err;
    else this.error = null;
    this.data = data;
    this.#statusCode = statusCode;
  }
  unwrap(): T | null {
    return this.data;
  }
  isOk(): this is Result<T> {
    return this.data !== null;
  }

  isErr(): this is Result<never> {
    return this.error !== null;
  }
  getStatusCode(): StatusCode {
    return this.#statusCode;
  }
  static NotFoundError: Result<never> = new Result<never>(
    null,
    new ApiError("NOT_FOUND"),
    404,
  );
  static BadRequestError: Result<never> = new Result<never>(
    null,
    new ApiError("BAD_REQUEST"),
    400,
  );
  static AuthorizationError: Result<never> = new Result<never>(
    null,
    new ApiError("NOT_AUTHORIZED"),
    401,
  );
  static ForbiddenError: Result<never> = new Result<never>(
    null,
    new ApiError("FORBIDDEN"),
    403,
  );
  static InternalError: Result<never> = new Result<never>(
    null,
    new ApiError("INTERNAL_ERROR"),
    500,
  );
}
