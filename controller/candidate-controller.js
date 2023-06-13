const fs = require("fs");
const AwsS3Service = require('../middleware/aws');
const deleteFiles = require('../utils/deleteFiles');
const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const Department = require('../models/Department');
const Company = require('../models/Company');
const User = require('../models/User');

exports.createCandidate = async (req, res) => {
    const files = req.files;
    const candidates = req.body.candidates;

    if (!files || files.length === 0 || !candidates || candidates.length === 0) {
        return res.json({ message: "No files or candidates provided" });
    }

    try {
        for (let i = 0; i < candidates.length; i++) {
            // Get candidate and file from array
            const candidate = candidates[i];
            const file = files[i];

            const { name, email, domicile, positionId } = candidate;

            console.log(candidate);

            if (!name || !email || !domicile || !positionId) {
                deleteFiles(files);
                return res.status(400).json({ msg: "Invalid candidate details" });
            }

            // Check whether candidate already exist
            const existingCandidate = await Candidate.findOne({
                email: { $regex: new RegExp(email, 'i') },
                position: positionId
            });

            if (existingCandidate){
                deleteFiles(files);
                return res.status(400).json({msg: "Candidate already exist"});
            }

            // Check whether position exist
            const position = await Position.findById(positionId);

            if (!position) {
                deleteFiles(files);
                return res.status(404).json({msg: "Position Id does not exist"});
            }

            position.uploadedCV += 1;
            await position.save();

            // Process the uploaded file
            const cvFilename = await AwsS3Service.uploadFile(file, file.filename);

            // Create the candidate
            const newCandidate = new Candidate({
                cvFilename: cvFilename,
                name,
                email,
                domicile,
                position: positionId
            });

            await newCandidate.save();
        }
        deleteFiles(files);
        // Successfully created the candidates
        res.status(200).json({ 
            msg: 'Candidate created successfully',
            files: req.files, 
            candidates: await Candidate.find({ email: { $in: candidates.map(c => c.email) } })
        });
    } catch (error) {
        deleteFiles(files);
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getAllCandidate = async (req, res) => {
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

        // Check Departments
        const departments = await Department.find({
            company: company.id
        });
        if (!departments || departments.length === 0) {
            return res.status(404).json({msg: "Department is empty"});
        }
        const departmentIds = departments.map((department) => department._id);

        // Check Positions
        const positions = await Position.find({
            department: { $in: departmentIds }
        });
        if (!positions || positions.length === 0) {
            return res.status(404).json({msg: "Position is empty"});
        }
        const positionIds = positions.map((position) => position._id);

        // Find Candidates
        const candidates = await Candidate.find({
            position: { $in: positionIds }
        })

        if (!candidates) {
            return res.status(404).json({msg: "Candidate is empty"});
        }
        // Download Files
        let cvFiles = [];
        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i];
            cvFiles[i] = await AwsS3Service.downloadFile(candidate.cvFilename);
        }

        res.status(200).json({
            cvFiles: cvFiles,
            candidates: candidates
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.getOneCandidate = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        const candidate = await Candidate.findById(id);

        if (!candidate) {
            return res.status(404).json({msg: "Candidate does not exist"});
        }

        const cvFile = await AwsS3Service.downloadFile(candidate.cvFilename);

        res.status(200).json({ 
            candidate: candidate,
            cvFile: cvFile
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
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
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.scoreCandidate = async (req, res) => {
    const scores = req.body.scores;
    if (!scores) {
        return res.json({ message: "All filled must be required" });
    }

    try {
        for (let i = 0; i < scores.length; i++) {
            // Get id and score
            const { id, score, skills } = scores[i];
            if (!id || score === undefined || score === null || !skills) {
                return res.json({ message: "All filled must be required" });
            }
            // Check whether candidate exists
            const candidate = await Candidate.findById(id);

            if (!candidate) {
                return res.status(404).json({msg: `Candidate ${id} does not exist`});
            }

            let isQ = false;
            if (score > 0) {
                isQ = true;
            }

            let isScored = false;
            if (candidate.score || candidate.score === 0) {
                isScored = true;
            }

            let isOldQ = false;
            if (isScored) {
                if (candidate.score > 0) {
                    isOldQ = true;
                }
            }

            if ((!isScored && isQ) || (isScored && !isOldQ && isQ)) {
                const updatedPosition = await Position.findByIdAndUpdate(
                    candidate.position, 
                    { $inc: { filteredCV: 1 } },
                    { new: true }
                );
    
                if (!updatedPosition) {
                    return res.status(404).json({ message: 'Position not found' });
                }
            }

            if (isScored && isOldQ && !isQ){
                const updatedPosition = await Position.findByIdAndUpdate(
                    candidate.position, 
                    { $inc: { filteredCV: -1 } },
                    { new: true }
                );
    
                if (!updatedPosition) {
                    return res.status(404).json({ message: 'Position not found' });
                }
            }

            await Candidate.findByIdAndUpdate(id, {
                $set: { score: score, skills: skills }
            });
        }
        res.status(200).json({
            msg: "Score updated successfully",
            candidates: await Candidate.find({ _id: { $in: scores.map(c => c.id) } }).select('id score skills').exec()
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
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
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
    }
}

exports.deleteCandidate = async (req, res) => {
    const ids = req.body.ids;
    if (!ids) {
        return res.json({ message: "All filled must be required" });
    }
    try {
        for (let i = 0; i < ids.length; i++) {
            // Check candidate
            const id = ids[i];
            let candidate = await Candidate.findById(id);

            if (!candidate) {
                res.status(404).json({ msg: 'Candidate not found' })
            }
            // Delete File from AWS S3
            await AwsS3Service.deleteFile(candidate.cvFile);
            // Delete candidate
            await candidate.delete();
        }
        // All candidates deleted successfully
        res.status(200).json('Candidates deleted successfully');

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Server Error",
            err: error
        });
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
exports.downloadFile = async (req, res) => {
    const cvFile = await AwsS3Service.downloadFile("006d50ec-f94a-4841-aa51-799bfe33cf7f-Ujang Budi_ujangbudi@gmail.com_Kota Jakarta Pusat.pdf");
    res.send(cvFile);
}