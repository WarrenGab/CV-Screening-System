const express = require('express');
const {check} = require('express-validator');
const userController = require('../../controller/user-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Get User
router.get('/get-user', [
    check('id', 'Id is required').not().isEmpty()
], userController.getUser);

// Register User
router.post('/create-user', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please provide a valid email').isEmail(),
    check('password', 'Please provide a password with 6 or more characters').isLength({min: 6}),
    check('phone', 'Phone is required').not().isEmpty(),
    check('companyId', 'Company Id is required').not().isEmpty()
], userController.createUser);

// Edit User
router.put('/edit-user', [
    auth.isAuthenticated,
    check('id', 'Id is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please provide a valid email').isEmail(),
    check('phone', 'Phone is required').not().isEmpty(),
], userController.editUser);

// Change User Password
router.put('/change-password', [
    auth.isAuthenticated,
    check('id', 'Id is required').not().isEmpty(),
    check('password', 'Please provide a password with 6 or more characters').isLength({min: 6})
], userController.changePassword);

// Remove User
router.delete('/delete-user', [
    auth.isAuthenticated,
    check('id', 'Id is required').not().isEmpty()
], userController.deleteUser);

module.exports = router;