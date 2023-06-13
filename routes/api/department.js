const express = require('express');
const departmentController = require('../../controller/department-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Department
router.post(
    '/create-department',
    auth.isAuthenticated,
    auth.checkDepartmentByCompanyId,
    departmentController.createDepartment
);

// Get All Departments from a Company
router.get(
    '/get-all-department',
    auth.isAuthenticated,
    // auth.checkDepartmentByCompanyId,
    departmentController.getAllDepartment
);

// Get Specific Department from a Company
router.get(
    '/get-one-department',
    auth.isAuthenticated,
    auth.checkDepartmentById,
    departmentController.getOneDepartment
);

// Edit Department
router.put(
    '/edit-department',
    auth.isAuthenticated,
    auth.checkDepartmentById,
    departmentController.editDepartment
);

// Remove Department
router.delete(
    '/delete-department',
    auth.isAuthenticated,
    auth.checkDepartmentByIds,
    departmentController.deleteDepartment
);

// router.get('/get-all', departmentController.getAll);

module.exports = router;