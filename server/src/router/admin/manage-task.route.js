const express = require('express');
const router = express.Router();

const manageTaskController = require('../../controllers/admin/manage-task.controller.js');

// admin/manage-task
router.get('/index', manageTaskController.index);
router.get('/user/:userId', manageTaskController.userTask);

module.exports = router;