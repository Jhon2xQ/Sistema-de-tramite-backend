import { UserRepository } from 'src/repositories/user.repository';
import { PrismaConexion } from './prisma-conexion/prisma.conexion';
import { User } from 'src/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaConexion) {}

  async getById(id: number): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    return foundUser ? User.fromPrisma(foundUser) : null;
  }

  async getByUsername(username: string): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: { username },
    });
    return foundUser ? User.fromPrisma(foundUser) : null;
  }

  async existByUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    return user !== null;
  }

  async create(user: User): Promise<User> {
    const foundUser = await this.prisma.user.create({
      data: {
        username: user.getUsername(),
        password: user.getPassword(),
        address: user.getAddress(),
        active: user.getActive(),
      },
    });
    return User.fromPrisma(foundUser);
  }

  async update(id: number, user: User): Promise<User> {
    const foundUser = await this.prisma.user.update({
      where: { id },
      data: {
        username: user.getUsername(),
        password: user.getPassword(),
        address: user.getAddress(),
        active: user.getActive(),
      },
    });
    return User.fromPrisma(foundUser);
  }
}
