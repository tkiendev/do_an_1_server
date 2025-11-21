const express = require('express');
const router = express.Router();

const groupController = require('../../controllers/user/group.controller.js');

router.get('/index', groupController.index);

module.exports = router;