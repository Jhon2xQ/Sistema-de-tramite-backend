import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { RefreshJwtAuthGuard } from 'src/common/guards/refreshJwt.guard';
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
    const foundRegister = await this.authService.register(registerDto);
    return ApiResponse.success('Registro realizado con exito', foundRegister);
  }

  @Public()
  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh-token')
  async refreshToken(@CurrentUser() user, @Res({ passthrough: true }) res) {
    const foundRefresh = await this.authService.refreshToken(user.sub, res);
    return ApiResponse.success('Token refrescado con exito', foundRefresh);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res) {
    this.authService.logout(res);
    return ApiResponse.success('logout exitoso');
  }
}
