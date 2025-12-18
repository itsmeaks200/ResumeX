"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Linkedin, GraduationCap, Briefcase, Code, Award } from "lucide-react";

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

interface ResumePreviewProps {
  data: ResumeData;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{data.name}</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {data.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" /> {data.email}
              </span>
            )}
            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {data.phone}
              </span>
            )}
            {data.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {data.location}
              </span>
            )}
            {data.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" /> LinkedIn
              </span>
            )}
          </div>
        </CardHeader>
        {data.summary && (
          <CardContent>
            <p className="text-sm">{data.summary}</p>
          </CardContent>
        )}
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Code className="w-4 h-4" /> Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {data.skills.languages.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Languages</p>
              <div className="flex flex-wrap gap-1">
                {data.skills.languages.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {data.skills.frameworks.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Frameworks</p>
              <div className="flex flex-wrap gap-1">
                {data.skills.frameworks.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
          )}
          {data.skills.tools.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tools</p>
              <div className="flex flex-wrap gap-1">
                {data.skills.tools.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience */}
      {data.experience.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-primary/20 pl-4">
                <h4 className="font-medium">{exp.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {exp.company} • {exp.start_date} - {exp.end_date}
                </p>
                {exp.bullets && (
                  <ul className="mt-2 text-sm space-y-1">
                    {exp.bullets.map((b: string, j: number) => (
                      <li key={j} className="text-muted-foreground">• {b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {data.education.map((edu, i) => (
              <div key={i}>
                <h4 className="font-medium">{edu.degree} in {edu.field}</h4>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} • {edu.end_date}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {data.certifications.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-4 h-4" /> Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.certifications.map((cert, i) => (
                <Badge key={i} variant="outline">{cert}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
