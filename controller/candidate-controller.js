const fs = require("fs");
const AwsS3Service = require('../middleware/aws');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');

exports.createCandidate = async (req, res) => {
    const file = req.file;
    const { name, email, domicile, positionId } = req.body;

    if (!file || !name || !email || !domicile || !positionId) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        // Check whether candidate already exist
        const candidate = await Candidate.findOne({
            email: { $regex: new RegExp(email, 'i') },
            position: positionId
        });

        if (candidate){
            return res.status(400).json({msg: "Candidate already exist"});
        }

        // Check whether position exist
        const position = await Position.findById(positionId);

        if (!position) {
            return res.status(404).json({msg: "Position Id does not exist"});
        }

        // Process the uploaded file
        const cvFile = await AwsS3Service.uploadFile(req.file, req.file.filename);
    
        // Delete file from /uploads folder
        const path = __basedir + "/uploads/" + req.file.filename;
        fs.unlink(path, (err) => {
            if (err) {
                throw new Error(`Fail to Unlink file`);
            }
        });

        // Create the candidate
        const newCandidate = new Candidate({
            cvFile: cvFile,
            name,
            email,
            domicile,
            position: positionId
        });

        await newCandidate.save();

        res.status(200).json({ 
            msg: 'Candidate created successfully',
            file: req.file, 
            candidate: newCandidate 
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getCandidate = async (req, res) => {
    const { positionId } = req.body;
    if (!positionId) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const position = await Position.findById(positionId);

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
    const { id } = req.body;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        res.status(200).json({ candidate: candidate });

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.editCandidate = async (req, res) => {
    const { id, name, email, domicile } = req.body;
    if (!id || !name || !email || !domicile) {
        return res.json({ message: "All filled must be required" });
    }
    const editValue = { name, email, domicile };

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        const editedCandidate = await Candidate.findByIdAndUpdate(id, editValue, { new: true });

        res.status(200).json({
            msg: 'Candidate updated successfully',
            candidate: editedCandidate
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.scoreCandidate = async (req, res) => {
    const { id, score } = req.body;
    if (!id || score === undefined || score === null) {
        return res.json({ message: "All filled must be required" });
    }

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
    const { id } = req.body;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

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

exports.shortlistCandidate = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        const status = candidate.isShortlisted;

        await Candidate.findByIdAndUpdate(id, {
            $set: { isShortlisted: !status }
        });

        if (!status) {
            res.status(200).json("Candidate put into shortlist successfully");
        } else {
            res.status(200).json("Candidate removed from shortlist successfully");
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.deleteCandidate = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        await AwsS3Service.deleteFile(candidate.cvFile);

        await candidate.delete();

        res.status(200).json('Candidate deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Server Error"});
    }
}

exports.getAll = async (req, res) => {
    const candidate = await Candidate.find();
    res.json(candidate);
}
exports.deleteAll = async (req, res) => {
    try {
        await Candidate.deleteMany(); // Delete all documents from the collection
        res.status(200).json('All candidates deleted successfully');
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
}