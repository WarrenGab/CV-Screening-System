const {validationResult} = require('express-validator');
const Department = require('../models/Department');
const Company = require('../models/Company');

exports.createDepartment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { name } = req.body;

    try {
        let department = await Department.findOne({
            name: { $regex: new RegExp(name, 'i') }
        });

        if (department) {
            return res.status(400).json({msg: "Company already exist"});
        }

        const company = req.user.company;

        department = new Department({
            name,
            company
        });

        await department.save();
        console.log(department);

        return res.json({
            msg: "Department created successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getDepartment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { companyId } = req.body;

    try {
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).json({msg: "Company Id does not exist"});
        }

        const department = await Department.find({
            company: companyId
        });

        if (!department) {
            return res.status(404).json({msg: "Department is empty"});
        }

        res.status(200).json(department);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getOneDepartment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({msg: "Department does not exist"});
        }

        res.status(200).json(department);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.editDepartment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, name } = req.body;

    try {
        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({msg: "Department does not exist"});
        }

        await Department.findByIdAndUpdate(id, { $set: { name: name }});

        res.status(200).json('Department updated successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.deleteDepartment = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        let department = await Department.findById(id);

        if (!department) {
            res.status(404).json({ msg: 'Department not found' })
        }

        await department.delete();

        res.status(200).json('Department deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}