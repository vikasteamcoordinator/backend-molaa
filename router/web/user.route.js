const express = require('express');
const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUser
} = require('../../controller/web/user.controller.js');
const authMiddleware = require('../../middleware/auth.js');

const router = express.Router();

router.post('/signup', signup);                
router.post('/login', login);                 
router.get('/alluser', authMiddleware, getAllUsers); 
router.get('/singleuser/:id', authMiddleware, getUserById); 
router.put('/updateuser/:id', authMiddleware, updateUser); 

module.exports = router;
