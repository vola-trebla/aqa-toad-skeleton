export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
    public readonly body: string
  ) {
    super(`HTTP ${status} ${url}: ${body}`);
    this.name = 'ApiError';
  }
}
