import { PostgreSqlContainer } from 'testcontainers';

export const postgresContainer = new PostgreSqlContainer('postgres:15.1-alpine');
