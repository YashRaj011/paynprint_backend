// utils/pdfUtils.js
const fs = require('fs');
const pdfParse = require('pdf-parse');

async function getPageCount(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.numpages;
}

module.exports = { getPageCount };
