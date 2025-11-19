const express = require('express');
const router = express.Router();

const taskController = require('../../controllers/user/manage-task.controller.js');

// /user/manage-task
router.get('/:clubId', taskController.index);
router.get('/list-event/:clubId', taskController.listByEvent);
router.post('/create/:eventId', taskController.create);
router.get('/list-user/:eventId', taskController.listByUser);
router.get('/calendar/:tokenUser', taskController.calendar);
router.get('/detail/:taskId', taskController.detailTask);
router.put('/update/:taskId', taskController.updateTask);

module.exports = router;