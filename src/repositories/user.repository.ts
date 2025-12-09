import { CreateUser, UpdateUser } from 'src/dtos/user.dto';
import { User } from 'src/models/user.model';

export interface UserRepository {
  getById(id: number): Promise<User | null>;
  getByUsername(username: string): Promise<User | null>;
  create(user: CreateUser): Promise<User>;
  update(id: number, user: UpdateUser): Promise<User>;
}
