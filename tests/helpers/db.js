const { pool } = require('../../src/db');

async function resetDb() {
    await pool.query(
        'TRUNCATE enquiries, properties, users RESTART IDENTITY CASCADE'
    );
}

async function makeAdmin(email) {
    await pool.query(
        'UPDATE users SET role=$1 WHERE email=$2',
        ['admin', email]
    );
}

async function closeDb() {
    await pool.end();
}

module.exports = { resetDb, closeDb, makeAdmin };