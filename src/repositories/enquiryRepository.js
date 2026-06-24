const { pool } = require('../db');

function toEnquiry(row) {
    if (!row) return null;
    return {
        id: row.id,
        propertyId: row.property_id,
        userId: row.user_id,
        message: row.message,
        source: row.source,
        status: row.status,
        createdAt: row.created_at,
    };
}

async function findAll() {
    const { rows } = await pool.query(
        'SELECT * FROM enquiries ORDER BY created_at DESC'
    );
    return rows.map(toEnquiry);
}

async function findById(id) {
    const { rows } = await pool.query(
        'SELECT * FROM enquiries WHERE id = $1',
        [id]
    );
    return toEnquiry(rows[0]);
}

async function findByPropertyId(propertyId) {
    const { rows } = await pool.query(
        'SELECT * FROM enquiries WHERE property_id = $1 ORDER BY created_at DESC',
        [propertyId]
    );
    return rows.map(toEnquiry);
}

async function create({ propertyId, userId, message, source, status = 'new' }) {
    const { rows } = await pool.query(
        'INSERT INTO enquiries (property_id, user_id, message, source, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [propertyId, userId, message, source, status]
    );
    return toEnquiry(rows[0]);
}

module.exports = { findAll, findById, findByPropertyId, create };