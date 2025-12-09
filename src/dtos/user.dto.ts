export interface CreateUser {
  username: string;
  password: string;
  address?: string;
}

export interface UpdateUser {
  username?: string;
  password?: string;
  address?: string;
}

export interface PublicUser {
  username: string;
  address: string;
}
