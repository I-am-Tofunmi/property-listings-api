const { pool } = require('../db');

function toUser(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        passwordHash: row.password_hash,
        role: row.role,
        createdAt: row.created_at,
    };
}

async function findByEmail(email) {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return toUser(rows[0]);
}

async function findById(id) {
    const { rows } = await pool.query(
        'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
        [id]
    );
    return toUser(rows[0]);
}

async function createUser({ name, email, passwordHash, role = 'user' }) {
    const { rows } = await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
        [name, email, passwordHash, role]
    );
    return toUser(rows[0]);
}
async function findAll() {
    const { rows } = await pool.query(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows.map(toUser);
}

async function updateUser(id, { name, email }) {
    const { rows } = await pool.query(
        'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role, created_at',
        [name, email, id]
    );
    return toUser(rows[0]);
}

async function removeUser(id) {
    const { rows } = await pool.query(
        'DELETE FROM users WHERE id=$1 RETURNING *',
        [id]
    );
    return toUser(rows[0]);
}

module.exports = { findByEmail, findById, createUser, findAll, updateUser, removeUser };