const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true},
  password: { type: String, required: true },
  photo: { type: String, required: false },
  username: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
