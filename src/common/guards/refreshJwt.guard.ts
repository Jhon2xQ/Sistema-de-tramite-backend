import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET, REFRESH_TOKEN } from '../config/env.config';
import { AccessPayload, RefreshPayload } from 'src/dtos/jwt.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshJwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const accessToken = this.extractTokenFromHeader(request);
    if (!accessToken) throw new UnauthorizedException('Access token no encontrado');
    const refreshToken = request.cookies?.[REFRESH_TOKEN];
    if (!refreshToken) throw new UnauthorizedException('Refresh token no encontrado');
    const isValid = await this.compareJti(accessToken, refreshToken);
    if (!isValid) throw new UnauthorizedException('Tokens no asociados');
    request['user'] = await this.getRefreshPayload(refreshToken);
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async compareJti(accessToken: string, refreshToken: string): Promise<boolean> {
    const accessPayload = await this.getAccessPayload(accessToken);
    const refreshPayload = await this.getRefreshPayload(refreshToken);
    return accessPayload.jti === refreshPayload.jti;
  }

  private async getAccessPayload(token: string): Promise<AccessPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: ACCESS_JWT_SECRET,
        ignoreExpiration: true,
      });
    } catch (error) {
      throw new UnauthorizedException('Access token invalido o caducado');
    }
  }

  private async getRefreshPayload(token: string): Promise<RefreshPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: REFRESH_JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalido o caducado');
    }
  }
}
