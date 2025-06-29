# 🔒 Security Setup Guide

## ⚠️ IMPORTANT: Required Steps Before Running

This application has been secured and all hardcoded credentials have been removed. You must set up your environment variables before the application will work.

## 🔑 Environment Variables Setup

### 1. Copy the example environment file
```bash
cp .env.example .env
```

### 2. Get Your API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

#### Apify API Token (for web scraping)
1. Go to [Apify Console](https://console.apify.com/account#/integrations)
2. Create a new token
3. Copy the token

### 3. Update Your .env File

Replace the placeholder values in `.env` with your actual keys:

```env
# Frontend Environment Variables (Vite)
VITE_OPENAI_API_KEY=sk-your-actual-openai-api-key-here

# Backend Environment Variables (FastAPI)
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
APIFY_API_TOKEN=your-actual-apify-token-here
```

## 🛡️ Security Features Implemented

### ✅ Fixed Issues:
- ❌ **Removed hardcoded OpenAI API key** from `useOpenAIStream.ts`
- ❌ **Removed hardcoded OpenAI API key** from `useOpenAIDescription.ts`
- ✅ **Enhanced .gitignore** with comprehensive patterns
- ✅ **Updated environment variable structure**
- ✅ **Added backend environment variables**
- ✅ **Improved error messages** for missing API keys

### 🔒 Protected Files:
- `.env` - Contains your actual API keys (git ignored)
- All environment variables are properly separated
- No credentials in source code

## 🚀 Running the Application

### Frontend (React + Vite)
```bash
npm install
npm run dev
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

## 📋 Pre-Push Checklist

Before pushing to GitHub, verify:

- [ ] `.env` file is not tracked by git (`git status` should not show .env)
- [ ] All API keys are in environment variables
- [ ] No hardcoded credentials in source code
- [ ] `.env.example` has placeholder values only
- [ ] Application works with environment variables

## 🔍 Verify Security

Run these commands to double-check:

```bash
# Verify .env is ignored
git status

# Search for any remaining hardcoded keys (should return nothing)
grep -r "sk-proj" src/
grep -r "sk-" src/ --exclude-dir=node_modules

# Verify .env is properly ignored
git check-ignore .env
```

## 🆘 Troubleshooting

### "OpenAI API key not configured" Error
- Check that your `.env` file exists
- Verify the API key format (starts with `sk-`)
- Make sure you've restarted the development server after adding the key

### Backend Issues
- Ensure all backend environment variables are set
- Check that the backend server is running on port 8000
- Verify your Apify token is correct

## 🎯 Alternative: UI-Based API Key Entry

The application also supports entering your OpenAI API key through the UI:
1. Click the "OpenAI Settings" button in the interface
2. Enter your API key
3. It will be stored in your browser's localStorage

**Note:** This method only works for the frontend OpenAI features. Backend features still require environment variables. 