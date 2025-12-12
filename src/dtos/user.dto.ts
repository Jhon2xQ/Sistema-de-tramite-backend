import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class PublicUserDto {
  username: string;
  address: string;

  constructor(user: User) {
    this.username = user.getUsername();
    this.address = user.getAddress();
  }
}
