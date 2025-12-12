import { Injectable } from '@nestjs/common';
import { NotFoundUserException } from 'src/common/exceptions/user.exception';
import { JwtUtil } from 'src/common/utils/jwt.util';
import { LoginDto, PublicUserDto, RegisterDto } from 'src/dtos/auth.dto';
import { TokensPair, UserPayload } from 'src/dtos/jwt.dto';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from 'src/persistance/user.repository.impl';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtUtil: JwtUtil,
  ) {}

  async login(dto: LoginDto): Promise<TokensPair> {
    const foundUser = await this.userRepository.getByUsername(dto.username);
    if (!foundUser) throw new NotFoundUserException('Usuario incorrecto');
    if (!(await foundUser.isMatchPassword(dto.password))) {
      throw new NotFoundUserException('Cotraseña incorrecta');
    }
    const tokens = await this.jwtUtil.generateTokens(new UserPayload(foundUser));
    return tokens;
  }

  async register(dto: RegisterDto): Promise<PublicUserDto> {
    if (await this.userRepository.existByUsername(dto.username)) {
      throw new NotFoundUserException('usuario ya existe');
    }
    const user = new User();
    user.setUsername(dto.username);
    user.setAddress('mywalletaddress');
    await user.setPassword(dto.password);
    const foundUser = await this.userRepository.create(user);
    return new PublicUserDto(foundUser);
  }
}
