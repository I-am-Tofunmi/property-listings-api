import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';
import { resetDb, closeDb } from './helpers/db.js';

beforeEach(async () => {
    await resetDb();
});

afterAll(async () => {
    await closeDb();
});

describe('POST /auth/register', () => {
    it('should register a new user and return token', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@test.com', password: 'password123456' });

        expect(res.status).toBe(201);
        expect(res.body.user.email).toBe('test@test.com');
        expect(res.body.token).toBeDefined();
    });

    it('should return 409 if email already taken', async () => {
        await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@test.com', password: 'password123456' });

        const res = await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@test.com', password: 'password123456' });

        expect(res.status).toBe(409);
        expect(res.body.error).toBe('email_taken');
    });

    it('should return 422 if password is too short', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@test.com', password: '123' });

        expect(res.status).toBe(422);
    });
});

describe('POST /auth/login', () => {
    it('should login and return token', async () => {
        await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@test.com', password: 'password123456' });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'password123456' });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
        await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@test.com', password: 'password123456' });

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@test.com', password: 'wrongpassword' });

        expect(res.status).toBe(401);
        expect(res.body.error).toBe('invalid_credentials');
    });
});

describe('GET /auth/me', () => {
    it('should return user profile with valid token', async () => {
        const reg = await request(app)
            .post('/auth/register')
            .send({ name: 'Test User', email: 'test@test.com', password: 'password123456' });

        const res = await request(app)
            .get('/auth/me')
            .set('Authorization', `Bearer ${reg.body.token}`);

        expect(res.status).toBe(200);
        expect(res.body.user.email).toBe('test@test.com');
    });

    it('should return 401 with no token', async () => {
        const res = await request(app).get('/auth/me');
        expect(res.status).toBe(401);
    });
});