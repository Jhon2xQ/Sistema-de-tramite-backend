import { JwtService } from '@nestjs/jwt';
import { AccessPayload, RefreshPayload, TokensPair, UserPayload } from 'src/dtos/jwt.dto';
import { ACCESS_JWT_SECRET, ACCESS_JWT_TTL, REFRESH_JWT_SECRET, REFRESH_JWT_TTL } from '../config/env.config';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtUtil {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userPayload: UserPayload): Promise<TokensPair> {
    const accessToken = await this.generateAccessToken(userPayload.getAccessPayload());
    const refreshToken = await this.generateRefreshToken(userPayload.getRefreshpayload());
    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: AccessPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: ACCESS_JWT_TTL,
      secret: ACCESS_JWT_SECRET,
    });
  }

  async generateRefreshToken(payload: RefreshPayload): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: REFRESH_JWT_TTL,
      secret: REFRESH_JWT_SECRET,
    });
  }

  async getAccessPayload(token: string): Promise<AccessPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: ACCESS_JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Access token invalido o caducado');
    }
  }

  async getRefreshPayload(token: string): Promise<RefreshPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: REFRESH_JWT_SECRET,
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh token invalido o caducado');
    }
  }
}
