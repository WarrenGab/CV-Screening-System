const AwsS3Service = require('../middleware/aws');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const Department = require('../models/Department');
const Company = require('../models/Company');
const User = require('../models/User');

exports.createPosition = async (req, res) => {
    const { name, education, location, minWorkExp, description, qualification, departmentId } = req.body;
    if (!name || !education || !location || minWorkExp === undefined || minWorkExp === null || !description || !qualification || !departmentId) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        // Check if position already exists
        let position = await Position.findOne({
            name: { $regex: new RegExp(name, 'i') },
            department: departmentId
        });

        if (position) {
            return res.status(400).json({msg: "Position already exist"});
        }

        // Check if department exist
        let department = await Department.findById(departmentId);
        if (!department) {
            return res.status(400).json({msg: "Department doesn't exist"});
        }

        position = new Position({
            name,
            education,
            location,
            minWorkExp,
            description,
            qualification,
            department: departmentId
        });

        await position.save();

        return res.json({
            msg: "Position created successfully",
            position: position
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getAllPosition = async (req, res) => {
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
        const departments = await Department.find({
            company: company.id
        });

        if (!departments || departments.length === 0) {
            return res.status(404).json({msg: "Department is empty"});
        }
        // Find Positions
        const departmentIds = departments.map((department) => department._id);

        const positions = await Position.find({
            department: { $in: departmentIds }
        })

        if (!positions || positions.length === 0) {
            return res.status(404).json({msg: "Position is empty"});
        }

        res.status(200).json(positions);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }

}

exports.getOnePosition = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({msg: "Position does not exist"});
        }

        res.status(200).json(position);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.editPosition = async (req, res) => {
    const { id, name, education, location, minWorkExp, description, qualification } = req.body;
    if (!id || !name || !education || !location || minWorkExp === undefined || minWorkExp === null || !description || !qualification) {
        return res.json({ message: "All filled must be required" });
    }
    const editValue = { name, education, location, minWorkExp, description, qualification };

    try {
        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({msg: "Position does not exist"});
        }

        const editedPosition = await Position.findByIdAndUpdate(id, editValue, { new: true });

        res.status(200).json({
            msg: 'Position updated successfully',
            position: editedPosition
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.editPositionCandidates = async (req, res) => {
    const { id, qualifiedCandidates } = req.body;
    if (
        !id || 
        qualifiedCandidates === undefined || 
        qualifiedCandidates === null
    ) {
        return res.json({ message: "All filled must be required" });
    }
    const editValue = { qualifiedCandidates };

    try {
        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({msg: "Position does not exist"});
        }

        const editedPosition = await Position.findByIdAndUpdate(id, editValue, { new: true });

        res.status(200).json({
            msg: 'Position updated successfully',
            position: editedPosition
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.resolvePosition = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({msg: "Position does not exist"});
        }

        const status = position.isResolved;

        await Position.findByIdAndUpdate(id, {
            $set: { isResolved: !status }
        });

        if (!status) {
            res.status(200).json("Position resolved successfully");
        } else {
            res.status(200).json("Position restored successfully");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.trashPosition = async (req, res) => {
    const ids = req.body.ids;
    if (!ids) {
        return res.json({ message: "All filled must be required" });
    }
    let stat = false;
    try {
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            // Check position
            let position = await Position.findById(id);
            if (!position) {
                res.status(404).json({ msg: 'Position not found' })
            }
            // Change isInTrash status
            const status = position.isTrash.isInTrash;
            stat = status;

            await Position.findByIdAndUpdate(id, {
                $set: { 
                    'isTrash.isInTrash': !status,
                    'isTrash.removedDate': Date.now()
                }
            });
        }
        if (!stat) {
            res.status(200).json("Positions removed successfully");
        } else {
            res.status(200).json("Positions restored successfully");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.deletePosition = async (req, res) => {
    const ids = req.body.ids;
    if (!ids) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            // Find Position
            let position = await Position.findById(id);
            if (!position) {
                res.status(404).json({ msg: 'Position not found' })
            }
            // Find candidates that are related to the position
            const candidates = await Candidate.find({ position: position._id });
            for (let j = 0; j < candidates.length; j++){
                const candidate = candidates[j];
                // Delete File from AWS S3
                await AwsS3Service.deleteFile(candidate.cvFile);
                // Delete candidate
                await candidate.delete();
            }

            await position.delete();
        }
        res.status(200).json('Positions deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getAll = async (req, res) => {
    const position = await Position.find();
    res.json(position);
}