const express = require('express');
const router = express.Router();

const managePostController = require('../../controllers/admin/manage-post.controller.js');

router.get('/index', managePostController.index);
router.post('/confirm/:postId', managePostController.confirmPost);

module.exports = router;