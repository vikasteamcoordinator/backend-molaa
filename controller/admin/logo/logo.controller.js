const multer = require("multer");
const Logo = require("../../../Models/admin/logo/logo.model.js")

// Multer ka storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Controller function jo image upload aur database mein path save karega
const uploadLogo = async (req, res) => {
  try {
    const logo = new Logo({
      logo: req.file.path,
    });

    await logo.save();
    res.status(201).json({ message: "Logo uploaded successfully", logo });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload logo" });
  }
};

module.exports = { upload, uploadLogo };
