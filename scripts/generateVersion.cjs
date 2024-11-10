/* eslint-disable no-undef */


const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');

// Define the path to version.json in the public directory
// eslint-disable-next-line no-undef
const versionFilePath = path.join(__dirname, '..', 'public', 'version.json');

// Extract the version from package.json
const versionData = {
  version: packageJson.version,
};

// Write the version data to version.json
fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));

console.log(`Version file created at ${versionFilePath} with version: ${packageJson.version}`);
