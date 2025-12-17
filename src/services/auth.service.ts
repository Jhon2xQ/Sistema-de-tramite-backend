import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { REFRESH_TOKEN } from 'src/common/config/env.config';
import { NotFoundUserException } from 'src/common/exceptions/user.exception';
import { CookieUtil } from 'src/common/utils/cookie.util';
import { JwtUtil } from 'src/common/utils/jwt.util';
import { LoginDto, loginResponse, RegisterDto, registerResponse } from 'src/dtos/auth.dto';
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

  async login(res: Response, dto: LoginDto): Promise<loginResponse> {
    const foundUser = await this.userRepository.getByUsername(dto.username);
    if (!foundUser) throw new NotFoundUserException('Usuario incorrecto');
    if (!(await foundUser.isMatchPassword(dto.password))) {
      throw new NotFoundUserException('Cotraseña incorrecta');
    }
    const tokens = await this.jwtUtil.generateTokens(new UserPayload(foundUser));
    this.cookieUtil.generateCookie(res, REFRESH_TOKEN, tokens.refreshToken);
    return { accessToken: tokens.accessToken, username: foundUser.getUsername() };
  }

  async register(dto: RegisterDto): Promise<registerResponse> {
    const existUser = await this.userRepository.existByUsername(dto.username);
    if (existUser) throw new NotFoundUserException('usuario ya existe');
    const user = new User();
    user.setUsername(dto.username);
    await user.setPassword(dto.password);
    user.setAddress('mywalletaddress');
    const foundUser = await this.userRepository.create(user);
    return { username: foundUser.getUsername(), address: foundUser.getAddress() };
  }
}
