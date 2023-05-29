const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
    cvFile: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    domicile: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        min: 0,
        max: 100
    },
    isQualified: {
        type: Boolean,
        default: false
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Position"
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Candidate = mongoose.model("Candidate", CandidateSchema);

module.exports = Candidate;