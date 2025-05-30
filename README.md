# ProofSnap.AI

ProofSnap.AI is an advanced web application for verifying the authenticity of screenshots and images, extracting text using OCR, and generating detailed verification reports.

## Features

- 🔍 **Image Verification**: Detect potential tampering in screenshots and images
- 📝 **OCR Text Extraction**: Extract text from images using Tesseract.js
- 📊 **Detailed Reports**: Generate comprehensive verification reports
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 📄 **PDF Export**: Download verification reports in PDF format

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **OCR**: Tesseract.js
- **PDF Generation**: jsPDF
- **Analytics**: Vercel Web Analytics

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/Barsaan/ProofSnap.git
   cd ProofSnap
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
ProofSnap/
├── public/              # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # React components
│   └── utils/          # Utility functions
└── scripts/            # Build and utility scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- Barsaan ([@Barsaan](https://github.com/Barsaan))

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tesseract.js](https://github.com/naptha/tesseract.js)
- [jsPDF](https://github.com/MrRio/jsPDF)
