import { Hono } from 'hono';
import { items } from './routes/items.js';
import { corsMiddleware } from './middleware/cors.js';
import { errorHandler } from './middleware/error-handler.js';

type Env = { Bindings: { DB: D1Database; ALLOWED_ORIGINS: string } };

const app = new Hono<Env>();

app.use('*', corsMiddleware());
app.onError(errorHandler);

app.route('/api/items', items);

app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
