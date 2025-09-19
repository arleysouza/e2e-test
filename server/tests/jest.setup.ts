import dotenv from "dotenv";
import { Pool } from "pg";
import Redis from "ioredis";
dotenv.config();

beforeAll(async () => {
  // Conectar ao PostgreSQL
  global.pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT || 5433),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
  await global.pool.query("SELECT 1");

  // Conectar ao Redis
  global.redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  });
  await global.redis.ping();
});

beforeEach(async () => {
  // Limpa tabelas a cada teste
  await global.pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
  await global.redis.flushall();
});

afterEach(async () => {
  // Limpa tabelas e Redis após cada teste
  await global.pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;");
  await global.redis.flushall();
});

afterAll(async () => {
  await global.pool.end();
  await global.redis.quit();
  jest.restoreAllMocks();
});
