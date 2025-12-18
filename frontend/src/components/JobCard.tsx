"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, ExternalLink, DollarSign } from "lucide-react";

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

interface JobCardProps {
  job: JobPosting;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getMatchColor(job.match_score)}`} />
              <span className="text-sm font-medium">{job.match_score.toFixed(0)}% match</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {job.salary && (
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="w-3 h-3" />
              {job.salary}
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{job.source}</Badge>
            <Button size="sm" asChild>
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                Apply <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
