const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/Task')
const router = express.Router()
// getting all your tasks

router.get('/', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'tasks'
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// getting one task

router.get('/:id', getTask, (req, res) => {
    res.json(res.task)
})

// creating one task

router.post('/', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// updating a task

router.patch('/:id', getTask, async (req, res) => {
    if (req.body.name != null) {
        req.task.name = req.body.name
    }
    if (req.body.status != null) {
        req.task.status = req.body.status
    }
    try {
        const updatedTask = await req.task.save()
        res.json(updatedTask)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// deleting one task

router.delete('/:id', getTask, (req, res) => {
    try {
        res.task.remove()
        res.json({
            message: 'Task Deleted'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})


async function getTask(req, res, next) {
    let task
    try {
        task = await Task.findById(req.params.id)
        if (task == null) {
            return res.status(404).json({
                message: 'can not find task'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

    res.task = task
    next()
}

module.exports = router