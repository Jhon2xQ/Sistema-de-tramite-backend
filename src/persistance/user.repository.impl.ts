import { UserRepository } from 'src/repositories/user.repository';
import { PrismaConexion } from './prisma-conexion/prisma.conexion';
import { User } from 'src/models/user.model';
import { CreateUser, UpdateUser } from 'src/dtos/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaConexion) {}

  async getById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async create(user: CreateUser): Promise<User> {
    return this.prisma.user.create({
      data: user,
    });
  }

  async update(id: number, user: UpdateUser): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: user,
    });
  }
}
