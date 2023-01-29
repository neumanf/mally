import { execSync } from 'child_process';
import { StartedPostgreSqlContainer } from 'testcontainers';

export function getDatabaseUrl(container: StartedPostgreSqlContainer) {
    const username = container.getUsername();
    const password = container.getPassword();
    const host = container.getHost();
    const port = container.getPort();
    const database = container.getDatabase();
    const databaseUrl = `postgresql://${username}:${password}@${host}:${port}/${database}?schema=public`;

    execSync(`export DATABASE_URL=${databaseUrl} && npx prisma migrate deploy > /dev/null`, {
        stdio: 'inherit',
    });

    process.env.DATABASE_URL = databaseUrl;

    return databaseUrl;
}
