exports.up = (pgm) => {
    pgm.createTable('users', {
        id: { type: 'serial', primaryKey: true },
        name: { type: 'text', notNull: true },
        email: { type: 'text', notNull: true, unique: true },
        password_hash: { type: 'text', notNull: true },
        role: { type: 'text', notNull: true, default: 'user' },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });

    };
    
exports.down = (pgm) => {
    pgm.dropTable('users');
};