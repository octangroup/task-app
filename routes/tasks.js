const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/Task')
const router = express.Router()
// getting all your tasks

router.get('/', auth, async (req, res) => {
    const sort = {}
    const match = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    if(req.query.status){
        match.status = req.query.status === 'true'
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit : parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// getting one task

router.get('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            res.status(400).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
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

router.patch('/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name','status']
  const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))
  if(!isValidOperation){
    return  res.status(400).send({error: 'Invalid update'})
  }
    try {
       const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
       if(!task){
           res.status(400).send()
       }
       updates.forEach((update)=>task[update]=req.body[update])
       await task.save()
       res.send(task)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})

// deleting one task

router.delete('/:id', auth, async(req, res) => {
    try {
       const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
       if(!task){
           res.status(400).send()
       }
      res.send(task)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})




module.exports = router