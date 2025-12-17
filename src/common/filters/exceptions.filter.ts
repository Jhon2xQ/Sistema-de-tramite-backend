import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from 'src/dtos/response.dto';
import { DomainException } from '../exceptions/base.exception';

interface PrismaError {
  code: string;
  meta?: {
    target?: string[];
    cause?: string;
  };
  message?: string;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { status, message } = this.handleException(exception);

    // Log del error
    this.logger.error({
      type: exception instanceof Error ? exception.constructor.name : 'Unknown',
      message,
      status,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json(ApiResponse.error(message));
  }

  private handleException(exception: unknown): { status: number; message: string } {
    // 1. Excepciones de dominio personalizadas
    if (exception instanceof DomainException) {
      return {
        status: exception.statusCode,
        message: exception.message,
      };
    }

    // 2. HttpExceptions de NestJS (validación, guards, etc.)
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception);
    }

    // 3. Errores de Prisma
    if (this.isPrismaError(exception)) {
      return this.handlePrismaError(exception as PrismaError);
    }

    // 4. Errores genéricos
    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : exception.message,
      };
    }

    // 5. Fallback
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error interno del servidor',
    };
  }

  private handleHttpException(exception: HttpException): { status: number; message: string } {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const response = exceptionResponse as any;
      // Manejar errores de validación de class-validator
      if (Array.isArray(response.message)) {
        message = response.message.join(', ');
      } else {
        message = response.message || response.error || 'Error en la solicitud';
      }
    } else {
      message = 'Error en la solicitud';
    }

    return { status, message };
  }

  private handlePrismaError(error: PrismaError): { status: number; message: string } {
    const prismaErrorMap: Record<string, { status: number; message: (error: PrismaError) => string }> = {
      P2002: {
        status: HttpStatus.CONFLICT,
        message: (err) => {
          // Extraer campos del meta.target o del mensaje de error
          let fields: string[] = [];

          if (err.meta?.target && Array.isArray(err.meta.target)) {
            fields = err.meta.target;
          } else if (err.message) {
            // Extraer del mensaje: "Unique constraint failed on the fields: (`address`)"
            const match = err.message.match(/fields?: \(`([^`]+)`\)/);
            if (match && match[1]) {
              fields = match[1].split('`,`').map((f) => f.trim());
            }
          }

          const fieldNames = fields.length > 0 ? fields.join(', ') : 'campo';
          return `Ya existe un registro con ese ${fieldNames}`;
        },
      },
      P2025: {
        status: HttpStatus.NOT_FOUND,
        message: () => 'Registro no encontrado',
      },
      P2003: {
        status: HttpStatus.BAD_REQUEST,
        message: () => 'Referencia inválida: el registro relacionado no existe',
      },
      P2014: {
        status: HttpStatus.BAD_REQUEST,
        message: () => 'La relación viola una restricción de integridad',
      },
      P2016: {
        status: HttpStatus.BAD_REQUEST,
        message: () => 'Error en la consulta',
      },
    };

    const errorHandler = prismaErrorMap[error.code];

    if (errorHandler) {
      return {
        status: errorHandler.status,
        message: errorHandler.message(error),
      };
    }

    // Error de Prisma no mapeado
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message:
        process.env.NODE_ENV === 'production' ? 'Error de base de datos' : `Error de base de datos: ${error.code}`,
    };
  }

  private isPrismaError(exception: unknown): boolean {
    return (
      exception !== null &&
      typeof exception === 'object' &&
      'code' in exception &&
      typeof (exception as any).code === 'string' &&
      (exception as any).code.startsWith('P')
    );
  }
}
