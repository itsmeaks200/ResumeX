# ResumeX 🚀

AI-powered resume analysis platform with multi-agent orchestration using Groq LPU inference.

![ResumeX](https://img.shields.io/badge/AI-Powered-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![Next.js](https://img.shields.io/badge/next.js-14-black)

## ✨ Features

- 📄 **Resume Parsing** - Extract structured data from PDF/DOCX/TXT
- 🎯 **ATS Scoring** - Get 0-100 score based on job match
- 🔍 **Skill Analysis** - See matched and missing skills
- 💡 **AI Coaching** - Get specific improvement suggestions
- 🔎 **Job Discovery** - Find matching job postings
- 🎨 **Modern UI** - Clean interface with dark mode

## Architecture

```
Frontend (Next.js + Tailwind)
         || REST API
    Backend (FastAPI)
         |
--------------------------------------------------
|     Agent Orchestrator (LangGraph)             |
--------------------------------------------------
|        |        |        |        |            |
Resume  JD Match  Resume   Job      UI
Parser  Agent    Coach    Search   Formatter
Agent            Agent    Agent    Agent
```

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- JavaScipt
- Tailwind CSS + ShadCN UI
- Framer Motion (animations)
- Zustand (state management)
- React Dropzone

### Backend
- FastAPI + Python 3.11
- LangGraph (agent orchestration)
- Groq API (LLM inference - llama-3.3-70b-versatile)
- Pydantic (validation)
- Sentence Transformers (embeddings)
- FAISS (vector search)

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key (free at https://console.groq.com)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/ResumeX.git
cd ResumeX
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Copy .env.example to .env and add your GROQ_API_KEY
cp .env.example .env
# Edit .env and add: GROQ_API_KEY=your_key_here

# Start backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`

### 3. Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 4. Open Browser
Navigate to `http://localhost:3000` and start analyzing resumes!

## 📋 Environment Variables

### Backend (.env)
```
GROQ_API_KEY=your_groq_api_key_here
JSEARCH_API_KEY=optional_for_job_search
ADZUNA_APP_ID=optional
ADZUNA_API_KEY=optional
REMOTIVE_API_KEY=optional
TAVILY_API_KEY=optional
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔌 API Endpoints

### Resume Operations
- `POST /api/resume/parse` - Parse resume file (PDF/DOCX/TXT)
  - Returns: Structured resume data

### Job Description
- `POST /api/jd/analyze` - Analyze job description text
  - Returns: Extracted requirements, skills, keywords

### Matching & Analysis
- `POST /api/match` - Match resume against JD
  - Returns: ATS score, skill overlap, gaps
- `POST /api/improve` - Get improvement suggestions
  - Returns: Specific edits, missing keywords, tips

### Job Search
- `POST /api/jobs/search` - Search jobs from resume file
  - Returns: Matching job postings with scores
- `POST /api/jobs/search-from-parsed` - Search jobs from parsed resume
  - Returns: Matching job postings

### Full Pipeline
- `POST /api/analyze/full` - Complete analysis (parse + analyze + match + improve)
  - Returns: All analysis results

## 🎨 UI Workflow

1. **Upload Resume** - Drag & drop or select PDF/DOCX
2. **Paste Job Description** - Input target job posting
3. **View Analysis** - See ATS score, skill match, gaps
4. **Get Improvements** - Review specific suggestions
5. **Find Jobs** - Discover matching opportunities

## 🤖 Agent Architecture

### Resume Parser Agent
- Extracts: Name, contact, education, experience, skills, projects
- Handles: PDF, DOCX, TXT formats
- Uses: Groq llama-3.3-70b-versatile

### JD Analyzer Agent
- Extracts: Required skills, experience level, keywords
- Identifies: Seniority, responsibilities, benefits
- Uses: Groq llama-3.3-70b-versatile

### Matching Agent
- Calculates: ATS score (0-100), skill overlap %
- Analyzes: Keyword coverage, experience fit
- Uses: Embeddings + LLM reasoning

### Improvement Agent
- Suggests: Bullet rewrites, keyword insertion
- Provides: Quantification tips, section reordering
- Uses: LLM with context awareness

### Job Search Agent
- Queries: Adzuna, JSearch, Remotive APIs
- Ranks: By cosine similarity to resume
- Returns: Top 10 matching jobs

### UI Formatter Agent
- Converts: Raw data to UI-friendly format
- Adds: Tooltips, severity levels, explanations
- Ensures: Accessibility and clarity

## 📊 Scoring Methodology

**ATS Score (0-100)**
- Skills match: 40%
- Experience relevance: 25%
- Keyword coverage: 20%
- Education fit: 15%

**Skill Overlap %**
- Percentage of required skills found in resume

**Keyword Coverage %**
- Percentage of ATS keywords present

## 🔧 Development

### Project Structure
```
.
├── backend/
│   ├── agents/           # AI agents
│   ├── models/           # Pydantic schemas
│   ├── orchestrator/     # LangGraph workflows
│   ├── config.py         # Configuration
│   ├── main.py           # FastAPI app
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities & API
│   │   └── store/        # Zustand state
│   └── package.json
└── README.md
```

### Running Tests
```bash
# Backend
cd backend
python backend/test_parsing.py

# Frontend
cd frontend
npm run build
```

## 🐛 Troubleshooting

### "Model decommissioned" error
- Update `backend/config.py` with current Groq models
- Check: https://console.groq.com/docs/models

### API connection errors
- Ensure backend is running: `uvicorn main:app --reload`
- Check GROQ_API_KEY is set in `.env`
- Verify frontend API URL in `.env.local`

### Resume parsing fails
- Ensure file is PDF, DOCX, or TXT
- Check file size < 10MB
- Try with simpler resume format

## 🐛 Troubleshooting

### Backend won't start
- Check GROQ_API_KEY is set in `backend/.env`
- Ensure Python 3.11+ is installed
- Try: `pip install -r requirements.txt --force-reinstall`

### Frontend can't connect
- Ensure backend is running on port 8000
- Check `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Try hard refresh: `Ctrl + Shift + R`

### CORS errors
- Restart backend server
- Clear browser cache
- Ensure both servers are running

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Star This Repo

If you find ResumeX helpful, please give it a star on GitHub!

## 📞 Support

For issues or questions, please open a GitHub issue.
