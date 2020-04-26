const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/User')
const {
    userOne,
    userTwo,
    userOneId,
    setUpDatabase
} = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should sign up a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            username: 'patron',
            email: 'patron@example.com',
            password: 'patron123'
        })
        .expect(201)

    //Assert that there is something in database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()
})

test('An existing user should login', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)

    // validate new token is saved
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('an authenticated user should logout', async () => {
     request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('An authenticated user should see his profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('An authenticated user should update his profile', async () => {
      await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            username: 'chryso'
        })
        .expect(200)
})

test('an authenticated user should delete his own account', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should upload a profile picture of an authanticated user',async()=>{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/prome.jpg')
    .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})