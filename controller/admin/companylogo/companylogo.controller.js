// controllers/logoController.js
const Logo = require('../../../Models/admin/companylogo/companylogo.model.js');
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

// Create a new logo
exports.createLogo = async (req, res) => {
    try {
        const image = req.file.path; // Image path after upload

        const logo = new Logo({ image });
        await logo.save();
        res.status(201).json(logo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all logos
exports.getLogos = async (req, res) => {
    try {
        const logos = await Logo.find();
        res.status(200).json(logos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single logo by ID
exports.getLogoById = async (req, res) => {
    try {
        const logo = await Logo.findById(req.params.id);
        if (!logo) return res.status(404).json({ error: "Logo not found" });
        res.status(200).json(logo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a logo
exports.updateLogo = async (req, res) => {
    try {
        const image = req.file ? req.file.path : undefined;

        const logo = await Logo.findByIdAndUpdate(
            req.params.id,
            { ...(image && { image }) },
            { new: true }
        );

        if (!logo) return res.status(404).json({ error: "Logo not found" });
        res.status(200).json(logo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a logo
exports.deleteLogo = async (req, res) => {
    try {
        const logo = await Logo.findByIdAndDelete(req.params.id);
        if (!logo) return res.status(404).json({ error: "Logo not found" });
        res.status(200).json({ message: "Logo deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.upload = upload;
