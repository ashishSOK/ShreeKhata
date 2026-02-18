import PDFDocument from 'pdfkit';

try {
    const doc = new PDFDocument();
    console.log('PDFDocument instantiated successfully');
} catch (error) {
    console.error('Error instantiating PDFDocument:', error);
}
