exports.up = (pgm) => {
    pgm.createTable('properties', {
        id: { type:  'serial', primaryKey: true },
        owner_id: { type: 'integer', notNull: true },
        title: { type: 'text', notNull: true },
        city: { type: 'text', notNull: true },
        country: { type: 'text', notNull: true },
        price_per_night: { type: 'numeric', notNull: true },
        bedrooms: { type: 'integer', notNull: true },
        status: { type: 'text', notNull: true, default: 'draft' },
        created_at: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
    });
};


exports.down = (pgm) => {
        pgm.dropTable('properties');
};
