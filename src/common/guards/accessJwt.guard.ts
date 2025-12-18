import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AccessPayload } from 'src/dtos/jwt.dto';
import { ACCESS_JWT_SECRET } from '../config/env.config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new UnauthorizedException('Token no encontrado');
    const payload = await this.getAccessPayload(accessToken);
    request['user'] = payload;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async getAccessPayload(token: string): Promise<AccessPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: ACCESS_JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Access token invalido o caducado');
    }
  }
}
