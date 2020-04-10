const express = require('express')
const router = express.Router()

const User = require('../models/User')

// creating user

router.post('/', async(req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// getting all users

router.get('/', async(req,res) => {
    try {
        const allUsers = await User.find()
        res.send(allUsers)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})