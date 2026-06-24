import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { resetDb, closeDb, makeAdmin } from './helpers/db.js';

let adminToken;
let userToken;
let propertyId;

beforeEach(async () => {
    await resetDb();

    const admin = await request(app)
        .post('/auth/register')
        .send({ name: 'Admin', email: 'admin-enq@test.com', password: 'password123456' });

    await makeAdmin('admin-enq@test.com');

    const adminLogin = await request(app)
        .post('/auth/login')
        .send({ email: 'admin-enq@test.com', password: 'password123456' });
    adminToken = adminLogin.body.token;

    const user = await request(app)
        .post('/auth/register')
        .send({ name: 'User', email: 'user-enq@test.com', password: 'password123456' });
    userToken = user.body.token;

    const property = await request(app)
        .post('/properties')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Test House', city: 'Lagos', country: 'Nigeria', pricePerNight: 50000, bedrooms: 3, status: 'live' });
    propertyId = property.body.data.id;
});

afterAll(async () => {
    await closeDb();
});

describe('POST /enquiries', () => {
    it('should create enquiry when logged in', async () => {
        const res = await request(app)
            .post('/enquiries')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ propertyId, message: 'Is this available?', source: 'web' });

        expect(res.status).toBe(201);
        expect(res.body.data.message).toBe('Is this available?');
    });

    it('should return 401 with no token', async () => {
        const res = await request(app)
            .post('/enquiries')
            .send({ propertyId: 1, message: 'Is this available?', source: 'web' });

        expect(res.status).toBe(401);
    });
});

describe('GET /enquiries', () => {
    it('should return all enquiries for admin', async () => {
        const res = await request(app)
            .get('/enquiries')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
    });

    it('should return 403 for regular user', async () => {
        const res = await request(app)
            .get('/enquiries')
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.status).toBe(403);
    });
});