const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const Task = require('../../models/Task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id:userOneId,
    username:'peter',
    email:'peter@example.com',
    password:'peter123',
    tokens :[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id:userTwoId,
    username:'paul',
    email:'paul@example.com',
    password:'paul123',
    tokens :[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    name:'first task',
    status: false,
    owner:userOne._id
}

// const taskTwo= {
//     _id: new mongoose.Types.ObjectId(),
//     name:'second task',
//     status: true,
//     owner:userTwo._id
// }

const setUpDatabase = async () =>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    // await new Task(userTwo).save()
}

module.exports = {
    userOne,
    userOneId,
    userTwo,
    userTwoId,
    taskOne,
    // taskTwo,
    setUpDatabase
}