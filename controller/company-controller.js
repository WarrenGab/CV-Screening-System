const {validationResult} = require('express-validator');
const Company = require('../models/Company');

exports.createCompany = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { name, address } = req.body;

    try {
        // Check if company already exists
        let company = await Company.findOne({
            name: { $regex: new RegExp(name, 'i') }
        });

        if (company) {
            return res.status(400).json({msg: "Company already exist"});
        }

        company = new Company({
            name,
            address
        });

        await company.save();
        console.log(company);

        return res.json({
            msg: "Companies created successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
};

exports.getCompany = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    // See if company exist
    try {
        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({msg: "Company does not exist"});
        }
        
        res.status(200).json(company);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }

}

exports.updateCompany = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, name, address } = req.body;
    const editValue = {name, address};
    try {
        const company = await Company.findById(id);

        if (!company) {
            res.status(404).json({ msg: 'Company not found' })
        }

        await Company.findByIdAndUpdate(id, editValue);

        res.status(200).json('Company updated successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.deleteCompany = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const {id} = req.body;

    try {
        let company = await Company.findById(id);

        if (!company) {
            res.status(404).json({ msg: 'Company not found' })
        }

        await company.delete();

        res.status(200).json('Company deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

