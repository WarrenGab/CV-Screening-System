const express = require('express');
const {check} = require('express-validator');
const companyController = require('../../controller/company-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Company
router.post('/create-company', [
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
], companyController.createCompany);

// Get Company
router.get('/get-company', [
    check('id', 'Id is required').not().isEmpty()
], companyController.getCompany);

// Edit Company
router.put('/edit-company', [
    auth.isAuthenticated,
    check('id', 'Id is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
], companyController.updateCompany);

// Delete Company
router.delete('/delete-company', [
    auth.isAuthenticated,
    check('id', 'Id is required').not().isEmpty()
], companyController.deleteCompany);

module.exports = router;