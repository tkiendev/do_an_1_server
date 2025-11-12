const express = require('express');
const router = express.Router();

const manageAccoutController = require('../../controllers/user/manage-accout.controller');

// /user/manage-account
router.get('/', manageAccoutController.index);
router.delete('/delete/:id', manageAccoutController.deleteAccout);
router.patch('/edit/:id', manageAccoutController.edit);
router.post('/create/:clubId', manageAccoutController.create);
router.get('/detail/:id', manageAccoutController.detail);

module.exports = router;