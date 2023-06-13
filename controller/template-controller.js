const User = require('../models/User');
const Company = require('../models/Company');
const Template = require('../models/Template')

exports.createTemplate = async (req, res) => {
    const { name, content, companyId } = req.body;
    if (!name || !content || !companyId) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        // Check whether template already exist
        let template = await Template.find({
            name: { $regex: new RegExp(name, 'i') },
            company: companyId
        });
        if (template) {
            return res.status(400).json({msg: "Template already exist"})
        }
        // Check whether company exist
        let company = await Company.findById(companyId);
        if (!company) {
            res.status(404).json({ msg: 'Company not found' })
        }

        template = new Template({
            name,
            content,
            company: companyId
        });

        await template.save();

        return res.json({
            msg: "Template created successfully",
            template: template
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getAllTemplate = async (req, res) => {
    const userId = req.user.id;
    try {
        // Find User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({msg: "User does not exist"});
        }
        // Find Company
        const companyId = user.company;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({msg: "Company Id does not exist"});
        }
        // Find Templates
        const templates = await Template.find({
            company: companyId
        });

        if (!templates) {
            return res.status(404).json({msg: "Template is empty"});
        }

        res.status(200).json(templates);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getOneTemplate = async (req, res) => {
    //
}

exports.editTemplate = async (req, res) => {
    //
}

exports.deleteTemplate = async (req, res) => {
    //
}