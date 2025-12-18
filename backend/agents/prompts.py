RESUME_PARSER_PROMPT = """You are an expert resume parser. Extract structured information from the resume text. Be precise and extract ALL information.

Resume Text:
{resume_text}

Extract and return a JSON object with this exact structure:
{{
    "name": "Full name",
    "email": "email@example.com",
    "phone": "phone number",
    "linkedin": "linkedin url if present",
    "location": "city, state/country",
    "summary": "professional summary if present",
    "education": [
        {{
            "institution": "University name",
            "degree": "Degree type (BS, MS, PhD, etc)",
            "field": "Field of study",
            "start_date": "YYYY or MM/YYYY",
            "end_date": "YYYY or MM/YYYY or Present",
            "gpa": "GPA if mentioned"
        }}
    ],
    "experience": [
        {{
            "company": "Company name",
            "title": "Job title",
            "start_date": "MM/YYYY",
            "end_date": "MM/YYYY or Present",
            "location": "City, State",
            "bullets": ["Achievement 1", "Achievement 2"]
        }}
    ],
    "projects": [
        {{
            "name": "Project name",
            "description": "Brief description",
            "technologies": ["tech1", "tech2"],
            "url": "project url if present"
        }}
    ],
    "skills": {{
        "languages": ["Python", "JavaScript"],
        "frameworks": ["React", "FastAPI"],
        "tools": ["Docker", "AWS"],
        "soft_skills": ["Leadership", "Communication"]
    }},
    "certifications": ["Cert 1", "Cert 2"]
}}

Be thorough and extract ALL information. Handle poor formatting gracefully.
Return ONLY valid JSON, no explanations."""

JD_ANALYZER_PROMPT = """You are an expert job description analyzer. Extract structured requirements from the JD.

Job Description:
{jd_text}

Extract and return a JSON object:
{{
    "title": "Job title",
    "company": "Company name if mentioned",
    "required_skills": ["skill1", "skill2"],
    "preferred_skills": ["nice-to-have skill1"],
    "experience_years": "X+ years or range",
    "seniority": "Junior/Mid/Senior/Lead/Principal",
    "ats_keywords": ["keyword1", "keyword2"],
    "responsibilities": ["responsibility1", "responsibility2"],
    "benefits": ["benefit1", "benefit2"]
}}

Focus on extracting ATS-relevant keywords that applicants should include.
Return ONLY valid JSON."""

MATCHING_PROMPT = """You are an ATS scoring expert. Analyze resume-JD match.

Resume Data:
{resume_json}

Job Description Analysis:
{jd_json}

Calculate and return:
{{
    "ats_score": 0-100 integer,
    "skill_overlap_percent": 0.0-100.0,
    "matched_skills": ["skill1", "skill2"],
    "missing_skills": ["missing1", "missing2"],
    "keyword_coverage": 0.0-100.0,
    "experience_match": "Exceeds/Meets/Below requirements",
    "strengths": ["strength1", "strength2"],
    "gaps": ["gap1", "gap2"]
}}

Scoring criteria:
- Skills match: 40%
- Experience relevance: 25%
- Keyword coverage: 20%
- Education fit: 15%

Be precise and actionable. Return ONLY valid JSON."""

IMPROVEMENT_PROMPT = """You are a professional resume coach. Suggest improvements to match the JD better.

Resume Data:
{resume_json}

Job Description Analysis:
{jd_json}

Match Analysis:
{match_json}

Provide specific, actionable improvements:
{{
    "improvements": [
        {{
            "section": "experience/skills/summary/etc",
            "original": "Original text",
            "suggested": "Improved text with keywords",
            "reason": "Why this change helps",
            "severity": "low/medium/high",
            "keywords_added": ["keyword1"]
        }}
    ],
    "missing_keywords": ["keyword1", "keyword2"],
    "quantification_tips": ["Add metrics to bullet X"],
    "section_order": ["summary", "experience", "skills", "education", "projects"],
    "overall_tips": ["General tip 1", "General tip 2"]
}}

Focus on:
1. Adding missing ATS keywords naturally
2. Quantifying achievements (numbers, percentages)
3. Action verbs alignment
4. Keyword density optimization

Return ONLY valid JSON."""

UI_FORMATTER_PROMPT = """Format the analysis results for UI display.

Raw Data:
{raw_data}

Return a UI-friendly structure with:
{{
    "success": true,
    "data": {{}},
    "tooltips": {{
        "ats_score": "Explanation of ATS score",
        "skill_match": "How skill matching works"
    }},
    "severity_map": {{
        "missing_skills": "high",
        "keyword_coverage": "medium"
    }}
}}

Make tooltips helpful for non-technical users.
Return ONLY valid JSON."""
