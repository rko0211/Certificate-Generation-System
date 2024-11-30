require('dotenv').config({ path: '../.env' });
const { google } = require('googleapis');
const fs = require('fs');


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const FOLDER_ID = process.env.FOLDER_ID;


const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});


async function upLoadFile(PATH, NAME) {
  try {

    const folderId = FOLDER_ID;

    const response = await drive.files.create({
      requestBody: {
        name: NAME,
        mimeType: "application/pdf",
        parents: [folderId],
      },
      media: {
        mimeType: "application/pdf",
        body: fs.createReadStream(PATH),
      },
    });


    // console.log(response.data);

    return response.data;
  } catch (err) {

    throw err;
  }
}

async function generateUrl(id) {
  try {
    const fileId = id;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      }
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: 'webViewLink , webContentLink'
    });

    // console.log(result.data);
    return result.data;
  }
  catch (err) {

    throw err;
  }
}

async function deleteFile(id) {
  try {
    const response = await drive.files.delete({
      fileId: id,
    });
  
  }
  catch (err) {
    throw err;
  }
}

module.exports = { upLoadFile, generateUrl, deleteFile };
