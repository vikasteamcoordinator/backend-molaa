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

const getLogo = async (req, res) => {
  try {
    // Fetch the latest logo (you can modify this logic as needed)
    const logo = await Logo.findOne().sort({ createdAt: -1 }).exec();

    if (!logo) {
      return res.status(404).json({ message: "Logo not found" });
    }

    // Send the logo path or the logo itself
    res.status(200).json({ logoPath: logo.logo });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logo" });
  }
};

module.exports = { upload, uploadLogo , getLogo };
