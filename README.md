# ResumeX

AI-powered resume analysis platform with multi-agent orchestration using Groq LPU inference.

## Overview

ResumeX leverages advanced AI agents to provide comprehensive resume analysis, ATS scoring, and job matching capabilities. The platform uses a sophisticated multi-agent architecture built with LangGraph and powered by Groq's high-performance LLM inference.

## Features

- **Resume Parsing**: Extract structured data from PDF, DOCX, and TXT files
- **ATS Scoring**: Receive 0-100 compatibility scores based on job requirements
- **Skill Analysis**: Identify matched and missing skills with detailed breakdowns
- **AI Coaching**: Get specific, actionable improvement suggestions
- **Job Discovery**: Find matching job postings from multiple job boards
- **Modern Interface**: Clean, responsive UI with dark mode support

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

## Technology Stack

### Frontend
- **Next.js 14** with App Router
- **JavaScript** for development
- **Tailwind CSS** + **ShadCN UI** for styling
- **Framer Motion** for animations
- **Zustand** for state management
- **React Dropzone** for file uploads
- **React Hook Form** for form handling
- **Lucide React** for icons

### Backend
- **FastAPI** + **Python 3.11+**
- **LangGraph** for agent orchestration
- **Groq API** with Llama 3.3 70B model
- **Pydantic** for data validation
- **Sentence Transformers** for embeddings
- **FAISS** for vector similarity search

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API Key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ResumeX.git
   cd ResumeX
   ```

2. **Backend setup**
   ```bash
   cd backend
   
   # Create and activate virtual environment
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Configure environment
   cp .env.example .env
   # Edit .env and add your GROQ_API_KEY
   
   # Start the server
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Frontend setup**
   ```bash
   cd frontend
   
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - API Documentation: `http://localhost:8000/docs`

## Environment Configuration

### Backend (.env)
```env
GROQ_API_KEY=your_groq_api_key_here
JSEARCH_API_KEY=optional_for_job_search
ADZUNA_APP_ID=optional
ADZUNA_API_KEY=optional
REMOTIVE_API_KEY=optional
TAVILY_API_KEY=optional
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

### Resume Operations
- `POST /api/resume/parse` - Parse resume file (PDF/DOCX/TXT)

### Job Description Analysis
- `POST /api/jd/analyze` - Analyze job description text

### Matching & Analysis
- `POST /api/match` - Match resume against job description
- `POST /api/improve` - Get improvement suggestions

### Job Search
- `POST /api/jobs/search` - Search jobs from resume file
- `POST /api/jobs/search-from-parsed` - Search jobs from parsed resume

### Complete Analysis
- `POST /api/analyze/full` - Full pipeline analysis

## Agent System

### Resume Parser Agent
Extracts structured data including personal information, education, experience, skills, and projects from various document formats.

### Job Description Analyzer Agent
Analyzes job postings to identify required skills, experience levels, keywords, and responsibilities.

### Matching Agent
Calculates ATS scores and analyzes skill overlap using embeddings and LLM reasoning.

### Improvement Agent
Provides specific suggestions for resume enhancement, including bullet point rewrites and keyword optimization.

### Job Search Agent
Queries multiple job APIs and ranks opportunities by relevance to the user's profile.

### UI Formatter Agent
Transforms raw analysis data into user-friendly formats with appropriate visual indicators.

## Scoring Methodology

**ATS Score Components:**
- Skills match: 40%
- Experience relevance: 25%
- Keyword coverage: 20%
- Education fit: 15%

## Project Structure

```
.
├── backend/
│   ├── agents/           # AI agent implementations
│   ├── models/           # Pydantic schemas
│   ├── orchestrator/     # LangGraph workflows
│   ├── config.py         # Configuration settings
│   ├── main.py           # FastAPI application
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and API clients
│   │   └── store/        # Zustand state management
│   └── package.json
└── README.md
```

## Development

### Testing
```bash
# Backend tests
cd backend
python test_parsing.py

# Frontend build test
cd frontend
npm run build
```

### Troubleshooting

**Model decommissioned error**
Update `backend/config.py` with current Groq models from [console.groq.com/docs/models](https://console.groq.com/docs/models)

**API connection errors**
- Ensure backend is running on port 8000
- Verify GROQ_API_KEY is set in `.env`
- Check frontend API URL in `.env.local`

**Resume parsing failures**
- Confirm file format is PDF, DOCX, or TXT
- Ensure file size is under 10MB
- Try with a simpler resume format

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue for bugs and feature requests.

## Support

For questions, issues, or support, please open an issue on GitHub.
