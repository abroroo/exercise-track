const app = require('./app');
const request = require('supertest');



describe('GET /', () => {


    describe('homepage loaded', () => {
        // should save the username and password to the db
        // should respond with a json object containing the user _id



        test('should respond with a 200 status code', async () => {
            const response = await request(app).get('/')

            expect(response.status).toBe(200)
        })

        

    })



})



