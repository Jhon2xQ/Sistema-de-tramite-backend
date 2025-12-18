import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/user.entity';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  username: string;
}

export interface RegisterResponse {
  username: string;
  address: string;
}
