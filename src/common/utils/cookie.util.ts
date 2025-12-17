import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { COOKIE_HTTP_ONLY, COOKIE_MAX_AGE, COOKIE_PATH, COOKIE_SAME_SITE, COOKIE_SECURE } from '../config/env.config';

@Injectable()
export class CookieUtil {
  private getCookieOptions(): CookieOptions {
    return {
      httpOnly: COOKIE_HTTP_ONLY,
      secure: COOKIE_SECURE,
      sameSite: COOKIE_SAME_SITE as 'none' | 'lax' | 'strict' | boolean,
      path: COOKIE_PATH,
    };
  }
  generateCookie(response: Response, name: string, value: string): void {
    const options = this.getCookieOptions();
    response.cookie(name, value, {
      ...options,
      maxAge: COOKIE_MAX_AGE,
      signed: false,
    });
  }

  clearCookie(response: Response, name: string): void {
    const options = this.getCookieOptions();
    response.clearCookie(name, options);
  }
}
