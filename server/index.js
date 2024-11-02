const express = require("express");
const userSchema = require("./schema");
const ageCalculator = require("./service/ageCalculator");
const multer = require("multer");
const tesseract = require("node-tesseract-ocr");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const PORT = process.env.PORT || 4001;

// saving the file in the memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cleanText = (text) => {
  return text.replace(/\\/g, " ").trim();
};

// test the api with error
app.get("/test", (req, res) => {
  try {
    res.status(200).json({ message: "Api is working" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    // making sure the file is sent
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: {
          type: "FILE_ERROR",
          message: `No file uploaded. Please ensure you're sending a file ${error.message}`,
        },
      });
    }

    // log file details
    // console.log("File details:", {
    //   originalName: req.file.originalname,
    //   mimetype: req.file.mimetype,
    //   size: req.file.size,
    // });

    //   Parse and validate user data
    let userData;
    try {
      userData = JSON.parse(req.body.userData || "{}");
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        error: {
          type: "PARSE_ERROR",
          message: `Invalid JSON format in userData: ${parseError.message}`,
        },
      });
    }

    let validatedData; // validata user data
    try {
      validatedData = userSchema.parse(userData);
      //   console.log("Validated user data: ", validatedData)         //just to check if the data was parsed okay with no problem(to help debug it);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: {
          type: "VALIDATION_ERROR",
          details: validationError.errors || validationError.issues,
        },
      });
    }

    const age = ageCalculator(validatedData.dateOfBirth); // Calculate age and full name
    const fullName = `${validatedData.firstName} ${validatedData.lastName}`;

    // Tesseract configuration for image to tex
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
    };

    let extractedText = await tesseract.recognize(req.file.buffer, config); // Process the file with tesseract

    extractedText = cleanText(extractedText); // Clean the back slash in the text

    return res.status(200).json({
      success: true,
      data: {
        fullName,
        age,
        extractedText,
        fileInfo: {
          originalName: req.file.originalName,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      error: {
        type: "SERVER_ERROR",
        message: `Internal server error while processing request ${error.message}`,
      },
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
