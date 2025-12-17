import { DomainException } from './base.exception';

// Helpers para excepciones de autenticación
export const AuthException = {
  invalidCredentials: (message = 'Credenciales inválidas') => DomainException.unauthorized(message),

  userAlreadyExists: (message = 'El usuario ya existe') => DomainException.conflict(message),

  invalidPassword: (message = 'Contraseña inválida') => DomainException.badRequest(message),

  tokenExpired: (message = 'Token expirado') => DomainException.unauthorized(message),

  tokenInvalid: (message = 'Token inválido') => DomainException.unauthorized(message),
};
