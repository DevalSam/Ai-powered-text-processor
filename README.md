# AI-Powered Text Processor

A modern web application built with Next.js that leverages Chrome's experimental AI APIs to provide text processing capabilities including language detection, translation, and text summarization.

## Features

- 🔍 **Language Detection**: Automatically detects the language of input text
- 🌐 **Translation**: Translate text between multiple languages including:
  - English (en)
  - Portuguese (pt)
  - Spanish (es)
  - Russian (ru)
  - Turkish (tr)
  - French (fr)
- 📝 **Text Summarization**: Generate concise summaries of long English texts
- 💬 **Chat-like Interface**: User-friendly chat interface with message history
- 🎨 **Modern Design**: Clean, responsive UI with minimalistic design
- ⌨️ **Keyboard Shortcuts**: Press Enter to send messages
- 📱 **Mobile Friendly**: Works great on all device sizes

## Prerequisites

- Google Chrome browser (latest version recommended)
- Chrome Experimental Web Platform features enabled
- Node.js 18.x or later
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone git@github.com:DevalSam/Ai-powered-text-processor.git
cd Ai-powered-text-processor
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Enable Chrome experimental features:
   - Open Chrome
   - Navigate to `chrome://flags/#enable-experimental-web-platform-features`
   - Enable "Experimental Web Platform features"
   - Restart Chrome

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with Chrome to see the application.

## Usage

1. Type your text in the input field at the bottom of the chat window
2. Press Enter or click the send button to process the text
3. The application will automatically detect the language
4. For English texts longer than 150 characters, a "Summarize" button will appear
5. Use the language selector to translate the text to different languages

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide React](https://lucide.dev/) - Icons
- Chrome AI APIs
  - Language Detection API
  - Translation API
  - Summarization API

## Project Structure

```
src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── textarea.tsx
│   │   └── button.tsx
│   ├── ChatInterface.tsx
│   ├── MessageDisplay.tsx
│   └── LanguageSelector.tsx
├── lib/
│   └── utils.ts
├── types/
│   └── index.ts
├── utils/
│   └── chrome-api.ts
└── constants/
    └── languages.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Known Issues

- The application requires Chrome browser with experimental features enabled
- Some Chrome AI APIs might be unstable or change without notice
- Translation and summarization may have limitations based on text length

## Troubleshooting

If the Chrome AI APIs are not working:

1. Make sure you're using Google Chrome (not Edge, Brave, or other Chromium browsers)
2. Check if experimental features are enabled:
   - Go to `chrome://flags/#enable-experimental-web-platform-features`
   - Enable the flag
   - Restart Chrome
3. Update Chrome to the latest version
4. Clear browser cache and reload the page

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

DevalSam - [@DevSammy](https://twitter.com/yourtwitter)

Project Link: [https://github.com/DevalSam/Ai-powered-text-processor](https://github.com/DevalSam/Ai-powered-text-processor)

---

Made with ❤️ by [DevalSam](https://github.com/DevalSam)
