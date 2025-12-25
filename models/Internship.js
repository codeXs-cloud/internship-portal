const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
    company: String,
    role: String,
    startDate: String, // Format YYYY-MM
    endDate: String,   // Format YYYY-MM
    link: String
});

module.exports = mongoose.model('Internship', InternshipSchema);