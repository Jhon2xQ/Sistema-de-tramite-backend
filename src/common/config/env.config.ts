export const PORT = Number(Bun.env.PORT ?? '3000');

export const REFRESH_TOKEN = 'refreshToken';
export const ACCESS_JWT_TTL = Number(Bun.env.ACCESS_JWT_TTL ?? '900'); // 15 min
export const REFRESH_JWT_TTL = Number(Bun.env.REFRESH_JWT_TTL ?? '18000'); // 30 días
export const ACCESS_JWT_SECRET = Bun.env.ACCESS_JWT_SECRET ?? 'tu-super-secreto-access-muy-largo-y-seguro';
export const REFRESH_JWT_SECRET = Bun.env.REFRESH_JWT_SECRET ?? 'tu-super-secreto-refresh-aun-mas-largo-y-diferente';

export const COOKIE_HTTP_ONLY = Boolean(Bun.env.COOKIE_HTTP_ONLY ?? true);
export const COOKIE_SECURE = Boolean(Bun.env.COOKIE_SECURE ?? false);
export const COOKIE_SAME_SITE = Bun.env.COOKIE_SAME_SITE ?? 'none';
export const COOKIE_PATH = Bun.env.COOKIE_PATH ?? '/auth/refresh-token';
export const COOKIE_MAX_AGE = Number(Bun.env.COOKIE_MAX_AGE ?? '18000000');
