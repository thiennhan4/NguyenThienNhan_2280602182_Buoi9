const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
router.post('/register-email', authController.registerByEmail);
router.post('/login-email', authController.loginByEmail);
router.post('/logout', authController.logout);
module.exports = router;