const Admin = require('../../Models/admin/admin.model.js');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.js');
const { generateToken } = require('../../utils/jwt.js');

// Admin Signup
exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, contact } = req.body;

    if (!email || !password || !firstName || !lastName || !contact) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the admin
    const admin = new Admin({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      contact,
    });
    await admin.save();

    // Generate token
    const token = generateToken(admin._id);

    res.status(201).json({
      message: 'Admin created successfully',
      data: {
        id: admin._id,
        email: admin.email,
        firstName,
        lastName,
        contact,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: `Error creating admin: ${error.message}` });
  }
};

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Validate password
    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(admin._id);

    // Respond with user data and token
    res.status(200).json({
      message: 'Login successful',
      token,
      data: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        contact: admin.contact,
      },
    });
  } catch (error) {
    res.status(500).json({ message: `Error logging in: ${error.message}` });
  }
};

// Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, '-password'); // Exclude the password field
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: `Error fetching admins: ${error.message}` });
  }
};

// Get Admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id, '-password'); // Exclude the password field
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
    const { password } = req.body;

    if (password) {
      req.body.password = await hashPassword(password); // Re-hash the password if updated
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Apply validators and return updated document
    ).select('-password'); // Exclude password

    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Admin updated successfully',
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: `Error updating admin: ${error.message}` });
  }
};
