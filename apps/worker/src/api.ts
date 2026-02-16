import { Hono } from 'hono';
import { items } from './routes/items.js';
import { errorHandler } from './middleware/error-handler.js';

type Env = { Bindings: { DB: D1Database } };

const app = new Hono<Env>();

app.onError(errorHandler);
app.route('/api/items', items);
app.get('/health', (c) => c.json({ status: 'ok' }));

export { app };
