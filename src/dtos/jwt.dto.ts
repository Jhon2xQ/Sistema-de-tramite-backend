import { User } from 'src/entities/user.entity';

export interface AccessPayload {
  sub: number;
  type: string;
  address: string;
  jti: string;
}

export interface RefreshPayload {
  sub: number;
  type: string;
  jti: string;
}

export class UserPayload {
  private readonly _sub: number;
  private readonly _address: string;
  private readonly _jti: string;

  constructor(user: User) {
    this._sub = user.getId();
    this._address = user.getAddress();
    this._jti = crypto.randomUUID();
  }

  getAccessPayload(): AccessPayload {
    return {
      sub: this._sub,
      type: 'accessToken',
      address: this._address,
      jti: this._jti,
    };
  }

  getRefreshpayload(): RefreshPayload {
    return {
      sub: this._sub,
      type: 'refreshToken',
      jti: this._jti,
    };
  }
}

export class TokensPair {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
