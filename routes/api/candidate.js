const express = require('express');
const candidateController = require('../../controller/candidate-controller');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');

const router = express.Router();

// Add Candidates
router.post(
    '/create-candidate',
    auth.isAuthenticated,
    upload.array('cvFiles'), 
    auth.checkCandidateByCandidates,
    candidateController.createCandidate
);

// Get All Candidates from a Company
router.get(
    '/get-candidate', 
    auth.isAuthenticated,
    auth.checkCompanyById,
    candidateController.getCandidate
);

// Get Specific Candidate from a Position
router.get(
    '/get-one-candidate',
    auth.isAuthenticated,
    auth.checkCandidateById,
    candidateController.getOneCandidate
);

// Edit Candidate
router.put(
    '/edit-candidate',
    auth.isAuthenticated,
    auth.checkCandidateById,
    candidateController.editCandidate
);

// Score Candidate
router.put(
    '/score-candidate',
    auth.isAuthenticated,
    auth.checkCandidateByScores,
    candidateController.scoreCandidate
);

// (un)Qualify Candidate
router.put(
    '/qualify-candidate',
    auth.isAuthenticated,
    auth.checkCandidateById,
    candidateController.qualifyCandidate
);

// (un)Shortlisted Candidate
router.put(
    '/shortlist-candidate',
    auth.isAuthenticated,
    auth.checkCandidateById,
    candidateController.shortlistCandidate
);

// Remove Candidate
router.delete(
    '/delete-candidate', 
    auth.isAuthenticated,
    auth.checkCandidateByIds,
    candidateController.deleteCandidate
);

// router.get('/get-all', candidateController.getAll);
// router.get('/delete-all', candidateController.deleteAll);

module.exports = router;