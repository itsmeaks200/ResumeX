"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertCircle, AlertTriangle, Info } from "lucide-react";

interface Improvement {
  section: string;
  original: string;
  suggested: string;
  reason: string;
  severity: "low" | "medium" | "high";
  keywords_added: string[];
}

interface ImprovementCardProps {
  improvement: Improvement;
  index: number;
}

export function ImprovementCard({ improvement, index }: ImprovementCardProps) {
  const severityConfig = {
    high: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
    medium: { icon: AlertTriangle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    low: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  };

  const config = severityConfig[improvement.severity];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={config.bg}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Icon className={`w-4 h-4 ${config.color}`} />
              {improvement.section}
            </CardTitle>
            <Badge variant={improvement.severity === "high" ? "destructive" : improvement.severity === "medium" ? "warning" : "secondary"}>
              {improvement.severity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-start">
            <div className="p-2 bg-muted rounded text-sm">
              <p className="text-muted-foreground text-xs mb-1">Original</p>
              {improvement.original}
            </div>
            <ArrowRight className="w-4 h-4 mt-6 text-muted-foreground" />
            <div className="p-2 bg-primary/10 rounded text-sm">
              <p className="text-primary text-xs mb-1">Suggested</p>
              {improvement.suggested}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{improvement.reason}</p>
          {improvement.keywords_added.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {improvement.keywords_added.map((kw) => (
                <Badge key={kw} variant="outline" className="text-xs">
                  +{kw}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
