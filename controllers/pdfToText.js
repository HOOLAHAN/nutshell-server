// controllers/pdfToText.js

const pdfParse = require('pdf-parse');

exports.pdfToText = async (req, res) => {
    try {
        // Check if a file is provided in the request
        if (!req.files || !req.files.pdfFile) {
            return res.status(400).json({ error: 'No PDF file provided' });
        }

        const pdfFile = req.files.pdfFile;

        // Validate that the uploaded file is a PDF
        if (pdfFile.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Uploaded file is not a valid PDF' });
        }

        // Parse the PDF file buffer
        const data = await pdfParse(pdfFile.data);

        // Respond with the extracted text
        res.status(200).json({ text: data.text });
    } catch (error) {
        console.error('Error processing PDF:', error.message);
        if (error.message.includes('Invalid PDF structure')) {
            return res.status(400).json({ error: 'The uploaded PDF file is invalid or corrupted.' });
        }
        res.status(500).json({ error: 'Failed to extract text from PDF' });
    }
};
