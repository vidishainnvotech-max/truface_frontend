export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status = 500, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}
