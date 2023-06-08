const jwt = require('jsonwebtoken');
const deleteFiles = require('../utils/deleteFiles');
const Department = require('../models/Department');
const Position = require('../models/Position');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const User = require('../models/User');

let middlewareObj = {};

middlewareObj.isAuthenticated = (req, res, next) => {
    // Get Token & Check
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ msg: 'You are not authorized.' });
    }
    // Validate Token
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkCompanyById = async (req, res, next) => {
    try {
        let id = req.query.companyId;
        if (!id) {
            id = req.body.id;
        }
        const user = await User.findById(req.user.id);
        if (id.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this company.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkDepartmentById = async (req, res, next) => {
    try {
        let departmentId = req.query.id
        if (!departmentId){
            departmentId = req.body.id
        }
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ msg: 'Department not found.' });
        }
        const user = await User.findById(req.user.id);
        if (department.company.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this department.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkDepartmentByIds = async (req, res, next) => {
    const ids = req.body.ids;
    try {
        const user = await User.findById(req.user.id);
        // Check departments
        for (let i = 0; i < ids.length; i++) {
            const departmentId = ids[i];
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({ msg: 'Department not found.' });
            }
            if (department.company.toString() !== user.company.toString()){
                return res.status(403).json({ msg: `You are not authorized to access department ${departmentId}.` });
            }
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkDepartmentByCompanyId = async (req, res, next) => {
    try {
        let companyId = req.query.companyId;
        if (!companyId) {
            companyId = req.body.companyId;
        }
        const user = await User.findById(req.user.id);
        if (companyId.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this department.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkPositionById = async (req, res, next) => {
    try {
        let positionId = req.query.id;
        if (!positionId){
            positionId = req.body.id
        }
        const position = await Position.findById(positionId);
        if (!position) {
            return res.status(404).json({ msg: 'Position not found.' });
        }
        const departmentId = position.department;
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ msg: 'Deparment not found.' });
        }
        const user = await User.findById(req.user.id);
        if (department.company.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this position.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkPositionByIds = async (req, res, next) => {
    const ids = req.body.ids;
    try {
        const user = await User.findById(req.user.id);
        // Check positions
        for (let i = 0; i < ids.length; i++) {
            const positionId = ids[i];
            const position = await Position.findById(positionId);
            if (!position) {
                return res.status(404).json({ msg: 'Position not found.' });
            }
            const departmentId = position.department;
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({ msg: 'Deparment not found.' });
            }
            if (department.company.toString() !== user.company.toString()){
                return res.status(403).json({ msg: `You are not authorized to access position ${positionId}.` });
            }
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkPositionByDepartmentId = async (req, res, next) => {
    try {
        let departmentId = req.query.departmentId;
        if (!departmentId){
            departmentId = req.body.departmentId;
        }
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ msg: 'Deparment not found.' });
        }
        const user = await User.findById(req.user.id);
        if (department.company.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this department.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkCandidateById = async (req, res, next) => {
    try {
        let candidateId = req.query.id;
        if (!candidateId) {
            candidateId = req.body.id;
        }
        const candidate = await Candidate.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({ msg: 'Candidate not found.' });
        }
        const positionId = candidate.position;
        const position = await Position.findById(positionId);
        if (!position) {
            return res.status(404).json({ msg: 'Position not found.' });
        }
        const departmentId = position.department;
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ msg: 'Department not found.' });
        }
        const user = await User.findById(req.user.id);
        if (department.company.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this candidate.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkCandidateByIds = async (req, res, next) => {
    const ids = req.body.ids;
    try {
        const user = await User.findById(req.user.id);
        // Check candidate
        for (let i = 0; i < ids.length; i++) {
            const candidateId = ids[i];
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) {
                return res.status(404).json({ msg: 'Candidate not found.' });
            }
            const positionId = candidate.position;
            const position = await Position.findById(positionId);
            if (!position) {
                return res.status(404).json({ msg: 'Position not found.' });
            }
            const departmentId = position.department;
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({ msg: 'Department not found.' });
            }
            if (department.company.toString() !== user.company.toString()){
                return res.status(403).json({ msg: `You are not authorized to access candidate ${candidateId}.` });
            }
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkCandidateByPositionId = async (req, res, next) => {
    try {
        let positionId = req.query.positionId;
        if (!positionId) {
            positionId = req.body.positionId;
        }
        const position = await Position.findById(positionId);
        if (!position) {
            return res.status(404).json({ msg: 'Position not found.' });
        }
        const departmentId = position.department;
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ msg: 'Deparment not found.' });
        }
        const user = await User.findById(req.user.id);
        if (department.company.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this position.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkCandidateByCandidates = async (req, res, next) => {
    const candidates = req.body.candidates;
    try  {
        const user = await User.findById(req.user.id);
        // Check position that is registered in candidates
        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            const positionId = candidate.positionId;
            const position = await Position.findById(positionId);
            if (!position) {
                deleteFiles(req.files);
                return res.status(404).json({ msg: 'Position not found.' });
            }
            const departmentId = position.department;
            const department = await Department.findById(departmentId);
            if (!department) {
                deleteFiles(req.files);
                return res.status(404).json({ msg: 'Deparment not found.' });
            }
            if (department.company.toString() !== user.company.toString()){
                deleteFiles(req.files);
                return res.status(403).json({ msg: `You are not authorized to access position ${positionId}.` });
            }
        }
        next();
    } catch(err) {
        deleteFiles(req.files);
        console.log(err);
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

middlewareObj.checkCandidateByScores = async (req, res, next) => {
    const scores = req.body.scores;
    try  {
        const user = await User.findById(req.user.id);
        for (let i = 0; i < scores.length; i++) {
            const cScore = scores[i];
            const candidateId = cScore.id;
            const candidate = await Candidate.findById(candidateId);
            if (!candidate) {
                return res.status(404).json({ msg: 'Candidate not found.' });
            }
            const positionId = candidate.position;
            const position = await Position.findById(positionId);
            if (!position) {
                return res.status(404).json({ msg: 'Position not found.' });
            }
            const departmentId = position.department;
            const department = await Department.findById(departmentId);
            if (!department) {
                return res.status(404).json({ msg: 'Department not found.' });
            }
            if (department.company.toString() !== user.company.toString()){
                return res.status(403).json({ msg: `You are not authorized to access candidate ${candidateId}.` });
            }
        }
        next();
    } catch(err) {
        res.status(401).json({ 
            err: err,
            msg: 'You are not authorized.' 
        });
    }
}

module.exports = middlewareObj;