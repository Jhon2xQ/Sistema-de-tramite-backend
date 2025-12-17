import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto, RegisterDto } from 'src/dtos/auth.dto';
import { ApiResponse } from 'src/dtos/response.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res) {
    const foundLogin = await this.authService.login(res, loginDto);
    return ApiResponse.success('Login realizado con exito', foundLogin);
  }

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
