# API Key Validation Platform

A modern, responsive web application built with Next.js, shadcn/ui, and Tailwind CSS for validating OpenAI API keys across all available models.

## Features

- 🔐 **Secure API Key Testing**: Test your OpenAI API keys safely
- 🤖 **Multi-Model Validation**: Test against all OpenAI models including:
  - GPT-4o and GPT-4o-mini
  - GPT-4 Turbo and GPT-4
  - GPT-3.5 Turbo variants
  - Legacy text completion models
- 📊 **Real-time Results**: See validation results with response times
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support
- ⚡ **Fast Testing**: Parallel testing across all models

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd api-key-validator
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter Your API Key**: Paste your OpenAI API key (starts with `sk-`) in the input field
2. **Click Validate**: The application will test your key against all available OpenAI models
3. **View Results**: See detailed results for each model including:
   - Success/error status
   - Response time
   - Actual API responses
   - Error messages if any

## API Key Security

- Your API key is only sent directly to OpenAI's servers
- No API keys are stored or logged on our servers
- All validation happens client-side for maximum security

## Models Tested

The platform tests your API key against these OpenAI models:

### Chat Models
- `gpt-4o` - Latest GPT-4 model
- `gpt-4o-mini` - Efficient GPT-4 variant
- `gpt-4-turbo` - High-performance GPT-4
- `gpt-4` - Standard GPT-4
- `gpt-3.5-turbo` - Popular GPT-3.5 model
- `gpt-3.5-turbo-16k` - Extended context GPT-3.5

### Legacy Models
- `text-davinci-003` - Advanced text completion
- `text-davinci-002` - Standard text completion
- `text-curie-001` - Fast text completion
- `text-babbage-001` - Basic text completion
- `text-ada-001` - Simple text completion

## Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API requests

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
└── lib/
    └── utils.ts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions, please open an issue on GitHub.