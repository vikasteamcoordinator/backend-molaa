// controllers/bannerController.js
const Banner = require('../../../Models/admin/offer/offer.model.js');
const path = require('path');
const multer = require('multer');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
    }
});

const upload = multer({ storage });

// Create a new banner
exports.createBanner = async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        const image = req.file.path; // Image path after upload

        const banner = new Banner({ title, subtitle, image });
        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all banners
exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single banner by ID
exports.getBannerById = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) return res.status(404).json({ error: "Banner not found" });
        res.status(200).json(banner);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a banner
exports.updateBanner = async (req, res) => {
    try {
        const { title, subtitle } = req.body;
        const image = req.file ? req.file.path : undefined;

        const banner = await Banner.findByIdAndUpdate(
            req.params.id,
            { title, subtitle, ...(image && { image }) },
            { new: true }
        );

        if (!banner) return res.status(404).json({ error: "Banner not found" });
        res.status(200).json(banner);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a banner
exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if (!banner) return res.status(404).json({ error: "Banner not found" });
        res.status(200).json({ message: "Banner deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.upload = upload;
