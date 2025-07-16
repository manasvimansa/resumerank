import React, { useState } from 'react';
import './App.css';
import { uploadMultiple } from './api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

function App() {
  const [jobDesc, setJobDesc] = useState('');
  const [resumes, setResumes] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDesc || resumes.length === 0) return;
    setLoading(true);

    try {
      const rankedResumes = await uploadMultiple(jobDesc, Array.from(resumes));
      setResults(rankedResumes.sort((a, b) => b.skill_score - a.skill_score));
    } catch (err) {
      console.error(err);
      alert("Error uploading resumes.");
    } finally {
      setLoading(false);
    }
  };

  const getRankClass = (index) => {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "bronze";
    return "";
  };

  const cleanFilename = (filename) => {
    return filename.replace(/\.pdf$/i, '');
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

        {/* RANKED RESUMES */}
        {results.length > 0 && (
          <div className="results">
            <h2>Ranked Resumes</h2>
            <ul className="ranked-list">
              {results.map((res, index) => (
                <li key={index} className={`rank-item ${getRankClass(index)}`}>
                  <span className="rank-number">{index + 1}.</span>
                  <strong>{cleanFilename(res.filename)}</strong> - {(res.skill_score * 100).toFixed(0)}%
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CHART */}
        {results.length > 0 && (
          <div className="chart-container" style={{ width: "90%", maxWidth: "800px", margin: "0 auto" }}>
            <h2>Skill Score Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={(entry) => cleanFilename(entry.filename)}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="skill_score" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* CARDS */}
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
