import React, { useState } from "react";
import { uploadMultiple } from "./api";

function UploadForm() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("job_description", jobDesc);
    Array.from(resumes).forEach(file => formData.append("resumes", file));

    try {
        const response = await axios.post("http://localhost:5000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        console.log(response.data);
        setResults(response.data.ranked_resumes);  // Adjust based on backend response
    } catch (err) {
        console.error(err);
        alert("Error uploading resumes.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="upload-section">
      <form onSubmit={handleSubmit} className="form-container">
        <textarea
          placeholder="Enter job description..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows="4"
          required
        ></textarea>

        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={(e) => setResumes(e.target.files)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ranking..." : "Rank Resumes"}
        </button>
      </form>

      {results.length > 0 && (
        <div className="results">
          <h3>Ranked Resumes</h3>
          <ul>
            {results.map((res, index) => (
              <li key={index}>
                <strong>{res.filename}</strong> - {res.skill_score * 100}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
