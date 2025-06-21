// frontend/src/UploadForm.js
import React, { useState } from "react";
import { uploadMultiple } from "../../frontend/src/api";

function UploadForm() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription || resumes.length === 0) {
      alert("Please provide a job description and at least one resume.");
      return;
    }

    setLoading(true);
    const response = await uploadMultiple(jobDescription, Array.from(resumes));
    const sorted = response.sort((a, b) => b.skill_score - a.skill_score);
    setResults(sorted);
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Job Description:</label><br />
        <textarea
          rows="6"
          cols="60"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        /><br /><br />

        <label>Select Resume PDFs:</label><br />
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={(e) => setResumes(e.target.files)}
        /><br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Ranking..." : "Upload and Rank"}
        </button>
      </form>

      {results.length > 0 && (
        <div>
          <h2>Ranked Resumes</h2>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Filename</th>
                <th>Skill Score</th>
                <th>Matched Skills</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{res.filename}</td>
                  <td>{res.skill_score}</td>
                  <td>{res.matched_skills.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
