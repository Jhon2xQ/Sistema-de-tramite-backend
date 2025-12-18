import { HttpStatus } from '@nestjs/common';

export class DomainException extends Error {
  readonly statusCode: number;
  readonly errors?: any;

  constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST, errors?: any) {
    super(message);
    this.name = 'DomainException';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods para casos comunes
  static badRequest(message: string, errors?: any): DomainException {
    return new DomainException(message, HttpStatus.BAD_REQUEST, errors);
  }

  static unauthorized(message: string = 'No autorizado'): DomainException {
    return new DomainException(message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message: string = 'Acceso prohibido'): DomainException {
    return new DomainException(message, HttpStatus.FORBIDDEN);
  }

  static notFound(message: string = 'Recurso no encontrado'): DomainException {
    return new DomainException(message, HttpStatus.NOT_FOUND);
  }

  static conflict(message: string, errors?: any): DomainException {
    return new DomainException(message, HttpStatus.CONFLICT, errors);
  }

  static internal(message: string = 'Error interno del servidor', errors?: any): DomainException {
    return new DomainException(message, HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }
}
