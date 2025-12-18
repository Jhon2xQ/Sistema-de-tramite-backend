import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/accessJwt.guard';
import { ExceptionsFilter } from './common/filters/exceptions.filter';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
