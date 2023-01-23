import { MySqlContainer } from 'testcontainers';

export const mySqlContainer = new MySqlContainer('mysql:8.0');
