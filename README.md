# Company Intelligence Dashboard

A real-time AI-powered company analysis dashboard that simultaneously streams insights from multiple data sources.

## ✨ Features

- **🚀 Real-time Streaming**: All analyses run simultaneously with live AI streaming
- **📊 Reddit Sentiment Analysis**: Community opinion and sentiment analysis  
- **🔧 Tech Stack Analysis**: Technology architecture insights
- **🏢 Company Intelligence**: Business analysis and market positioning
- **📰 News Analysis**: Latest media coverage and trends
- **🎯 Specialized AI Prompts**: Each widget uses unique, optimized prompts for better insights

## 🏗️ Architecture

This is a **pure JavaScript/TypeScript solution** with no backend dependencies:

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **AI Processing**: Direct OpenAI API integration with streaming
- **Data Sources**: Direct API calls to public endpoints
- **State Management**: React hooks with specialized streaming logic

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:5173`

## 🔑 API Key Setup

### Required: OpenAI API Key
- Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Add it to your `.env` file as `VITE_OPENAI_API_KEY`

### Optional: Enhanced Data Sources
For production use, you can integrate real APIs:
- **Reddit API**: For actual Reddit sentiment data
- **News API**: For real news coverage
- **Wappalyzer API**: For accurate tech stack detection

## 💡 How It Works

1. **Enter a company name** in the search interface
2. **Four AI agents start simultaneously**:
   - Reddit Sentiment Agent (community analysis)
   - Tech Stack Agent (technology insights) 
   - Company Intelligence Agent (business analysis)
   - News Analysis Agent (media coverage)
3. **Watch real-time streaming** as each AI agent provides specialized insights
4. **All analyses run in parallel** for maximum speed and engagement

## 🎨 Key Improvements

### ✅ What We Fixed
- ❌ **Removed Python backend dependency** - Now pure JavaScript
- ❌ **Removed OpenAI function calling complexity** - Direct API usage
- ❌ **Removed unnecessary analysis simulation** - Real streaming
- ❌ **Simplified architecture** - Clean, maintainable code

### ✅ What We Added  
- ✅ **Simultaneous API calls** - All widgets stream at once
- ✅ **Specialized AI prompts** - Each widget has unique analysis focus
- ✅ **Real-time streaming UI** - Live updates with visual feedback
- ✅ **Clean widget architecture** - Modular, reusable components
- ✅ **Responsive design** - Works on all screen sizes

## 🔧 Development

### Project Structure
```
src/
├── components/
│   ├── widgets/          # Specialized analysis widgets
│   │   ├── RedditSentimentWidget.tsx
│   │   ├── TechStackWidget.tsx
│   │   ├── CompanyIntelligenceWidget.tsx
│   │   └── NewsAnalysisWidget.tsx
│   └── ChatInterface.tsx # Search interface
├── hooks/
│   └── useWidgetStreaming.ts  # Streaming logic for each widget
├── services/
│   └── apiServices.ts    # API integration layer
└── App.tsx              # Main application
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 Demo Usage

Try searching for companies like:
- **OpenAI** - See AI industry insights
- **Microsoft** - Large enterprise analysis  
- **Stripe** - Fintech company analysis
- **Airbnb** - Platform business model

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to any static hosting service:
   - Vercel
   - Netlify  
   - AWS S3
   - GitHub Pages

3. **Set environment variables** in your hosting platform

## 🔒 Security Notes

- API keys are handled securely through environment variables
- All API calls are made from the browser (no sensitive backend exposure)
- OpenAI API calls use the official SDK with proper error handling

## 📝 License

MIT License - feel free to use this for your own projects!

---

**Built for real-time company intelligence with simultaneous AI analysis** 🚀 