require('dotenv').config();
const actions = require('@actions/core');
const { google } = require('googleapis');
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const link = 'link';
const scopes = ['https://www.googleapis.com/auth/drive'];

const {
  CLIENT_EMAIL,
  PRIVATE_KEY,
  ENVIRONMENT,
  DEVELOPMENT_VERSION,
  PRODUCTION_VERSION,
  DRIVE_FOLDER_PROD,
  DRIVE_FOLDER_DEV,
  TARGET
} = process.env;

const auth = new google.auth.JWT(CLIENT_EMAIL, null, PRIVATE_KEY.replace(/\\n/gm, '\n'), scopes);
const drive = google.drive({ version: 'v3', auth });

const FOLDER_ID = ENVIRONMENT === 'PROD' ? DRIVE_FOLDER_PROD : DRIVE_FOLDER_DEV;
const VERSION = ENVIRONMENT === 'PROD' ? PRODUCTION_VERSION : DEVELOPMENT_VERSION;
const FILENAME = `${VERSION}.zip`;

const driveLink = `https://drive.google.com/drive/folders/${FOLDER_ID}`;

async function main() {
  actions.setOutput(link, driveLink);

  if (fs.lstatSync(TARGET).isDirectory()) {
    actions.info(`Folder detected in ${TARGET}`);
    actions.info(`Zipping ${TARGET}...`);

    zipDirectory(TARGET, FILENAME)
      .then(() => uploadToDrive())
      .catch((e) => {
        actions.error('Zip failed');
        throw e;
      });
  } else uploadToDrive();
}

/**
 * Zips a directory and stores it in memory
 * @param {string} source File or folder to be zipped
 * @param {string} out Name of the resulting zipped file
 */
function zipDirectory(source, out) {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on('error', (err) => reject(err))
      .pipe(stream);

    stream.on('close', () => {
      actions.info(`Folder successfully zipped: ${archive.pointer()} total bytes written`);
      return resolve();
    });
    archive.finalize();
  });
}

function uploadToDrive() {
  actions.info('Uploading file to Goole Drive...');
  drive.files
    .create({
      requestBody: {
        name: FILENAME,
        parents: [FOLDER_ID]
      },
      media: {
        body: fs.createReadStream(FILENAME)
      }
    })
    .then(() => actions.info('File uploaded successfully'))
    .catch((e) => {
      actions.error('Upload failed');
      throw e;
    });
}

main().catch((e) => actions.setFailed(e));
