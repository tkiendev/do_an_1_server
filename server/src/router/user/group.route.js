const express = require('express');
const router = express.Router();

const groupController = require('../../controllers/user/group.controller.js');

// /user/groups
router.get('/index/:clubId', groupController.index);
router.post('/create/:clubId', groupController.create);
router.put('/update/:groupId', groupController.update);
router.delete('/deleted/:groupId', groupController.delated);
router.get('/detail/:groupId', groupController.detail);

module.exports = router;