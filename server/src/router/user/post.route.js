const express = require('express');
const router = express.Router();

const potsController = require('../../controllers/user/post.controller.js');

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const cloudinaryMiddleware = require('../../middlewares/cloudinary.middleware.js');

// admin/manage-post/
router.get('/list/:clubId', potsController.index);
router.post('/create/:eventId', upload.array('img', 12), cloudinaryMiddleware, potsController.createPost);

module.exports = router;