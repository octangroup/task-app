require('dotenv').config()

const express = require('express')
const app = express()

var mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/tasks', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const tasksRouter = require('./routes/tasks')
app.use('/tasks', tasksRouter)
'localhost:3000/tasks'

app.listen(3000, () => console.log('server started'))
