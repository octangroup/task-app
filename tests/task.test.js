const request = require('supertest')
const Task = require('../models/Task')
const app = require('../app')
const {userOne, setUpDatabase,userTwo,taskOne} = require('./fixtures/db')

beforeEach(setUpDatabase)

test(' Authenticated user should create a task', async()=>{
     request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'Go outside'
    })
    .expect(201)

})

test('Authenticated user can delete his tasks',async()=>{
    request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})
 test('Authenticated user can update his tasks', async()=>{
     request(app)
     .patch(`/tasks/${taskOne._id}`)
     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)
 })
 test('Authenticated user can view his tasks',async()=>{
    const response = await request(app)
     .get('/tasks')
     .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
     .send()
     .expect(200)
   expect(response.body.length).toEqual(1)
 })