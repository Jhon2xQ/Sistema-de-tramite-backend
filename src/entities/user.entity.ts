import { User as PrismaUser } from 'generated/prisma/client';

export class User {
  private _id: number;
  private _username: string;
  private _password: string;
  private _address: string;
  private _active: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor() {}

  static fromPrisma(data: PrismaUser): User {
    const user = new User();

    user._id = data.id;
    user._username = data.username;
    user._password = data.password;
    user._address = data.address;
    user._active = data.active;
    user._createdAt = data.createdAt;
    user._updatedAt = data.updatedAt;

    return user;
  }

  public getId(): number {
    return this._id;
  }

  public getUsername(): string {
    return this._username;
  }

  public getPassword(): string {
    return this._password;
  }

  public getAddress(): string {
    return this._address;
  }

  public getActive(): boolean {
    return this._active;
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public getUpdateAt(): Date {
    return this._updatedAt;
  }

  public setUsername(username: string): void {
    this._username = username;
  }

  public setAddress(address: string): void {
    this._address = address;
  }

  public setActive(active: boolean): void {
    this._active = active;
  }

  public async setPassword(password: string): Promise<void> {
    this._password = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 12 });
  }

  public async isMatchPassword(password: string): Promise<boolean> {
    return await Bun.password.verify(password, this._password, 'bcrypt');
  }
}
