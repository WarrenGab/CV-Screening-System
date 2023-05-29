const express = require('express');
const {check} = require('express-validator');
const positionController = require('../../controller/position-controller');
const auth = require('../../middleware/auth');

const router = express.Router();

// Add Position
router.post('/create-position',[
    auth.isAuthenticated,
    check('name', 'Name is required').not().isEmpty(),
    check('education', 'Education is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('minWorkExp', 'Minimum Work Experience is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('departmentId', 'Department ID is required').not().isEmpty()
], positionController.createPosition);

// Get All Positions from a Department
router.get('/get-position', [
    auth.isAuthenticated,
    check('departmentId', 'Department ID is required').not().isEmpty()
], positionController.getPosition);

// Get Specific Position from a Department
router.get('/get-one-position', [
    auth.isAuthenticated,
    check('id', 'Position ID is required').not().isEmpty()
], positionController.getOnePosition);

// Edit Position
router.put('/edit-position', [
    auth.isAuthenticated,
    check('id', 'Position ID is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('education', 'Education is required').not().isEmpty(),
    check('location', 'Location is required').not().isEmpty(),
    check('minWorkExp', 'Minimum Work Experience is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty()
], positionController.editPosition);

// Edit Position's Candidate Details
router.put('/edit-position-candidates', [
    auth.isAuthenticated,
    check('id', 'Position ID is required').not().isEmpty(),
    check('uploadedCV', 'Uploaded CV is required').not().isEmpty(),
    check('filteredCV', 'Filtered CV is required').not().isEmpty(),
    check('potentialCandidates', 'Potential Candidates is required').not().isEmpty(),
    check('qualifiedCandidates', 'Qualified Candidates is required').not().isEmpty()
], positionController.editPositionCandidates);

// (un)Resolve Position
router.put('/resolve-position', [
    auth.isAuthenticated,
    check('id', 'Position ID is required').not().isEmpty()
], positionController.resolvePosition);

// (un)Removed Position
router.put('/remove-position', [
    auth.isAuthenticated,
    check('id', 'Position ID is required').not().isEmpty()
], positionController.trashPosition);

// Remove Position
router.delete('/delete-position', [
    auth.isAuthenticated,
    check('id', 'Position ID is required').not().isEmpty()
], positionController.deletePosition);

module.exports = router;