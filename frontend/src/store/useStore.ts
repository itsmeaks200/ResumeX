import { create } from "zustand";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  summary: string;
  education: any[];
  experience: any[];
  projects: any[];
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    soft_skills: string[];
  };
  certifications: string[];
}

interface JDAnalysis {
  title: string;
  company: string;
  required_skills: string[];
  preferred_skills: string[];
  experience_years: string;
  seniority: string;
  ats_keywords: string[];
  responsibilities: string[];
  benefits: string[];
}

interface MatchResult {
  ats_score: number;
  skill_overlap_percent: number;
  matched_skills: string[];
  missing_skills: string[];
  keyword_coverage: number;
  experience_match: string;
  strengths: string[];
  gaps: string[];
}

interface Improvement {
  section: string;
  original: string;
  suggested: string;
  reason: string;
  severity: "low" | "medium" | "high";
  keywords_added: string[];
}

interface ImprovementSuggestions {
  improvements: Improvement[];
  missing_keywords: string[];
  quantification_tips: string[];
  section_order: string[];
  overall_tips: string[];
}

interface JobPosting {
  title: string;
  company: string;
  location: string;
  url: string;
  salary: string;
  description: string;
  match_score: number;
  source: string;
}

interface AppState {
  // Data
  resumeFile: File | null;
  resumeData: ResumeData | null;
  jdText: string;
  jdAnalysis: JDAnalysis | null;
  matchResult: MatchResult | null;
  improvements: ImprovementSuggestions | null;
  jobs: JobPosting[];
  
  // UI State
  isLoading: boolean;
  currentStep: "upload" | "jd" | "analysis" | "improve" | "jobs";
  error: string | null;
  darkMode: boolean;
  
  // Actions
  setResumeFile: (file: File | null) => void;
  setResumeData: (data: ResumeData | null) => void;
  setJDText: (text: string) => void;
  setJDAnalysis: (analysis: JDAnalysis | null) => void;
  setMatchResult: (result: MatchResult | null) => void;
  setImprovements: (improvements: ImprovementSuggestions | null) => void;
  setJobs: (jobs: JobPosting[]) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentStep: (step: AppState["currentStep"]) => void;
  setError: (error: string | null) => void;
  toggleDarkMode: () => void;
  reset: () => void;
}

const initialState = {
  resumeFile: null,
  resumeData: null,
  jdText: "",
  jdAnalysis: null,
  matchResult: null,
  improvements: null,
  jobs: [],
  isLoading: false,
  currentStep: "upload" as const,
  error: null,
  darkMode: false,
};

export const useStore = create<AppState>((set) => ({
  ...initialState,
  
  setResumeFile: (file) => set({ resumeFile: file }),
  setResumeData: (data) => set({ resumeData: data }),
  setJDText: (text) => set({ jdText: text }),
  setJDAnalysis: (analysis) => set({ jdAnalysis: analysis }),
  setMatchResult: (result) => set({ matchResult: result }),
  setImprovements: (improvements) => set({ improvements }),
  setJobs: (jobs) => set({ jobs }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setError: (error) => set({ error }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  reset: () => set(initialState),
}));
