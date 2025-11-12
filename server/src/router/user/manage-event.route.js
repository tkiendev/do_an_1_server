const express = require('express');
const router = express.Router();

const manageEventController = require('../../controllers/user/manage-event.controller');

// /user/manage-event
router.post('/create/:clubId', manageEventController.create);
router.get('/detail/:eventId', manageEventController.detail);
router.put('/update/:eventId', manageEventController.update);
router.delete('/delete/:eventId', manageEventController.delete);
router.get('/list/:clubId', manageEventController.index);

module.exports = router;