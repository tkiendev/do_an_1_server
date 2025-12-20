const express = require('express');
const router = express.Router();

const manageEventClubController = require('../../controllers/admin/manage-event-club.controller.js');

router.get('/index', manageEventClubController.index);
router.put('/confirm/:envenId', manageEventClubController.confirmEvent);
router.put('/unconfirm/:envenId', manageEventClubController.unconfirmEvent);
router.get('/detail/:envenId', manageEventClubController.detailEvent);
router.get('/task/:evenId', manageEventClubController.taskEvent);
router.put('/task/confirm/:taskId/:accept', manageEventClubController.confirmtaskEvent);

module.exports = router;