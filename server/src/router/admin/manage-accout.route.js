const express = require('express');
const router = express.Router();

const manageAccoutController = require('../../controllers/admin/manage-accout.controller');

// /admin/manage-accout
router.get('/index', manageAccoutController.index);

module.exports = router;