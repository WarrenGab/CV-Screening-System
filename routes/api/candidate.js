const express = require('express');
const candidateController = require('../../controller/candidate-controller');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

const router = express.Router();

// Add Candidates
router.post(
    '/create-candidate',
    auth.isAuthenticated,
    upload.array('cvFiles'), candidateController.createCandidate
);

// Get All Candidates from a Position
router.get(
    '/get-candidate', 
    auth.isAuthenticated,
    candidateController.getCandidate
);

// Get Specific Candidate from a Position
router.get(
    '/get-one-candidate',
    auth.isAuthenticated,
    candidateController.getOneCandidate
);

// Edit Candidate
router.put(
    '/edit-candidate',
    auth.isAuthenticated,
    candidateController.editCandidate
);

// Score Candidate
router.put(
    '/score-candidate',
    auth.isAuthenticated,
    candidateController.scoreCandidate
);

// (un)Qualify Candidate
router.put(
    '/qualify-candidate',
    auth.isAuthenticated,
    candidateController.qualifyCandidate
);

// (un)Shortlisted Candidate
router.put(
    '/shortlist-candidate',
    auth.isAuthenticated,
    candidateController.shortlistCandidate
);

// Remove Candidate
router.delete(
    '/delete-candidate', 
    auth.isAuthenticated,
    candidateController.deleteCandidate
);

router.get('/get-all', candidateController.getAll);
router.get('/delete-all', candidateController.deleteAll);

module.exports = router;