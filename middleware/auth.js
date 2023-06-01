const jwt = require('jsonwebtoken');
const config = require('config');
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
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        console.log(req.user);
        next();
    } catch(err) {
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

middlewareObj.checkCompanyById = async (req, res, next) => {
    try {
        const id = req.body.id;
        const user = await User.findById(req.user.id);
        if (id.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this company.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

middlewareObj.checkDepartmentById = async (req, res, next) => {
    try {
        const departmentId = req.body.id
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
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

middlewareObj.checkDepartmentByCompanyId = async (req, res, next) => {
    try {
        const companyId = req.body.companyId;
        const user = await User.findById(req.user.id);
        if (companyId.toString() !== user.company.toString()){
            return res.status(403).json({ msg: 'You are not authorized to access this department.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

middlewareObj.checkPositionById = async (req, res, next) => {
    try {
        const positionId = req.body.id;
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
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

middlewareObj.checkPositionByDepartmentId = async (req, res, next) => {
    try {
        const departmentId = req.body.departmentId;
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
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

middlewareObj.checkCandidateById = async (req, res, next) => {
    try {
        const candidateId = req.body.id;
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
            return res.status(403).json({ msg: 'You are not authorized to access this department.' });
        }
        next();
    } catch(err) {
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

middlewareObj.checkCandidateByPositionId = async (req, res, next) => {
    try {
        const positionId = req.body.positionId;
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
        res.status(401).json({ msg: 'You are not authorized.' });
    }
}

module.exports = middlewareObj;