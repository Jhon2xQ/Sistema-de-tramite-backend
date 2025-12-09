export interface User {
  id: number;
  username: string;
  password: string;
  address: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
