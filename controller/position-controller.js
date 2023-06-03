const Position = require('../models/Position');
const Department = require('../models/Department');

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
        console.log(position);

        return res.json({
            msg: "Position created successfully",
            position: position
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getPosition = async (req, res) => {
    const { departmentId } = req.body;
    if (!departmentId) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const department = await Department.findById(departmentId);

        if (!department) {
            return res.status(404).json({msg: "Department Id does not exist"});
        }

        const position = await Position.find({
            department: departmentId
        })

        if (!position) {
            return res.status(404).json({msg: "Position is empty"});
        }

        res.status(200).json(position);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }

}

exports.getOnePosition = async (req, res) => {
    const { id } = req.body;
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
        res.status(500).json({msg: "Server Error"});
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
        res.status(500).json({msg: "Server Error"});
    }
}

exports.editPositionCandidates = async (req, res) => {
    const { id, uploadedCV, filteredCV, potentialCandidates, qualifiedCandidates } = req.body;
    if (
        !id || 
        uploadedCV === undefined || uploadedCV === null ||
        filteredCV === undefined || filteredCV === null ||
        potentialCandidates === undefined || potentialCandidates === null ||
        qualifiedCandidates === undefined || qualifiedCandidates === null
    ) {
        return res.json({ message: "All filled must be required" });
    }
    const editValue = { uploadedCV, filteredCV, potentialCandidates, qualifiedCandidates };

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
        res.status(500).json({msg: "Server Error"});
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
        res.status(500).json({msg: "Server Error"});
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
        res.status(500).json({msg: "Server Error"});
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
            let position = await Position.findById(id);
            if (!position) {
                res.status(404).json({ msg: 'Position not found' })
            }
            await position.delete()
        }
        res.status(200).json('Positions deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getAll = async (req, res) => {
    const position = await Position.find();
    res.json(position);
}