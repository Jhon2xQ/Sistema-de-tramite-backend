import { Module } from '@nestjs/common';
import { PersistanceModule } from './persistance.module';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { JwtUtil } from 'src/common/utils/jwt.util';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PersistanceModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtUtil],
})
export class AuthModule {}
