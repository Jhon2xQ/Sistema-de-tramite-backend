import { Module } from '@nestjs/common';
import { PersistanceModule } from './persistance.module';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';

@Module({
  imports: [PersistanceModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
