import { cors } from 'hono/cors';
import type { Context, MiddlewareHandler } from 'hono';

type Env = { Bindings: { ALLOWED_ORIGINS: string } };

export function corsMiddleware(): MiddlewareHandler<Env> {
  return async (c, next) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());

    const handler = cors({
      origin: (origin) => {
        if (allowedOrigins.includes(origin)) {
          return origin;
        }
        return '';
      },
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type'],
      maxAge: 86400,
    });

    return handler(c, next);
  };
}
