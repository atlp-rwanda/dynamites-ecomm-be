import request from 'supertest';
import app from '../app';
import { getBuyerToken, afterAllHook, beforeAllHook } from './testSetup';


beforeAll(beforeAllHook);
afterAll(afterAllHook);


describe('Image upload Tests', () => {
    let token: string;

    beforeAll(async () => {
        token = await getBuyerToken()
    });

    it('should delete profile image successfully', async() => {
        const response = await request(app).delete('/api/v1/user/profileImg').set('Authorization',`Bearer ${token}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Profile image successfully deleted')
        expect(response.body.data).toBeDefined()
    })
})    