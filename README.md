# Hooksy.studio

A modern web application that generates viral hooks, titles, hashtags, and CTAs using OpenAI's GPT-3.5. Built with Next.js, TypeScript, and CSS Modules.

## Features

- 🎯 **Viral Hook Generation**: Create attention-grabbing hooks that make people want to read more
- 📝 **Compelling Titles**: Generate shareable titles for social media posts
- 🏷️ **Relevant Hashtags**: Get trending hashtags for maximum reach
- 🎪 **Strong CTAs**: Create action-oriented call-to-action phrases
- 🎨 **Beautiful UI**: Modern, responsive design with smooth animations
- 📱 **Mobile Optimized**: Works perfectly on all devices
- ⚡ **Fast Performance**: Built with Next.js for optimal speed

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS Modules
- **AI**: OpenAI GPT-3.5 Turbo
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HooksyStudio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Enter your topic**: Describe what you want to create content about
2. **Choose your tone**: Select from professional, casual, humorous, inspirational, urgent, curious, controversial, or storytelling
3. **Generate content**: Click the button to generate viral hooks, titles, hashtags, and CTAs
4. **Copy and use**: Click the copy button on any generated content to use it

## Project Structure

```
HooksyStudio/
├── app/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Header.module.css
│   │   ├── InputForm.tsx
│   │   ├── InputForm.module.css
│   │   ├── OutputDisplay.tsx
│   │   └── OutputDisplay.module.css
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── page.module.css
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

## API Endpoints

### POST /api/generate

Generates viral content based on topic and tone.

**Request Body:**
```json
{
  "topic": "string",
  "tone": "string"
}
```

**Response:**
```json
{
  "hooks": ["string[]"],
  "titles": ["string[]"],
  "hashtags": ["string[]"],
  "ctas": ["string[]"]
}
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ using Next.js and OpenAI 