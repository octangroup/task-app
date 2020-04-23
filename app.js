const express = require('express')
require('./db/mongoose')
require('dotenv').config()


const app = express()
app.use(express.json())

const taskRouter = require('./routes/tasks')
app.use('/tasks', taskRouter)

const userRouter = require('./routes/users')
app.use('/users', userRouter)

module.exports = app