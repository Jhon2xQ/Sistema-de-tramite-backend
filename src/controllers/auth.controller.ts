import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':username')
  async getUser(@Param('username') username: string) {
    return this.authService.getByUsername(username);
  }

  @Post('create')
  async createUser(@Body() createDto: CreateUserDto) {
    return this.authService.create(createDto);
  }
}
