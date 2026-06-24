exports.up = (pgm) => {
    pgm.createTable('enquiries', {
        id: { type: 'serial', primaryKey: true },
        property_id: { type: 'integer', notNull: true },
        user_id: { type: 'integer', notNull: true },
        message: { type: 'text', notNull: true },
        source: { type: 'text', notNull: true },
        status: { type: 'text', notNull: true, default: 'new'},
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()')
        },
    });

};


exports.down = (pgm) => {
    pgm.dropTable('enquiries');
};