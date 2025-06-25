import React from 'react';
import './App.css';

function App() {
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

        <div className="cta-container">
          <input type="text" placeholder="Enter job description..." />
          <button>Start Ranking</button>
        </div>

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
