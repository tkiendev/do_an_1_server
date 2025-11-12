const express = require('express');
const router = express.Router();

const authorController = require('../../controllers/user/author.controller.js');

router.post('/login', authorController.login);
router.post('/logout', authorController.logout);

router.post('/register-club', authorController.register);

module.exports = router;