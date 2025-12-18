import { User } from 'src/entities/user.entity';

export interface AccessPayload {
  sub: number;
  address: string;
  jti: string;
}

export interface RefreshPayload {
  sub: number;
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
      address: this._address,
      jti: this._jti,
    };
  }

  getRefreshpayload(): RefreshPayload {
    return {
      sub: this._sub,
      jti: this._jti,
    };
  }
}

export interface TokensPair {
  accessToken: string;
  refreshToken: string;
}
