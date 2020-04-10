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

// updating one task

router.patch('/:id', getTask, async(req,res) => {
    if(req.body.creator_id != null){
        res.task.creator_id = req.body.creator_id
    }
    if(req.body.name !=null){
        req.task.name = req.body.name
    }
    if(req.body.status != null){
        req.task.status = req.body.status
    }
    try {
        const updatedTask = await req.task.save()
        res.json(updatedTask)
    } catch (error) {
        res.status(400).json({ message: error.message})
    }
})

// deleting one task

router.delete('/:id', getTask, (req,res) => {
    try {
        res.task.remove()
        res.json({message: 'Task Deleted' })
    } catch (error) {
        res.status(500).json({message: error.message})
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