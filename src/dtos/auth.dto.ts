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

export interface loginResponse {
  accessToken: string;
  username: string;
}

export interface registerResponse {
  username: string;
  address: string;
}
