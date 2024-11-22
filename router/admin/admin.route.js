const express = require('express');
const {
  signup,
  login,
  getAllAdmins,
  getAdminById,
  updateAdmin
} = require('../../controller/admin/admin.controller.js');
const {
  uploadLogo,
  getAllLogos,
  getLogoById,
  updateLogo,
  deleteLogo,
} = require('../../controller/admin/logo/logo.controller.js');
const authMiddleware = require('../../middleware/auth.js');
const bannerController = require('../../controller/admin/offer/offer.controller.js');
const router = express.Router();

router.post('/signup', signup);               
router.post('/login', login);                 
router.get('/alladmin', authMiddleware, getAllAdmins); 
router.get('/singleadmin/:id', authMiddleware, getAdminById); 
router.put('/updateadmin/:id', authMiddleware, updateAdmin); 
//logo
router.post('/uploadlogo', uploadLogo);
router.get('/logos', getAllLogos);
router.get('/logo/:id', getLogoById);
router.put('/logo/:id', updateLogo);
router.delete('/logo/:id', deleteLogo);
//banner image 
router.post('/createBanner', bannerController.upload.single('image'), bannerController.createBanner);
router.get('/getBanner', bannerController.getBanners);
router.get('/singleBanner/:id', bannerController.getBannerById);
router.put('/updateBanner/:id', bannerController.upload.single('image'), bannerController.updateBanner);
router.delete('/deleteBanner/:id', bannerController.deleteBanner);

module.exports = router;
