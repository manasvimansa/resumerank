import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jobDesc, setJobDesc] = useState('');
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDesc || resumes.length === 0) return;
    setLoading(true);

    const uploadPromises = Array.from(resumes).map(async (file) => {
      const formData = new FormData();
      formData.append('job_description', jobDesc);
      formData.append('resume', file);

      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return { filename: file.name, ...res.data };
    });

    const ranked = await Promise.all(uploadPromises);
    setResults(ranked.sort((a, b) => b.skill_score - a.skill_score));
    setLoading(false);
  };

  return (
    <div className="hero-container">
      <header className="navbar">
        <div className="logo">ResumeRank</div>
        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main className="hero-content">
        <h1>Resume Screening & Ranking Tool</h1>
        <p>Quickly analyze, screen, and rank resumes based on job-fit using AI-driven techniques.</p>

        <form className="cta-container" onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter job description..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows="3"
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
            {loading ? 'Ranking...' : 'Start Ranking'}
          </button>
        </form>

        {results.length > 0 && (
          <div className="results">
            <h2>Ranked Resumes</h2>
            <ul>
              {results.map((res, index) => (
                <li key={index}>
                  <strong>{res.filename}</strong> - {res.skill_score * 100}%
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="image-grid">
          <div className="card">
            <img src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="AI Icon" />
            <p>AI-Powered Screening</p>
          </div>
          <div className="card">
            <img src="https://cdn-icons-png.flaticon.com/512/3126/3126608.png" alt="Ranking Icon" />
            <p>Rank Top Candidates</p>
          </div>
          <div className="card">
            <img src="https://cdn-icons-png.flaticon.com/512/2659/2659360.png" alt="Efficiency Icon" />
            <p>Save Time & Effort</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
