const express = require('express');
const router = express.Router();

const manageClubController = require('../../controllers/admin/manage-club.controller.js');

// admin/manage-club
router.get('/index', manageClubController.index);
router.put('/confirm-registration/:clubId', manageClubController.confirmRegistration);
router.get('/detail/:clubId', manageClubController.detail);


module.exports = router;