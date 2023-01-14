export default () => ({
    frontendUrl: process.env.FRONTEND_URL,
    port: parseInt(process.env.PORT, 10) || 3000,
    databaseUrl: process.env.DATABASE_URL,
});