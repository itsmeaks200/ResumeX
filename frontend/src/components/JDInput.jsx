"use client";

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileSearch, Loader2 } from "lucide-react";

export function JDInput({ value, onChange, onAnalyze, isLoading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="w-5 h-5" />
            Job Description
          </CardTitle>
          <CardDescription>
            Paste the job description to analyze how well your resume matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste the full job description here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            disabled={isLoading}
          />
          <Button 
            onClick={onAnalyze} 
            disabled={!value.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Match"
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
