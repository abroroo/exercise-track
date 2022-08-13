const index = require('./index');
const request = require('supertest');
const userNameModel = require('../models/models');


describe('POST /api/users', () => {

    describe('validate username', () => {

    })


    describe('given a username', () => {
        // should save the username and password to the db
        // should respond with a json object containing the user _id

     
            jest.setTimeout(10000)

        test('should use userNameModel once', async() => {
                const response = await request(index).post('/api/users').send({
                    username: 'testUser'
                })
                
                expect(response.userNameModel.mock.calls.length).toBe(1)
            })
            
            
        
         
        test('should respond with a 200 status code', async () => {
            const response = await request(index).post('/api/users').send({
                username: 'testUser'
            })

            expect(response.status).toBe(200)
        })
    
        
        /* 
        
        test('should specify json in the content type header', async () => {
            const response = await request(app).post('/api/users')).send({
                username: 'testUser'
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'))
        })*/

/* 
        test('response has _id', async () => {
            const response = await request(app).post('/api/users')).send({
                username: 'testUser'
            })
            expect(response.body._id).toBeDefined()
        })
*/

    })



})



