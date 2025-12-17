import { DomainException } from './base.exception';

// Helpers para excepciones de base de datos
export const DatabaseException = {
  notFound: (resource = 'Registro', message?: string) =>
    DomainException.notFound(message || `${resource} no encontrado`),

  uniqueConstraint: (field: string, message?: string) =>
    DomainException.conflict(message || `Ya existe un registro con ese ${field}`),

  foreignKey: (message = 'Referencia inválida: el registro relacionado no existe') =>
    DomainException.badRequest(message),

  generic: (message = 'Error de base de datos', errors?: any) => DomainException.internal(message, errors),
};
