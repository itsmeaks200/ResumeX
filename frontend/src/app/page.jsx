"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { JDInput } from "@/components/JDInput";
import { ResumePreview } from "@/components/ResumePreview";
import { MatchDashboard } from "@/components/MatchDashboard";
import { ImprovementCard } from "@/components/ImprovementCard";
import { JobCard } from "@/components/JobCard";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { StepIndicator } from "@/components/StepIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseResume, analyzeJD, matchResumeJD, getImprovements, searchJobsFromParsed } from "@/lib/api";
import { ArrowRight, FileText, Target, Sparkles, Briefcase, RotateCcw } from "lucide-react";

const STEPS = [
  { id: "upload", label: "Upload" },
  { id: "jd", label: "Job Description" },
  { id: "analysis", label: "Analysis" },
  { id: "improve", label: "Improve" },
  { id: "jobs", label: "Jobs" },
];

export default function Home() {
  const {
    resumeFile, setResumeFile,
    resumeData, setResumeData,
    jdText, setJDText,
    jdAnalysis, setJDAnalysis,
    matchResult, setMatchResult,
    improvements, setImprovements,
    jobs, setJobs,
    isLoading, setIsLoading,
    currentStep, setCurrentStep,
    error, setError,
    darkMode, reset,
  } = useStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleFileSelect = async (file) => {
    setResumeFile(file);
    setIsLoading(true);
    setError(null);

    try {
      const result = await parseResume(file);
      setResumeData(result.data);
      setCurrentStep("jd");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeData || !jdText) return;

    setIsLoading(true);
    setError(null);

    try {
      const jdResult = await analyzeJD(jdText);
      setJDAnalysis(jdResult.data);

      const matchRes = await matchResumeJD(resumeData, jdResult.data);
      setMatchResult(matchRes.data);

      const improveRes = await getImprovements(resumeData, jdResult.data, matchRes.data);
      setImprovements(improveRes.data);

      setCurrentStep("analysis");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchJobs = async () => {
    if (!resumeData) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await searchJobsFromParsed(resumeData);
      setJobs(result.data.jobs || []);
      setCurrentStep("jobs");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence>
          {isLoading && <LoadingOverlay message="AI agents are analyzing..." />}
        </AnimatePresence>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={(step) => {
              const stepIndex = STEPS.findIndex((s) => s.id === step);
              const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
              if (stepIndex <= currentIndex) setCurrentStep(step);
            }}
          />
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Upload Step */}
        {currentStep === "upload" && (
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">ResumeX</h1>
              <p className="text-muted-foreground">
                AI-powered resume analysis and optimization for your dream job
              </p>
            </motion.div>
            <FileUpload
              onFileSelect={handleFileSelect}
              file={resumeFile}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* JD Input Step */}
        {currentStep === "jd" && resumeData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Your Resume
              </h2>
              <ResumePreview data={resumeData} />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" /> Target Job
              </h2>
              <JDInput
                value={jdText}
                onChange={setJDText}
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
              />
              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={handleSearchJobs}
                  disabled={isLoading}
                  className="w-full"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Skip to Job Search
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Step */}
        {currentStep === "analysis" && matchResult && (
          <div className="space-y-6">
            <Tabs defaultValue="match" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="match">Match Analysis</TabsTrigger>
                <TabsTrigger value="improve">Improvements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="match" className="mt-6">
                <MatchDashboard match={matchResult} />
              </TabsContent>
              
              <TabsContent value="improve" className="mt-6">
                {improvements && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Suggested Improvements
                      </h3>
                    </div>
                    {improvements.improvements.map((imp, i) => (
                      <ImprovementCard key={i} improvement={imp} index={i} />
                    ))}
                    
                    {improvements.overall_tips.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">General Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {improvements.overall_tips.map((tip, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => setCurrentStep("jd")}>
                Try Another JD
              </Button>
              <Button onClick={handleSearchJobs}>
                Find Matching Jobs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Jobs Step */}
        {currentStep === "jobs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Matching Jobs ({jobs.length})
              </h2>
              <Button variant="outline" onClick={() => setCurrentStep("jd")}>
                Back to Analysis
              </Button>
            </div>
            
            {jobs.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No jobs found. Try adjusting your resume or search criteria.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job, i) => (
                  <JobCard key={i} job={job} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reset Button */}
        {currentStep !== "upload" && (
          <div className="fixed bottom-6 right-6">
            <Button
              variant="outline"
              size="icon"
              onClick={reset}
              className="rounded-full shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
