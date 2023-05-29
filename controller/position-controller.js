const {validationResult} = require('express-validator');
const Position = require('../models/Position');
const Department = require('../models/Department');

exports.createPosition = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { name, education, location, minWorkExp, description, departmentId } = req.body;

    try {
        // Check if position already exists
        let position = await Position.findOne({
            name: { $regex: new RegExp(name, 'i') },
            department: departmentId
        });

        if (position) {
            return res.status(400).json({msg: "Position already exist"});
        }

        position = new Position({
            name,
            education,
            location,
            minWorkExp,
            description,
            department: departmentId
        });

        await position.save();
        console.log(position);

        return res.json({
            msg: "Position created successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getPosition = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { departmentId } = req.body;

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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, name, education, location, minWorkExp, description } = req.body;
    const editValue = { name, education, location, minWorkExp, description };

    try {
        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({msg: "Position does not exist"});
        }

        await Position.findByIdAndUpdate(id, editValue);

        res.status(200).json('Position updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.editPositionCandidates = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, uploadedCV, filteredCV, potentialCandidates, qualifiedCandidates } = req.body;
    const editValue = { uploadedCV, filteredCV, potentialCandidates, qualifiedCandidates };

    try {
        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({msg: "Position does not exist"});
        }

        await Position.findByIdAndUpdate(id, editValue);

        res.status(200).json("Position's candidates updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.resolvePosition = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

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
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        const position = await Position.findById(id);

        if (!position) {
            return res.status(404).json({msg: "Position does not exist"});
        }

        const status = position.isTrash.isInTrash;

        await Position.findByIdAndUpdate(id, {
            $set: { 
                'isTrash.$.isInTrash' : !status,
                'isTrash.$.removedDate': Date.now
            }
        });

        if (!status) {
            res.status(200).json("Position removed successfully");
        } else {
            res.status(200).json("Position restored successfully");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.deletePosition = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        let position = await Position.findById(id);

        if (!position) {
            res.status(404).json({ msg: 'Position not found' })
        }

        await position.delete();

        res.status(200).json('Position deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}