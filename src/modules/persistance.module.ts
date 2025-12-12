import { Module } from '@nestjs/common';
import { IUserRepository } from 'src/persistance/user.repository.impl';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [IUserRepository],
  exports: [IUserRepository],
})
export class PersistanceModule {}
