"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function SkillChips({ matched, missing }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          Matched Skills ({matched.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {matched.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Badge variant="success">{skill}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <X className="w-4 h-4 text-red-500" />
          Missing Skills ({missing.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {missing.map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Badge variant="destructive">{skill}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
