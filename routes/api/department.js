const express = require('express');
const departmentController = require('../../controller/department-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Department
router.post(
    '/create-department',
    // auth.isAuthenticated,
    departmentController.createDepartment
);

// Get All Departments from a Company
router.get(
    '/get-department',
    // auth.isAuthenticated,
    departmentController.getDepartment
);

// Get Specific Department from a Company
router.get(
    '/get-one-department',
    // auth.isAuthenticated,
    departmentController.getOneDepartment
);

// Edit Department
router.put(
    '/edit-department',
    // auth.isAuthenticated,
    departmentController.editDepartment
);

// Remove Department
router.delete(
    '/delete-department',
    // auth.isAuthenticated,
    departmentController.deleteDepartment
);

router.get('/get-all', departmentController.getAll);

module.exports = router;