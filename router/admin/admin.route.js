const express = require('express');
const {
  signup,
  login,
  getAllAdmins,
  getAdminById,
  updateAdmin
} = require('../../controller/admin/admin.controller.js');
const authMiddleware = require('../../middleware/auth.js');
const { upload , uploadLogo , getLogo } = require("../../controller/admin/logo/logo.controller.js");
const bannerController = require('../../controller/admin/offer/offer.controller.js');
const logoController = require('../../controller/admin/companylogo/companylogo.controller.js');
const router = express.Router();

router.post('/signup', signup);               
router.post('/login', login);                 
router.get('/alladmin', authMiddleware, getAllAdmins); 
router.get('/singleadmin/:id', authMiddleware, getAdminById); 
router.put('/updateadmin/:id', authMiddleware, updateAdmin); 
//logo
router.post("/upload", upload.single("logo"), uploadLogo); 
router.get('/getLogo' , getLogo )

//banner image 
router.post('/createBanner', bannerController.upload.single('image'), bannerController.createBanner);
router.get('/getBanner', bannerController.getBanners);
router.get('/singleBanner/:id', bannerController.getBannerById);
router.put('/updateBanner/:id', bannerController.upload.single('image'), bannerController.updateBanner);
router.delete('/deleteBanner/:id', bannerController.deleteBanner);
//company logo
router.post('/', logoController.upload.single('image'), logoController.createLogo);
router.get('/', logoController.getLogos);
router.get('/:id', logoController.getLogoById);
router.put('/:id', logoController.upload.single('image'), logoController.updateLogo);
router.delete('/:id', logoController.deleteLogo);
module.exports = router;
