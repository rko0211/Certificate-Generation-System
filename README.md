# Certificate Generation System 📜

A MERN stack application designed to streamline the process of generating and managing certificates. The system enables admins to create certificates by inputting details and automatically generates a PDF, saves it to Google Drive, and stores the link in a database.

---

## 🌟 Features

- **Admin Dashboard**: View and manage certificate requests.
- **Certificate Generation**: Generate a PDF certificate based on student details (Name, Course, Date).
- **Google Drive Integration**: Automatically save generated certificates to Google Drive.
- **Database Storage**: Save the certificate PDF link and student email in MongoDB for easy retrieval.

---

## 🚀 Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **PDF Generation**: [pdf-lib](https://www.npmjs.com/package/pdf-lib) or similar library
- **Cloud Storage**: Google Drive API
