# Company Analysis Tool with AI Web Search

A comprehensive analysis tool that combines web technologies analysis, social media sentiment, and AI-powered insights to provide detailed company or person profiling.

## Features

### 🔍 Multi-Source Analysis
- **BuiltWith Integration**: Analyze website technology stack
- **LinkedIn Search**: Find company/person profiles and professional information
- **Reddit Analysis**: Gather social media sentiment and discussions
- **AI Web Analysis**: OpenAI-powered comprehensive website analysis with web search capabilities

### 🤖 AI-Powered Insights
- **GPT-4o Integration**: Advanced AI analysis with web search capabilities
- **Real-time Streaming**: Watch AI analysis unfold in real-time
- **Comprehensive Reports**: Detailed insights about target websites including:
  - Purpose and main services/products
  - Key features and functionality
  - Target audience analysis
  - Business model assessment
  - Technology stack insights
  - Unique value proposition
  - Overall assessment and strategic insights

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key

You have two options:

#### Option A: Environment Variable (Recommended for production)
1. Copy `.env.example` to `.env`
2. Add your OpenAI API key:
```bash
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### Option B: UI Configuration (Recommended for development)
1. Run the application
2. Click "OpenAI Settings" in the interface
3. Enter your API key directly in the browser
4. Your key is stored locally and persists between sessions

### 3. Get Your OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Make sure your key has access to the GPT-4o model
4. Copy the key for use in the application

### 4. Start the Application

#### Frontend
```bash
npm run dev
```

#### Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
python main.py
```

## Usage

1. **Setup**: Configure your OpenAI API key using either method above
2. **Analysis**: Enter a company name or website URL in the chat interface
3. **Watch**: Real-time analysis across multiple data sources:
   - AI analysis streams live insights
   - BuiltWith analyzes the technology stack
   - LinkedIn searches for company profiles
   - Reddit gathers social sentiment
4. **Review**: Comprehensive results displayed in organized cards

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **OpenAI SDK** for AI integration

### Backend
- **Python FastAPI** for API endpoints
- **BuiltWith API** integration
- **LinkedIn API** integration
- **Reddit API** integration

## Features in Detail

### AI Web Analysis
- **Model**: GPT-4o with web search capabilities
- **Streaming**: Real-time response streaming
- **Analysis Depth**: Comprehensive 7-point analysis framework
- **Security**: API keys stored locally, never transmitted to servers

### Multi-Source Intelligence
- **Technology Stack**: Complete technology analysis via BuiltWith
- **Professional Data**: LinkedIn company and people search
- **Social Sentiment**: Reddit discussions and community insights
- **AI Insights**: Advanced reasoning and pattern recognition

## Development

### Project Structure
```
project/
├── src/
│   ├── components/          # React components
│   │   ├── OpenAIStreamCard.tsx    # AI streaming display
│   │   ├── ApiKeyInput.tsx         # API key management
│   │   └── ...
│   ├── hooks/
│   │   ├── useOpenAIStream.ts      # OpenAI streaming logic
│   │   └── ...
├── backend/                 # Python FastAPI backend
└── ...
```

### Key Components
- `useOpenAIStream`: Custom hook for OpenAI streaming
- `OpenAIStreamCard`: Real-time AI analysis display
- `ApiKeyInput`: Secure API key management
- Integration with existing analysis pipeline

## Security Notes

- API keys are stored locally in browser localStorage
- Environment variables are supported for server-side deployment
- No API keys are transmitted to backend servers
- Browser-based OpenAI integration for maximum security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and research purposes. 