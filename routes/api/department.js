const express = require('express');
const {check} = require('express-validator');
const departmentController = require('../../controller/department-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Department
router.post('/create-department', [
    auth.isAuthenticated,
    check('name', 'Name is required').not().isEmpty()
], departmentController.createDepartment);

// Get All Departments from a Company
router.get('/get-department', [
    auth.isAuthenticated,
    check('companyId', 'Company Id is required').not().isEmpty()
], departmentController.getDepartment);

// Get Specific Department from a Company
router.get('/get-one-department', [
    auth.isAuthenticated,
    check('id', 'Department Id is required').not().isEmpty()
], departmentController.getOneDepartment);

// Edit Department
router.put('/edit-department', [
    auth.isAuthenticated,
    check('id', 'Department Id is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty()
], departmentController.editDepartment);

// Remove Department
router.delete('/delete-department', [
    auth.isAuthenticated,
    check('id', 'Department Id is required').not().isEmpty()
], departmentController.deleteDepartment);

module.exports = router;