const express = require('express');
const positionController = require('../../controller/position-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Position
router.post(
    '/create-position',
    auth.isAuthenticated,
    auth.checkPositionByDepartmentId,
    positionController.createPosition
);

// Get All Positions from a Company
router.get(
    '/get-all-position',
    auth.isAuthenticated,
    positionController.getAllPosition
);

// Get Specific Position
router.get(
    '/get-one-position',
    auth.isAuthenticated,
    auth.checkPositionById,
    positionController.getOnePosition
);

// Edit Position
router.put(
    '/edit-position',
    auth.isAuthenticated,
    auth.checkPositionById,
    positionController.editPosition
);

// Edit Position's Candidate Details
router.put(
    '/edit-position-candidates',
    auth.isAuthenticated,
    auth.checkPositionById,
    positionController.editPositionCandidates
);

// (un)Resolve Position
router.put(
    '/resolve-position',
    auth.isAuthenticated,
    auth.checkPositionById,
    positionController.resolvePosition
);

// (un)Remove Position
router.put(
    '/remove-position',
    auth.isAuthenticated,
    auth.checkPositionByIds,
    positionController.trashPosition
);

// Delete Position
router.delete(
    '/delete-position',
    auth.isAuthenticated,
    auth.checkPositionByIds,
    positionController.deletePosition
);

// router.get('/get-all', positionController.getAll);

module.exports = router;