const Admin = require('../../Models/admin/admin.model.js');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.js');
const { generateToken } = require('../../utils/jwt.js');

// Admin Signup
exports.signup = async (req, res) => {
  try {
    const { username, password, email, lastName, firstName, contactNumber } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const admin = new Admin({
      username,
      password: hashedPassword,
      email,
      firstName,
      lastName,
      contactNumber
    });
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);
    res.status(201).json({ message: 'Admin created successfully', data: admin, token });
  } catch (error) {
    res.status(500).json({ message: `Error creating admin: ${error.message}` });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if the admin exists with the provided email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if the password matches
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token for the logged-in admin
    const token = generateToken(admin._id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: `Error fetching admins: ${error.message}` });
  }
};

// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: `Error fetching admin: ${error.message}` });
  }
};

// Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin updated successfully', data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: `Error updating admin: ${error.message}` });
  }
};
