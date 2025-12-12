import { Injectable } from '@nestjs/common';
import { NotFoundUserException } from 'src/common/exceptions/user.exception';
import { CreateUserDto, PublicUserDto } from 'src/dtos/user.dto';
import { User } from 'src/entities/user.entity';
import { IUserRepository } from 'src/persistance/user.repository.impl';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getByUsername(username: string): Promise<PublicUserDto> {
    const foundUser = await this.userRepository.getByUsername(username);
    if (!foundUser) throw new NotFoundUserException('No se encontro el usuario');
    return new PublicUserDto(foundUser);
  }

  async create(dto: CreateUserDto): Promise<PublicUserDto> {
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
