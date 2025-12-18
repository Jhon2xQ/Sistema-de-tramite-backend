import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { REFRESH_TOKEN } from 'src/common/config/env.config';
import { AuthException } from 'src/common/exceptions/auth.exception';
import { CookieUtil } from 'src/common/utils/cookie.util';
import { JwtUtil } from 'src/common/utils/jwt.util';
import { LoginDto, LoginResponse, RegisterDto, RegisterResponse } from 'src/dtos/auth.dto';
import { UserPayload } from 'src/dtos/jwt.dto';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from 'src/persistance/user.repository.impl';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtUtil: JwtUtil,
    private readonly cookieUtil: CookieUtil,
  ) {}

  async login(res: Response, dto: LoginDto): Promise<LoginResponse> {
    const foundUser = await this.userRepository.getByUsername(dto.username);
    if (!foundUser) throw AuthException.invalidCredentials();
    if (!foundUser.getActive()) throw AuthException.userIsDesactivate();
    if (!(await foundUser.isMatchPassword(dto.password))) {
      throw AuthException.invalidPassword();
    }
    const tokens = await this.jwtUtil.generateTokens(new UserPayload(foundUser));
    this.cookieUtil.generateCookie(res, REFRESH_TOKEN, tokens.refreshToken);
    return { accessToken: tokens.accessToken, username: foundUser.getUsername() };
  }

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const existUser = await this.userRepository.existByUsername(dto.username);
    if (existUser) throw AuthException.userAlreadyExists();
    const user = new User();
    user.setUsername(dto.username);
    await user.setPassword(dto.password);
    user.setAddress('mywalletaddress');
    const foundUser = await this.userRepository.create(user);
    return { username: foundUser.getUsername(), address: foundUser.getAddress() };
  }

  async refreshToken(id: number, res: Response): Promise<LoginResponse> {
    const foundUser = await this.userRepository.getById(id);
    if (!foundUser!.getActive()) throw AuthException.userIsDesactivate();
    const tokens = await this.jwtUtil.generateTokens(new UserPayload(foundUser!));
    this.cookieUtil.generateCookie(res, REFRESH_TOKEN, tokens.refreshToken);
    return { accessToken: tokens.accessToken, username: foundUser?.getUsername()! };
  }

  async logout(res: Response): Promise<void> {
    this.cookieUtil.clearCookie(res, REFRESH_TOKEN);
  }
}
