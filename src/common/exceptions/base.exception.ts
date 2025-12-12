export abstract class DomainException extends Error {
  abstract readonly statusCode: number;
  abstract readonly errors: any;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}
