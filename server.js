require('dotenv').config()
const express = require('express')
const app = express()

const fileUpload = require('express-fileupload')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const _ = require('lodash')

var mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(bodyParser().json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

const taskRouter = require('./routes/tasks')
app.use('/tasks', taskRouter)

const userRouter = require('./routes/users')
app.use('/users', userRouter)


app.listen(3002, () => console.log('server started'))
