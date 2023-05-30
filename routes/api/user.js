const express = require('express');
const userController = require('../../controller/user-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Get User
router.get(
    '/get-user', 
    userController.getUser
);

// Register User
router.post(
    '/create-user',
    userController.createUser
);

// Edit User
router.put(
    '/edit-user',
    // auth.isAuthenticated,
    userController.editUser
);

// Change User Password
router.put(
    '/change-password',
    // auth.isAuthenticated,
    userController.changePassword
);

// Remove User
router.delete(
    '/delete-user',
    // auth.isAuthenticated,
    userController.deleteUser
);

router.get('/get-all', userController.getAll);

module.exports = router;