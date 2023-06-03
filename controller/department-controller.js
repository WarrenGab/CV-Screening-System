const Department = require('../models/Department');
const Company = require('../models/Company');

exports.createDepartment = async (req, res) => {
    const { name, companyId } = req.body;
    if (!name || !companyId) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        let department = await Department.findOne({
            name: { $regex: new RegExp(name, 'i') },
            company: companyId
        });

        if (department) {
            return res.status(400).json({msg: "Department already exist"});
        }

        let company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({msg: "Company doesn't exist"});
        }

        department = new Department({
            name,
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
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getDepartment = async (req, res) => {
    const { companyId } = req.body;
    if (!companyId) {
        return res.json({ message: "All filled must be required" });
    }

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
    const { id } = req.body;
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
        res.status(500).json({msg: "Server Error"});
    }
}

exports.editDepartment = async (req, res) => {
    const { id, name } = req.body;
    if (!id || !name) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const department = await Department.findById(id);

        if (!department) {
            return res.status(404).json({msg: "Department does not exist"});
        }

        const editedDepartment = await Department.findByIdAndUpdate(id, { $set: { name: name }}, { new: true });

        res.status(200).json({
            msg: 'Department updated successfully',
            department: editedDepartment
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
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
            // Delete department
            await department.delete();
        }
        // All department deleted successfully
        res.status(200).json('Departments deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getAll = async (req, res) => {
    const department = await Department.find();
    res.json(department);
}