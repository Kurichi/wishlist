// Minimal Cloudflare type declarations
// Full @cloudflare/workers-types is too large for tsc (OOM)

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
  raw<T = unknown>(options?: { columnNames?: boolean }): Promise<T[]>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  error?: string;
  meta: {
    duration: number;
    last_row_id: number | null;
    changes: number | null;
    served_by: string;
    internal_stats: unknown;
  };
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Cloudflare Workers module declarations
declare module 'cloudflare:workers' {
  export abstract class WorkerEntrypoint<Env = unknown> {
    protected env: Env;
    protected ctx: ExecutionContext;
    constructor(ctx: ExecutionContext, env: Env);
    fetch?(request: Request): Response | Promise<Response>;
  }

  export abstract class DurableObject<Env = unknown> {
    protected env: Env;
    protected ctx: DurableObjectState;
    constructor(ctx: DurableObjectState, env: Env);
  }
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface DurableObjectState {
  readonly id: DurableObjectId;
  readonly storage: DurableObjectStorage;
}

interface DurableObjectId {
  toString(): string;
  equals(other: DurableObjectId): boolean;
  readonly name?: string;
}

interface DurableObjectStorage {
  get<T = unknown>(key: string): Promise<T | undefined>;
  get<T = unknown>(keys: string[]): Promise<Map<string, T>>;
  put<T>(key: string, value: T): Promise<void>;
  put<T>(entries: Record<string, T>): Promise<void>;
  delete(key: string): Promise<boolean>;
  delete(keys: string[]): Promise<number>;
  list<T = unknown>(options?: { start?: string; end?: string; prefix?: string; reverse?: boolean; limit?: number }): Promise<Map<string, T>>;
}
