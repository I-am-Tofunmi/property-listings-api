const pg = require('pg');
const config = require('./config');

const pool = new pg.Pool({
    connectionString: config.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
});

pool.on('error', (err) => {
    console.error('idle pg client error', err);
    process.exit(1);
});

module.exports = { pool };