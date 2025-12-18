const express = require('express');
const router = express.Router();

const dashbordController = require('../../controllers/user/dashbord.controller.js');

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const cloudinaryMiddleware = require('../../middlewares/cloudinary.middleware.js');

router.get('/detail-user', dashbordController.userDetail);
router.get('/detail-club', dashbordController.clubDetail);
router.put('/update-user', upload.single('avatar', 12), cloudinaryMiddleware, dashbordController.updateUser);

module.exports = router;