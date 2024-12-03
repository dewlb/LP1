import request from 'supertest';
import router from '../server.js'; 

describe('POST /createTournament', () => {

    test('should create a new tournament', async () => {
        const response = await request(router)
            .post('/api/createTournament')
            .send({
                name: 'Test Tournament',
                userID: '12345',
                size: 16,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Tournament created succesfully');
        expect(response.body.info).toMatchObject({
            name: 'Test Tournament',
            owner: '12345',
            max_size: 16,
            current_size: 0,
            participants: [],
            status:0
        });
    });

    test('should not allow duplicate tournament names', async () => {

        const response = await request(router)
            .post('/api/createTournament')
            .send({
                name: 'Test Tournament',
                userID: '67890',
                size: 16,
            });

        expect(response.statusCode).toBe(409);
        expect(response.body.error).toBe('Tournament with this name already exists');
    });
});
