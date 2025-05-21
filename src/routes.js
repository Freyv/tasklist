const express = require('express');
const route = express.Router();
const User = require('./modules/User')
const project = require('./modules/Project')
const authMiddleware = require('./modules/authMiddleware')
const Task = require('./modules/Task')


route.get('/',(req,res) =>{
    res.send('invalid page')
})
// Rotas de usuario
route.post('/users',User.create)
route.get('/users', authMiddleware, User.get)
route.post('/login',User.login)

// rotas de projeto
route.post('/projects',authMiddleware,project.create)
route.get('/projects/mine',authMiddleware,project.getbyowerid)
route.put('/projects/:id',authMiddleware,project.update)

//rotas de task
route.get('/projects/:projectId/tasks',authMiddleware,Task.getbyProjectId)
route.post('/projects/:projectId',authMiddleware, Task.create)
route.get('/:userID/tasks',authMiddleware,Task.getbyassignedId)
module.exports = route