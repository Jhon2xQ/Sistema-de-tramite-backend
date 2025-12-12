import { Module } from '@nestjs/common';
import { PrismaConexion } from 'src/persistance/prisma-conexion/prisma.conexion';

@Module({
  providers: [PrismaConexion],
  exports: [PrismaConexion],
})
export class PrismaModule {}
