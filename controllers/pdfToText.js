// controllers/pdfToText.js

const axios = require('axios');
const { PDFDocument } = require('pdf-lib'); // For PDF pre-processing

// Load environment variables
const apiKey = process.env.DPDF_API_KEY;

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

        // Check for empty or invalid files
        if (!pdfFile.data || pdfFile.size === 0) {
            return res.status(400).json({ error: 'Uploaded file is empty or invalid' });
        }

        // Log the file metadata for debugging
        console.log('Uploaded File Details:', {
            name: pdfFile.name,
            mimetype: pdfFile.mimetype,
            size: pdfFile.size,
        });

        // Pre-process the PDF using pdf-lib to rebuild its structure
        const pdfDoc = await PDFDocument.load(pdfFile.data); // Load the PDF
        const sanitizedPdfData = await pdfDoc.save(); // Save the processed PDF

        // Send the sanitized PDF to DynamicPDF API
        const url = 'https://api.dpdf.io/v1.0/pdf-text';
        const response = await axios.post(
            url,
            sanitizedPdfData, // Use sanitized PDF data
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/pdf',
                },
            }
        );

        // Respond with the extracted text
        res.status(200).json({ extractedText: response.data });
    } catch (error) {
        console.error('Error processing PDF:', error.message);

        // Handle specific API errors
        if (error.response && error.response.data.message) {
            return res.status(400).json({
                error: error.response.data.message,
                suggestion: 'Please check the uploaded file for corruption or re-save it using a PDF editor.',
            });
        }

        // General error handling
        res.status(500).json({ error: 'Failed to process PDF text' });
    }
};
