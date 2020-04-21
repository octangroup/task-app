const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const User = require('../models/User')


// creating user

router.post('/', async(req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})

// User login
router.post('/login', async (req , res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

//User logout

router.post('/logout',auth, async (req,res)=>{
    try {
      req.user.tokens = req.user.tokens.filter((token)=>{
        return token.token !== req.token
      })
      await req.user.save()
      res.send()
    } catch (error) {
      res.status(500).send()
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

// updating a user

router.patch('/:id', getUser, async(req, res) => {
    if(req.body.username != null ){
        res.user.username = req.body.username
    }
    if(req.body.password != null){
        res.user.password = req.body.password
    }
    if(req.body.email != null){
        res.user.email = req.body.email
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// deleting a user

router.delete('/:id', getUser, (req, res) => {
    try {
        res.user.remove()
        res.json({ message: 'User successfully deleted'})
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

// getting a user

async function getUser(req,res,next){
    let user
    try {
        user = await User.findById(req.params.id)
        if(user == null){
            res.status(404).json({ message: 'can not find user'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
    res.user = user
    next()
}


module.exports = router