const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Converts Office files (DOCX, PPTX, XLSX) to PDF using LibreOffice
 * @param {string} inputPath - The full path to the uploaded file
 * @param {string} outputDir - The folder where we want the PDF to land
 * @returns {Promise<string>} - Resolves with the path to the new PDF
 */
const convertOfficeToPdf = (inputPath, outputDir) => {
    return new Promise((resolve, reject) => {
        // LibreOffice Headless Command
        // --headless: Runs without a GUI (needed for servers)
        // --convert-to pdf: The magic command
        // --outdir: Where to save the result
        const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${inputPath}"`;

        console.log(`Running command: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing LibreOffice: ${error.message}`);
                return reject(error);
            }

            // LibreOffice saves the file with the same name but .pdf extension
            const originalName = path.basename(inputPath, path.extname(inputPath));
            const outputPath = path.join(outputDir, `${originalName}.pdf`);

            // Verify if the file was actually created
            if (fs.existsSync(outputPath)) {
                resolve(outputPath);
            } else {
                reject(new Error("Conversion failed: Output file not found."));
            }
        });
    });
};

module.exports = { convertOfficeToPdf };