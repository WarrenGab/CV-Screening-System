const mongoose = require('mongoose');

const PositionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    minWorkExp: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    uploadedCV: {
        type: Number,
        default: 0
    },
    filteredCV: {
        type: Number,
        default: 0
    },
    qualifiedCandidates: {
        type: Number,
        default: 0
    },
    isResolved: {
        type: Boolean,
        default: false
    },
    isTrash: {
        isInTrash: {
            type: Boolean,
            default: false
        },
        removedDate: Date
    },
    department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Position = mongoose.model("Position", PositionSchema);

module.exports = Position;