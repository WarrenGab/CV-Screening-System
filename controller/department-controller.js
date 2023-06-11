const AwsS3Service = require('../middleware/aws');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const Department = require('../models/Department');
const Company = require('../models/Company');
const User = require('../models/User');

exports.createDepartment = async (req, res) => {
    const { companyId } = req.body;
    if (!companyId) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({msg: "Company doesn't exist"});
        }

        const name = "";
        const department = new Department({
            name: name,
            company: companyId
        });

        await department.save();
        console.log(department);

        return res.json({
            msg: 'Department created successfully',
            department: department
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getAllDepartment = async (req, res) => {
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
        // Find Departments
        const department = await Department.find({
            company: companyId
        });

        if (!department) {
            return res.status(404).json({msg: "Department is empty"});
        }

        res.status(200).json(department);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getOneDepartment = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({msg: "Department does not exist"});
        }

        res.status(200).json(department);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.editDepartment = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        // Check department Id
        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({msg: "Department does not exist"});
        }

        // Check if department name unique
        const department2 = await Department.findOne({
            name: { $regex: new RegExp(name, 'i') },
            company: department.company
        })
        if (department2) {
            return res.status(404).json({msg: "Department name already exist"});
        }

        const editedDepartment = await Department.findByIdAndUpdate(id, { $set: { name: name }}, { new: true });

        res.status(200).json({
            msg: 'Department updated successfully',
            department: editedDepartment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.deleteDepartment = async (req, res) => {
    const ids = req.body.ids;
    if (!ids) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        for (let i = 0; i < ids.length; i++) {
            // Check department
            const id = ids[i];
            let department = await Department.findById(id);

            if (!department) {
                res.status(404).json({ msg: 'Department not found' })
            }
            // Find positions
            const positions = await Position.find({ department: department._id });
            for (let j = 0; j < positions.length; j++) {
                // Delete candidates
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
            // Delete positions
            await Position.deleteMany({ department: department._id });
            // Delete department
            await department.delete();
        }
        // All department deleted successfully
        res.status(200).json('Departments deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getAll = async (req, res) => {
    const department = await Department.find();
    res.json(department);
}