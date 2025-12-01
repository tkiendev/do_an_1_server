const express = require('express');
const router = express.Router();

const manageClubController = require('../../controllers/admin/manage-club.controller.js');

// admin/manage-club
router.get('/index', manageClubController.index);
router.put('/confirm-registration/:clubId/:userId', manageClubController.confirmRegistration);



module.exports = router;