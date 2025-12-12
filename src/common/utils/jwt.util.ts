import { JwtService } from '@nestjs/jwt';
import { AccessPayload, RefreshPayload, TokensPair, UserPayload } from 'src/dtos/jwt.dto';
import { ACCESS_JWT_SECRET, ACCESS_JWT_TTL, REFRESH_JWT_SECRET, REFRESH_JWT_TTL } from '../config/env.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtUtil {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokens(userPayload: UserPayload): Promise<TokensPair> {
    const accessToken = await this.generateAccessToken(userPayload.getAccessPayload());
    const refreshToken = await this.generateRefreshToken(userPayload.getRefreshpayload());
    return new TokensPair(accessToken, refreshToken);
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
}
