const express = require('express');
const router = express.Router();

const roleController = require('../../controllers/user/role.controller.js');

// /user/roles
router.put('/update-role', roleController.updateRole);
router.put('/add-user/:userId/:groupId', roleController.addUser);

module.exports = router;