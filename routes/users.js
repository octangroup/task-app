const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const User = require('../models/User')


// creating user

router.post('/', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send(error)
    }
})

// User login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send()
    }
})

//User logout

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


// getting all users

router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})

// updating a user

router.patch('/me', auth, async (req, res) => {
    if (req.body.username != null) {
        req.user.username = req.body.username
    }
    if (req.body.password != null) {
        req.user.password = req.body.password
    }
    if (req.body.email != null) {
        req.user.email = req.body.email
    }
    try {
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// deleting a user

router.delete('/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.json({
            message: 'User successfully deleted'
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})


module.exports = router