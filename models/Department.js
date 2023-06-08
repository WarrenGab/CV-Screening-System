const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});

const Department = mongoose.model("Department", DepartmentSchema);

module.exports = Department;