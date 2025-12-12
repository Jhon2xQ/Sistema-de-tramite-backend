import { User } from 'src/entities/user.entity';

export interface UserRepository {
  getById(id: number): Promise<User | null>;
  existByUsername(username: string): Promise<boolean>;
  getByUsername(username: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(id: number, user: User): Promise<User>;
}
