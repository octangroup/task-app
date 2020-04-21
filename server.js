require('dotenv').config()
require('./db/mongoose')
const express = require('express')
const app = express()

app.use(express.json())

const taskRouter = require('./routes/tasks')
app.use('/tasks', taskRouter)

const userRouter = require('./routes/users')
app.use('/users', userRouter)


app.listen(3002, () => console.log('server started'))
