const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK(
  "7cdbe6fddada80bd78c4",
  "10e9f931bae9b537d2ba46147b47cc28d0435d4b155a0b1847848217068fb1e1"
);

const app = express();
const port = 3000;

// Set up multer for file handling
const upload = multer({ dest: "uploads/" });

// Upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  const filePath = req.file.path;
  const fileName = req.file.originalname;

  const readableStreamForFile = fs.createReadStream(filePath);
  const options = {
    pinataMetadata: {
      name: fileName,
    },
    pinataOptions: {
      cidVersion: 0,
    },
  };

  try {
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log(result);

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: "File uploaded successfully",
      ipfsHash: result.IpfsHash,
    });
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);

    // Clean up the temporary file
    fs.unlinkSync(filePath);

    res.status(500).json({
      success: false,
      message: "Failed to upload file to IPFS",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
