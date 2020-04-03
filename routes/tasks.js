const express = require('express')
const router = express.Router()

const Task = require('../models/Task')

// getting all tasks

router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    } catch (error) {
        res.status(500).json({ message: error.message})
    }
})

// getting one task

router.get('/:id', getTask, (req, res) => {
    res.json(res.task)
})

// creating one task

router.post('/', async (req, res) => {
    const task = new Task({
        creator_id: req.body.creator_id,
        name: req.body.name,
        status: req.body.status
    })

    try {
        const newTask = await task.save()
        res.status(201).json(newTask)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})



async function getTask(req, res, next){
    let task
    try {
        task = await Task.findById(req.params.id)
        if(task == null){
            return res.status(404).json({ message: 'can not find task'})
        }
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }

    res.task = task
    next()
}

module.exports = router