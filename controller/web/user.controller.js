const User = require('../../Models/web/user.model.js');
const { hashPassword, comparePassword } = require('../../utils/bcrypt.js');
const { generateToken } = require('../../utils/jwt.js');

// User Signup
// exports.signup = async (req, res) => {
//   try {
//     const { photo,name,email, password } = req.body;
//     const hashedPassword = await hashPassword(password);
//     const user = new User({ photo,name,email, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: 'User created successfully' , data : user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.signup = async (req, res) => {
  try {
    const { photo, name, email, username, password } = req.body; // Include 'username' if it's a required field

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({ photo, name, email, username, password: hashedPassword });
    await user.save();
    
    res.status(201).json({ message: 'User created successfully', data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
