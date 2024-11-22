const multer = require("multer");
const path = require("path");
const Logo = require("../../../Models/admin/logo/logo.model.js");

// Set storage engine for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save images in a folder called 'uploads'
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Set the file name to be the original name of the file with a timestamp
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

// Initialize upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).single("logo"); // 'logo' is the field name for the image

// CREATE: Upload Logo (Image Upload)
const uploadLogo = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Create a new logo document with the file path
      const newLogo = new Logo({
        logo: req.file.path, // Store the file path in the database
      });

      await newLogo.save();

      res.status(201).json({ message: "Logo uploaded successfully", logo: newLogo });
    } catch (error) {
      console.error("Error uploading logo:", error);
      res.status(500).json({ error: "Failed to upload logo" });
    }
  });
};

// READ: Get all Logos
const getAllLogos = async (req, res) => {
  try {
    const logos = await Logo.find();
    res.status(200).json(logos);
  } catch (error) {
    console.error("Error fetching logos:", error);
    res.status(500).json({ error: "Failed to fetch logos" });
  }
};

// READ: Get Logo by ID
const getLogoById = async (req, res) => {
  try {
    const logo = await Logo.findById(req.params.id);
    if (!logo) {
      return res.status(404).json({ error: "Logo not found" });
    }
    res.status(200).json(logo);
  } catch (error) {
    console.error("Error fetching logo by ID:", error);
    res.status(500).json({ error: "Failed to fetch logo" });
  }
};

// UPDATE: Update Logo by ID (Image Upload)
const updateLogo = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      const updatedLogo = await Logo.findByIdAndUpdate(
        req.params.id,
        { logo: req.file.path }, // Update the file path in the database
        { new: true }
      );

      if (!updatedLogo) {
        return res.status(404).json({ error: "Logo not found" });
      }

      res.status(200).json({ message: "Logo updated successfully", logo: updatedLogo });
    } catch (error) {
      console.error("Error updating logo:", error);
      res.status(500).json({ error: "Failed to update logo" });
    }
  });
};

// DELETE: Delete Logo by ID
const deleteLogo = async (req, res) => {
  try {
    const deletedLogo = await Logo.findByIdAndDelete(req.params.id);
    if (!deletedLogo) {
      return res.status(404).json({ error: "Logo not found" });
    }
    res.status(200).json({ message: "Logo deleted successfully" });
  } catch (error) {
    console.error("Error deleting logo:", error);
    res.status(500).json({ error: "Failed to delete logo" });
  }
};

module.exports = {
  uploadLogo,
  getAllLogos,
  getLogoById,
  updateLogo,
  deleteLogo,
};
