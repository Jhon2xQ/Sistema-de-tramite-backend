import { DomainException } from './base.exception';

export class NotFoundUserException extends DomainException {
  readonly statusCode = 401;
  readonly errors = null;
  constructor(message: string) {
    super(message);
  }
}
