const mongoose = require('mongoose');

const URI = process.env.URI;



// Model Creation
const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    // console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed:", error.message);
    process.exit(1);
  }
};
connectDb();
// Schema definition
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,

    }
  },
  { timestamps: true }
);

const certificateSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  WebViewLink: {
    type: String,
  },
  driveId: {
    type: String,
  },
  oldDbId: {
    type: String,
  }

},
  { timestamps: true }
);

// Model creation
module.exports = {
  User: mongoose.model("User", userSchema),
  Link: mongoose.model("Link", certificateSchema),
};

