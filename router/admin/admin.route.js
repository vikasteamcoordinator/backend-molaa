const express = require('express');
const {
  signup,
  login,
  getAllAdmins,
  getAdminById,
  updateAdmin
} = require('../../controller/admin/admin.controller.js');
const authMiddleware = require('../../middleware/auth.js');

const router = express.Router();

router.post('/signup', signup);               
router.post('/login', login);                 
router.get('/alladmin', authMiddleware, getAllAdmins); 
router.get('/singleadmin/:id', authMiddleware, getAdminById); 
router.put('/updateadmin/:id', authMiddleware, updateAdmin); 
module.exports = router;
