const express = require('express');
const router = express.Router();

const authController = require('../../controllers/admin/auth.controller.js');

// /admin/auth
router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;