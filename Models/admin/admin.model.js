const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contact: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
