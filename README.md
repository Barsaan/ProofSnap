# ProofSnap.AI

ProofSnap.AI is a web application that helps users verify the authenticity of screenshots and images, extract text using OCR, and generate detailed verification reports.

## Features

- 📸 Upload screenshots and images (JPG, PNG)
- 🔍 Basic image tampering detection
- 📝 Text extraction using OCR (Tesseract.js)
- 📄 Generate and download PDF verification reports
- 💻 Clean, responsive UI built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **OCR Engine**: Tesseract.js
- **PDF Generation**: jsPDF
- **Image Processing**: Browser's native APIs
- **State Management**: React Hooks + SessionStorage
- **Deployment**: Vercel (recommended)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/proofsnap-ai.git
   cd proofsnap-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── analyze/           # Analysis page
│   └── report/            # Report page
├── components/            # React components
│   ├── ImageUploader.tsx
│   ├── OCRDisplay.tsx
│   ├── VerificationCard.tsx
│   └── PDFExportButton.tsx
└── styles/               # Global styles
```

## Usage

1. Visit the home page and upload an image
2. Wait for OCR processing to complete
3. Review the extracted text
4. Click "Verify Now" to generate a report
5. Download the PDF report if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
