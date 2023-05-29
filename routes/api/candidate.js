const express = require('express');
const {check} = require('express-validator');
const candidateController = require('../../controller/candidate-controller');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

const router = express.Router();

// Add Candidates
router.post('/create-candidate', [
    // auth.isAuthenticated,
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('phone', 'Phone is required').not().isEmpty(),
    check('domicile', 'Domicile is required').not().isEmpty(),
    check('positionId', 'Position ID is required').not().isEmpty()
], upload.single('cvFile'), candidateController.createCandidate);

// Get All Candidates from a Position
router.get('/get-candidate', [
    // auth.isAuthenticated,
    check('positionId', 'Position ID is required').not().isEmpty()
], candidateController.getCandidate);

// Get Specific Candidate from a Position
router.get('/get-one-candidate', [
    // auth.isAuthenticated,
    check('id', 'ID is required').not().isEmpty()
], candidateController.getOneCandidate);

// Edit Candidate
router.put('/edit-candidate', [
    auth.isAuthenticated,
    check('id', 'ID is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Email is required').not().isEmpty(),
    check('phone', 'Phone is required').not().isEmpty(),
    check('domicile', 'Domicile is required').not().isEmpty()
], candidateController.editCandidate);

// Score Candidate
router.put('/score-candidate', [
    auth.isAuthenticated,
    check('id', 'ID is required').not().isEmpty(),
    check('score', 'Score is required').not().isEmpty()
], candidateController.scoreCandidate);

// (un)Qualify Candidate
router.put('/qualify-candidate',[
    auth.isAuthenticated,
    check('id', 'ID is required').not().isEmpty()
], candidateController.qualifyCandidate);

// (un)Favorite Candidate
router.put('/favorite-candidate', [
    auth.isAuthenticated,
    check('id', 'ID is required').not().isEmpty()
], candidateController.favoriteCandidate);

// Remove Candidate
router.delete('/delete-candidate', [
    auth.isAuthenticated,
    check('id', 'ID is required').not().isEmpty()
], candidateController.deleteCandidate);

module.exports = router;