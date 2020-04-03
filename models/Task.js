const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    creator_id: {
        type: String
    },
    name: {
        type: String,
        required: true

    },
    status: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Task', taskSchema)