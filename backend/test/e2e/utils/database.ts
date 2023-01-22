import { execSync } from 'child_process';
import { StartedMySqlContainer } from 'testcontainers';

export function getDatabaseUrl(container: StartedMySqlContainer) {
    const password = container.getRootPassword();
    const host = container.getHost();
    const port = container.getPort();
    const database = container.getDatabase();
    const databaseUrl = `mysql://root:${password}@${host}:${port}/${database}`;

    execSync(`export DATABASE_URL=${databaseUrl} && npx prisma migrate deploy`, {
        stdio: 'inherit',
    });

    process.env.DATABASE_URL = databaseUrl;

    return databaseUrl;
}
