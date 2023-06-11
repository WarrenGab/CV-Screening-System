const AwsS3Service = require('../middleware/aws');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const Department = require('../models/Department');
const Company = require('../models/Company');

exports.createCompany = async (req, res) => {
    const { name, address } = req.body;
    if (!name || !address) {
        return res.json({ message: "All filled must be required" });
    }

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

        return res.json({
            msg: 'Company created successfully',
            company: company
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
};

exports.getOneCompany = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    // See if company exist
    try {
        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({msg: "Company does not exist"});
        }
        
        res.status(200).json(company);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }

}

exports.getAllCompanies = async (req, res) => {
    try {
        const company = await Company.find();
        if (!company) {
            return res.status(404).json({
                msg: "Company is empty"
            });
        }

        res.status(200).json(company);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.editCompany = async (req, res) => {
    const { id, name, address } = req.body;
    if (!id || !name || !address) {
        return res.json({ message: "All filled must be required" });
    }
    const editValue = {name, address};

    try {
        const company = await Company.findById(id);

        if (!company) {
            res.status(404).json({ msg: 'Company not found' })
        }

        const editedCompany = await Company.findByIdAndUpdate(id, editValue, { new: true });

        res.status(200).json({
            msg: 'Company updated successfully',
            company: editedCompany
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.deleteCompany = async (req, res) => {
    const {id} = req.body;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        // Find Company
        let company = await Company.findById(id);
        if (!company) {
            res.status(404).json({ msg: 'Company not found' })
        }
        // Find departments related to company
        const departments = await Department.find({ company: company._id });
        for (let i = 0; i < departments.length; i++) {
            // Find positions related to departments
            const department = departments[i];
            const positions = await Position.find({ department: department._id });
            for (let j = 0; j < positions.length; j++) {
                const position = positions[j];
                const candidates = await Candidate.find({ position: position._id });
                for (let k = 0; k < candidates.length; k++) {
                    const candidate = candidates[k];
                    // Delete File from AWS S3
                    await AwsS3Service.deleteFile(candidate.cvFile);
                    // Delete candidate
                    await candidate.delete();
                }
            }
            await Position.deleteMany({ department: department._id });
            await department.delete();
        }
        // Delete Company
        await company.delete();

        res.status(200).json('Company deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getAll = async (req, res) => {
    const company = await Company.find();
    res.json(company);
}