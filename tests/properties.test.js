import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { resetDb, closeDb, makeAdmin } from './helpers/db.js';


let adminToken;
let userToken;

beforeEach(async () => {
    await resetDb();

    const admin = await request(app)
        .post('/auth/register')
        .send({ name: 'Admin', email: 'admin-prop@test.com', password: 'password123456' });

    await makeAdmin('admin-prop@test.com');

    const adminLogin = await request(app)
        .post('/auth/login')
        .send({ email: 'admin-prop@test.com', password: 'password123456' });
    adminToken = adminLogin.body.token;

    const user = await request(app)
        .post('/auth/register')
        .send({ name: 'User', email: 'user-prop@test.com', password: 'password123456' });
    userToken = user.body.token;
});


afterAll(async () => {
    await closeDb();
});

describe('GET /properties', () => {
    it('should return all properties publicly', async () => {
        const res = await request(app).get('/properties');
        expect(res.status).toBe(200);
        expect(res.body.data).toBeDefined();
    });
});

describe('POST /properties', () => {
    it('should create property with admin token', async () => {
        const res = await request(app)
            .post('/properties')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: 'Test House', city: 'Lagos', country: 'Nigeria', pricePerNight: 50000, bedrooms: 3, status: 'live' });

        expect(res.status).toBe(201);
        expect(res.body.data.title).toBe('Test House');
    });

    it('should return 401 with no token', async () => {
        const res = await request(app)
            .post('/properties')
            .send({ title: 'Test House', city: 'Lagos', country: 'Nigeria', pricePerNight: 50000, bedrooms: 3, status: 'live' });

        expect(res.status).toBe(401);
    });

    it('should return 403 with user token', async () => {
        const res = await request(app)
            .post('/properties')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ title: 'Test House', city: 'Lagos', country: 'Nigeria', pricePerNight: 50000, bedrooms: 3, status: 'live' });

        expect(res.status).toBe(403);
    });
});