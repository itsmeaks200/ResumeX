"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadialScore } from "./RadialScore";
import { SkillBar } from "./SkillBar";
import { SkillChips } from "./SkillChips";
import { Target, TrendingUp, AlertTriangle } from "lucide-react";

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

interface MatchDashboardProps {
  match: MatchResult;
}

export function MatchDashboard({ match }: MatchDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center justify-center p-6">
          <RadialScore score={match.ats_score} label="ATS Score" />
        </Card>
        
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-4 h-4" /> Match Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <SkillBar 
              label="Skill Overlap" 
              value={match.skill_overlap_percent} 
              color="bg-green-500"
            />
            <SkillBar 
              label="Keyword Coverage" 
              value={match.keyword_coverage} 
              color="bg-blue-500"
            />
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base">Experience Match</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className={`text-2xl font-bold ${
              match.experience_match === "Exceeds" ? "text-green-500" :
              match.experience_match === "Meets" ? "text-blue-500" : "text-yellow-500"
            }`}>
              {match.experience_match}
            </div>
            <p className="text-sm text-muted-foreground mt-1">requirements</p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Skills Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkillChips matched={match.matched_skills} missing={match.missing_skills} />
        </CardContent>
      </Card>

      {/* Strengths & Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {match.strengths.map((s, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-green-500 mt-1">✓</span>
                  {s}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500" /> Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {match.gaps.map((g, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="text-yellow-500 mt-1">!</span>
                  {g}
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
