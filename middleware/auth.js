const jwt = require('jsonwebtoken');
const config = require('config');
const Department = require('../models/Department');
const Position = require('../models/Position');
const Candidate = require('../models/Candidate');
const Company = require('../models/Company');

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

// middlewareObj.checkDepartment = (req, res, next) => {
//     let { departmentId } = req.body;
//     Department.findById(departmentId, (err, foundDepartment) => {
//         if (err) {
//             res.status(401).json({ msg: 'You are not authorized.' });
//         } else {
//             if (foundDepartment.company.equals(req.user.company)){
//                 next();
//             } else {
//                 res.status(401).json({ msg: 'You are not authorized.' });
//             }
//         }
//     });
// }

// middlewareObj.checkPosition = (req, res, next) => {
//     let { positionId } = req.body;
//     Position.findById(positionId, (err, foundPosition) => {
//         if (err) {
//             res.status(401).json({ msg: 'You are not authorized.' });
//         } else {
//             let departmentId = foundPosition.department;

//             let department = await Department.findById(departmentId);

//             if (!department) {
//                 res.status(404).json({ msg: 'Position not found' })
//             }

//             let companyId = department.company;

//             if (companyId.equals(req.user.company)) {
//                 next();
//             } else {
//                 res.status(401).json({ msg: 'You are not authorized.' });
//             }
//         }
//     });
// }

module.exports = middlewareObj;