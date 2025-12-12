import { Injectable } from '@nestjs/common';
import { NotFoundUserException } from 'src/common/exceptions/user.exception';
import { LoginDto, PublicUserDto, RegisterDto } from 'src/dtos/auth.dto';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from 'src/persistance/user.repository.impl';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(dto: LoginDto): Promise<PublicUserDto> {
    const foundUser = await this.userRepository.getByUsername(dto.username);
    if (!foundUser) throw new NotFoundUserException('Usuario incorrecto');
    if (!(await foundUser.isMatchPassword(dto.password))) {
      throw new NotFoundUserException('Cotraseña incorrecta');
    }
    return new PublicUserDto(foundUser);
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
