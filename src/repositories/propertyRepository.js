const { pool } = require('../db');

function toProperty(row) {
    if (!row) return null;
    return {
        id: row.id,
        ownerId: row.owner_id,
        title: row.title,
        city: row.city,
        country: row.country,
        pricePerNight: parseFloat(row.price_per_night),
        bedrooms: row.bedrooms,
        status: row.status,
        createdAt: row.created_at,
    };
}

async function findAll() {
    const { rows } = await pool.query(
        'SELECT * FROM properties ORDER BY created_at DESC'
    );
    return rows.map(toProperty);
}

async function findById(id) {
    const { rows } = await pool.query(
        'SELECT * FROM properties WHERE id = $1',
        [id]
    );
    return toProperty(rows[0]);
}

async function create({ ownerId, title, city, country, pricePerNight, bedrooms, status = 'draft' }) {
    const { rows } = await pool.query(
        'INSERT INTO properties (owner_id, title, city, country, price_per_night, bedrooms, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [ownerId, title, city, country, pricePerNight, bedrooms, status]
    );
    return toProperty(rows[0]);
}

async function update(id, fields) {
    const { rows } = await pool.query(
        'UPDATE properties SET title=$1, city=$2, country=$3, price_per_night=$4, bedrooms=$5, status=$6 WHERE id=$7 RETURNING *',
        [fields.title, fields.city, fields.country, fields.pricePerNight, fields.bedrooms, fields.status, id]
    );
    return toProperty(rows[0]);
}

async function remove(id) {
    const { rows } = await pool.query(
        'DELETE FROM properties WHERE id = $1 RETURNING *',
        [id]
    );
    return toProperty(rows[0]);
}

module.exports = { findAll, findById, create, update, remove };