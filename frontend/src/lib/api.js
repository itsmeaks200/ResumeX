const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function parseResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/resume/parse`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to parse resume");
  }

  return response.json();
}

export async function analyzeJD(jdText) {
  const response = await fetch(`${API_URL}/api/jd/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd_text: jdText }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to analyze JD");
  }

  return response.json();
}

export async function matchResumeJD(resume, jd) {
  const response = await fetch(`${API_URL}/api/match`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jd }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to match resume");
  }

  return response.json();
}

export async function getImprovements(resume, jd, match) {
  const response = await fetch(`${API_URL}/api/improve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resume, jd, match }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to get improvements");
  }

  return response.json();
}

export async function fullAnalysis(file, jdText) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("jd_text", jdText);

  const response = await fetch(`${API_URL}/api/analyze/full`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Analysis failed");
  }

  return response.json();
}

export async function searchJobs(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/jobs/search`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Job search failed");
  }

  return response.json();
}

export async function searchJobsFromParsed(resume) {
  const response = await fetch(`${API_URL}/api/jobs/search-from-parsed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Job search failed");
  }

  return response.json();
}
