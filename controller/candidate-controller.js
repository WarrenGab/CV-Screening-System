const {validationResult} = require('express-validator');
// const { v4: uuidv4 } = require('uuid');
// const s3 = require('../config/aws');
const fs = require("fs");
const AwsS3Service = require('../middleware/aws');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');

exports.createCandidate = async (req, res) => {
    console.log(req.file);
    AwsS3Service.uploadFile(req.file, req.file.filename, true);
    
    // Delete file from /uploads folder
    const path = __basedir + "/uploads/" + req.file.filename;
    fs.unlink(path, (err) => {
        if (err) {
            throw new Error(`Fail to Unlink file`);
        }
    });
    res.status(200).json( { file: req.file, body: req.body } );
    // const errors = validationResult(req);
    // if(!errors.isEmpty()){
    //     let ar = errors.array();
    //     return res.status(400).json({msg: ar[0].msg});
    // };

    // try {
    //     // Process the uploaded file
    //     const file = req.file;
    //     const { name, email, phone, domicile, positionId } = req.body;

    //     if (!name) {
    //         return res.status(400).json({ msg: "LALALALALALA" });
    //     }

    //     const newCandidate = new Candidate({
    //         cvFile: file.location,
    //         name,
    //         email,
    //         phone,
    //         domicile,
    //         positionId
    //     });

    //     await newCandidate.save();

    //     res.status(200).json({ cvFile: cvFileUrl, candidate: newCandidate });
    // } catch (error) {
    //     console.log(error);
    //     res.status(500).json({msg: "Server Error"});
    // }
}

exports.getCandidate = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { positionId } = req.body;

    try {
        const position = await Department.findById(positionId);

        if (!position) {
            return res.status(404).json({msg: "Position Id does not exist"});
        }

        const candidate = await Candidate.find({
            position: positionId
        })

        if (!candidate) {
            return res.status(404).json({msg: "Candidate is empty"});
        }

        res.status(200).json(candidate);

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getOneCandidate = async (req, res) => {
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

exports.editCandidate = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, name, email, phone, domicile } = req.body;
    const editValue = { name, email, phone, domicile };

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        await Candidate.findByIdAndUpdate(id, editValue);

        res.status(200).json('Candidate updated successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.scoreCandidate = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id, score } = req.body;

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        await Candidate.findByIdAndUpdate(id, {
            $set: { score: score }
        });

        res.status(200).json("Score updated successfully");

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.qualifyCandidate = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        const status = candidate.isQualified;

        await Candidate.findByIdAndUpdate(id, {
            $set: { isQualified: !status }
        });

        if (!status) {
            res.status(200).json("Qualified candidate successfully");
        } else {
            res.status(200).json("Unqualified candidate successfully");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.favoriteCandidate = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        const status = candidate.isFavorite;

        await Candidate.findByIdAndUpdate(id, {
            $set: { isFavorite: !status }
        });

        if (!status) {
            res.status(200).json("Candidate put into favorite successfully");
        } else {
            res.status(200).json("Candidate removed from favorite successfully");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.deleteCandidate = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        let ar = errors.array();
        return res.status(400).json({msg: ar[0].msg});
    };

    const { id } = req.body;

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        await candidate.delete();

        res.status(200).json('Candidate deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}