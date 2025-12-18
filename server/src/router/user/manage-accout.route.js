const express = require('express');
const router = express.Router();

const manageAccoutController = require('../../controllers/user/manage-accout.controller');

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const cloudinaryMiddleware = require('../../middlewares/cloudinary.middleware.js');


// /user/manage-account
router.get('/', manageAccoutController.index);
router.delete('/delete/:id', manageAccoutController.deleteAccout);
router.put('/edit/:id', upload.array('avatar'), cloudinaryMiddleware, manageAccoutController.edit);
router.post('/create/:clubId', upload.array('avatar'), cloudinaryMiddleware, manageAccoutController.create);
router.get('/detail/:id', manageAccoutController.detail);

module.exports = router;