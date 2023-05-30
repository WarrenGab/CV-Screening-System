const express = require('express');
const authController = require('../../controller/auth-controller');

const router = express.Router();

// Login User
router.post(
    '/login', 
    authController.login
)

module.exports = router;