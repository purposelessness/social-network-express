export abstract class ErrorWithCode extends Error {
  public abstract readonly code: number;
}

export class ClientError extends ErrorWithCode {
  constructor(message: string, public readonly code: number = 400) {
    super(message);
    this.name = 'ClientError';
  }
}

export class NotFoundError extends ClientError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends Error {
  constructor(message: string, public readonly code: number = 500) {
    super(message);
    this.name = 'ServerError';
  }
}