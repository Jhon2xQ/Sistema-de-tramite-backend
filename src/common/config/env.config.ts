export const PORT = Number(Bun.env.PORT ?? '3000');

export const ACCESS_JWT_TTL = Number(Bun.env.ACCESS_JWT_TTL ?? '900'); // 15 min
export const REFRESH_JWT_TTL = Number(Bun.env.REFRESH_JWT_TTL ?? '2592000'); // 30 días
export const ACCESS_JWT_SECRET = Bun.env.ACCESS_JWT_SECRET ?? 'tu-super-secreto-access-muy-largo-y-seguro';
export const REFRESH_JWT_SECRET = Bun.env.REFRESH_JWT_SECRET ?? 'tu-super-secreto-refresh-aun-mas-largo-y-diferente';
