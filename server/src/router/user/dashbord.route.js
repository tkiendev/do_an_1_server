const express = require('express');
const router = express.Router();

const dashbordController = require('../../controllers/user/dashbord.controller.js');

router.get('/detail-user', dashbordController.userDetail);
router.get('/detail-club', dashbordController.clubDetail);


module.exports = router;