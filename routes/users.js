const express = require('express');
const router = express.Router();

const User = require('../models/User')


// creating user

router.post('/', async(req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
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

router.post('/upload-avatar', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./uploads/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router