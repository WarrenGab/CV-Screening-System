const express = require('express');
const positionController = require('../../controller/position-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Position
router.post(
    '/create-position',
    // auth.isAuthenticated,
    positionController.createPosition
);

// Get All Positions from a Department
router.get(
    '/get-position',
    // auth.isAuthenticated,
    positionController.getPosition
);

// Get Specific Position from a Department
router.get(
    '/get-one-position',
    // auth.isAuthenticated,
    positionController.getOnePosition
);

// Edit Position
router.put(
    '/edit-position',
    // auth.isAuthenticated,
    positionController.editPosition
);

// Edit Position's Candidate Details
router.put(
    '/edit-position-candidates',
    // auth.isAuthenticated,
    positionController.editPositionCandidates
);

// (un)Resolve Position
router.put(
    '/resolve-position',
    // auth.isAuthenticated,
    positionController.resolvePosition
);

// (un)Remove Position
router.put(
    '/remove-position',
    // auth.isAuthenticated,
    positionController.trashPosition
);

// Delete Position
router.delete(
    '/delete-position',
    // auth.isAuthenticated,
    positionController.deletePosition
);

router.get('/get-all', positionController.getAll);

module.exports = router;