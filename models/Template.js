const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
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

const Template = mongoose.model("Template", TemplateSchema);

module.exports = Template;