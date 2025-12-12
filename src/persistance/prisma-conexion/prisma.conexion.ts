import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaConexion extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // 1. Configuramos la conexión 'pg' usando Bun.env
    const connectionString = Bun.env.DATABASE_URL;

    // 3. Creamos el adaptador
    const adapter = new PrismaPg({ connectionString });

    // 4. Se lo pasamos al padre (PrismaClient)
    super({ adapter });
  }
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
