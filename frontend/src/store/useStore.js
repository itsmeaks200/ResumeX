import { create } from "zustand";

const initialState = {
  resumeFile: null,
  resumeData: null,
  jdText: "",
  jdAnalysis: null,
  matchResult: null,
  improvements: null,
  jobs: [],
  isLoading: false,
  currentStep: "upload",
  error: null,
  darkMode: false,
};

export const useStore = create((set) => ({
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
