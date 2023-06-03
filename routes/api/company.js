const express = require('express');
const companyController = require('../../controller/company-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Company
router.post(
    '/create-company', 
    companyController.createCompany
);

// Get Company
router.get(
    '/get-company', 
    companyController.getCompany
);

// Get All Company
router.get(
    '/get-all-company',
    companyController.getAllCompanies
);

// Edit Company
router.put(
    '/edit-company', 
    auth.isAuthenticated,
    auth.checkCompanyById,
    companyController.editCompany
);

// Delete Company
router.delete(
    '/delete-company', 
    auth.isAuthenticated,
    auth.checkCompanyById,
    companyController.deleteCompany
);

router.get('/get-all', companyController.getAll)

module.exports = router;