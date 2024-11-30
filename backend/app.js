require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const { User, Link } = require("./utils/db");
const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require('fs');

const { upLoadFile, generateUrl, deleteFile } = require('./drivecode/apiConnection');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.json({ message: "Hello World" });
})
app.get("/dashboard", async (req, res) => {
  try {
    const data = await User.find();
    return res.send(data);
  } catch (err) {

    return res.status(500).json({ error: "An error occurred while fetching the dashboard data." });
  }
});

app.get("/viewcertificate", async (req, res) => {
  try {
    const data = await Link.find();
    return res.send(data);
  }
  catch (err) {
    return res.status(500).json({ error: "An error occurred while fetching the certificate data." });
  }
})

app.post("/", async (req, res) => {
  const { name, course, email } = req.body;
  if (!name || !course || !email) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const user = await User.create({
      name,
      course,
      email,
    });

    res.status(201).json({
      message: "Certificate generated successfully!",
      data: user,
    });
  }
  catch (error) {


    // Handle specific error types
    if (error.name === "ValidationError") {

      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation failed!",
        errors: validationErrors,
      });
    } else if (error.code === 11000) {

      return res.status(400).json({
        message: "Duplicate value error!",
        error: `The email "${error.keyValue.email}" is already registered.`,
      });
    }
    res.status(500).json({
      message: "An unexpected error occurred. Please try again later.",
      error: error.message,
    });
  }

});

const dir = "./certificates";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

app.post("/api/certificates/generate/:id", async (req, res) => {

  const { _id, name, course, createdAt, issueDate } = req.body;
  // console.log(req.body);

  if (!name || !course || !createdAt || !issueDate) {
    return res.status(400).send({ error: "All fields (name, course, createdAt, issueDate) are required." });
  }

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();

    // Add a page to the document
    const page = pdfDoc.addPage([842, 595]);

    // Embed fonts
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Background Color
    page.drawRectangle({
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
      color: rgb(0.9, 0.95, 1),
    });

    // Header Section
    page.drawText("Certificate of Achievement", {
      x: 50,
      y: page.getHeight() - 70,
      size: 32,
      font: timesRomanBold,
      color: rgb(0.1, 0.2, 0.6),
    });

    page.drawText("ASR Tech Solutions", {
      x: page.getWidth() - 240,
      y: page.getHeight() - 70,
      size: 18,
      font: timesRomanBold,
      color: rgb(0.1, 0.2, 0.6),
    });

    // Certificate Text
    page.drawText(`This is to certify that`, {
      x: 50,
      y: page.getHeight() - 150,
      size: 18,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Recipient Name
    page.drawText(name, {
      x: 50,
      y: page.getHeight() - 190,
      size: 28,
      font: timesRomanBold,
      color: rgb(0.1, 0.4, 0.8),
    });

    // Course Details
    page.drawText(`has successfully completed the course`, {
      x: 50,
      y: page.getHeight() - 230,
      size: 18,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    page.drawText(course, {
      x: 50,
      y: page.getHeight() - 260,
      size: 24,
      font: timesRomanBold,
      color: rgb(0.1, 0.4, 0.8),
    });

    // Date of Issue
    page.drawText(`Date: ${issueDate}`, {
      x: 50,
      y: page.getHeight() - 340,
      size: 16,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Signature Placeholder
    page.drawText("Authorized Signature", {
      x: page.getWidth() - 200,
      y: page.getHeight() - 340,
      size: 16,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });

    // Save the PDF to a file
    const pdfBytes = await pdfDoc.save();
    const outputPath = path.join(__dirname, "certificates", `certificate_${_id.replace(/ /g, "_")}.pdf`);



    fs.writeFile(outputPath, pdfBytes, (err) => {
      if (err) {
        console.error("Error generating certificate:", err);
        return res.status(500).send({ error: "Failed to generate certificate. Please try again." });
      }

    });
    const File_Name = `certificate_${_id.replace(/ /g, "_")}.pdf`;
    const driveUpload = await upLoadFile(outputPath, File_Name);
    const driveUrl = await generateUrl(driveUpload.id);
    const driveId = driveUpload.id;
    const WebViewLink = driveUrl.webViewLink;
    const usr = await User.findById(_id);
    const email = usr.email;
    await Link.create({
      WebViewLink,
      email,
      driveId
    });
    return res.status(200).send({
      message: "Certificate generated successfully!",
      filePath: outputPath,
    });

  } catch (err) {
    console.error("Error generating certificate:", err);
    return res.status(500).send({ error: "Failed to generate certificate. Please try again." });
  }
});



app.delete("/api/certificates/:id", async (req, res) => {
  const { id } = req.params;
  try {

    const filePath = `./certificates/certificate_${id}.pdf`;
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.error('File not found!');
        } else {
          console.error('An error occurred while trying to delete the file:', err);
        }
      } else {
        // console.log('File deleted successfully!');
      }
    });

    const certificate = await User.findByIdAndDelete(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found." });
    }

    return res.status(200).json({ message: "Certificate deleted successfully." });
  } catch (error) {

    return res.status(500).json({ message: "Error deleting certificate.", error: error.message });
  }
});
app.delete("/delete/viewcertificate/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCertificate = await Link.findById(id);
    await deleteFile(deletedCertificate.driveId);
    const certificate = await Link.findByIdAndDelete(id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found." });
    }


    return res.status(200).json({ message: "Certificate deleted successfully." });
  } catch (error) {

    return res.status(500).json({ message: "Error deleting certificate.", error: error.message });
  }
});

const PORT = process.env.PORT || 5001;



app.listen(PORT);
