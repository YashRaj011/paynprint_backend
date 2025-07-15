// utils/convertToPDF.js
const fs = require('fs');
const path = require('path');
const libre = require('libreoffice-convert');

/**
 * Converts any supported buffer (docx, pptx, xlsx) to PDF and saves to /uploads.
 * @param {Buffer} inputBuffer - The uploaded file buffer
 * @param {string} originalName - The original file name (used to generate .pdf name)
 * @returns {Promise<string>} - Path to saved PDF
 */
const convertToPDF = (inputBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const pdfName = `${Date.now()}-${path.parse(originalName).name}.pdf`;
    const outputPath = path.join(__dirname, '../uploads', pdfName);

    libre.convert(inputBuffer, '.pdf', undefined, (err, done) => {
      if (err) return reject(err);

      fs.writeFileSync(outputPath, done);
      resolve(outputPath);
    });
  });
};

module.exports = convertToPDF;
