const express = require('express');
const router = express.Router();

const roleController = require('../../controllers/user/role.controller.js');

// /user/roles
router.put('/update-role', roleController.updateRole);

module.exports = router;