import React from "react";
import "../style/home.scss";

const Home = () => {
  return (
    <main className="home">
      <div className="container">
        {/* Header Section */}
        <div className="header-section">
          <h1 className="main-title">
            Create Your Custom{" "}
            <span className="highlight-text">Interview Plan</span>
          </h1>
          <p className="subtitle">
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </div>

        {/* Input Section */}
        <div className="interview-input-group">
          {/* Left Panel - Job Description */}
          <div className="left-section">
            <div className="section-header">
              <span className="icon">📌</span>
              <h2>Target Job Description</h2>
              <span className="required-badge">Required</span>
            </div>
            <textarea
              name="jobDescription"
              id="jobDescription"
              placeholder='Paste the full job description here... e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript and large-scale system design."'
              className="job-textarea"
            ></textarea>
            <div className="char-count">0 / 5000 chars</div>
          </div>

          {/* Right Panel - User Profile */}
          <div className="right-section">
            {/* Resume Section */}
            <div className="input-group resume-group">
              <div className="group-header">
                <span className="icon">👤</span>
                <h3>Your Profile</h3>
              </div>

              <div className="upload-section">
                <label className="file-upload-label" htmlFor="resume">
                  <div className="upload-icon">📄</div>
                  <p className="upload-text">
                    <span className="upload-title">Upload Resume</span>
                    <span className="upload-subtitle">required</span>
                  </p>
                </label>
                <input
                  hidden
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                />

                <div className="or-divider">OR</div>

                <p className="info-note">
                  <span className="info-icon">ℹ️</span>
                  <small>
                    Use Resume and self description together for best results
                  </small>
                </p>
              </div>
            </div>

            {/* Self Description Section */}
            <div className="input-group">
              <label htmlFor="selfDescription" className="input-label">
                <span className="icon">✍️</span>
                Quick Self-Description
              </label>
              <textarea
                name="selfDescription"
                id="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience. If you don't have a resume handy..."
                className="self-description-textarea"
              ></textarea>
            </div>

            {/* Checkbox Section */}
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="requirementCheck"
                name="requirementCheck"
              />
              <label htmlFor="requirementCheck" className="checkbox-label">
                Either a Resume or a <strong>Self Description</strong> is
                required to generate a personalized plan.
              </label>
            </div>

            {/* Generate Button */}
            <button className="generate-btn">
              <span className="btn-icon">✨</span>
              Generate My Interview Strategy
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="footer-note">
          AI-Powered Strategy. Generation • Approx 30s
        </p>
      </div>
    </main>
  );
};

export default Home;
