import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../../auth/hooks/useInterview.js";
import { useAuth } from "../../auth/hooks/useAuth.js";
import { useNavigate } from "react-router";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const { user, handleLogout, loading: authLoading } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState();
  const resumeInputRef = useRef();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    const success = await handleLogout();
    if (success) {
      navigate("/login");
    }
  };

  const handleGenerateReport = async () => {
    try {
      const resumeFile = resumeInputRef.current.files[0];

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      // 🚨 IMPORTANT CHECK
      if (!data || !data._id) {
        console.error("Invalid response from backend:", data);
        alert("Something went wrong. Please try again.");
        return;
      }

      navigate(`/interview/${data._id}`);
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Server error. Check backend.");
    }
  };
  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
      </main>
    );
  }

  return (
    <main className="home">
      {/* Header with Logout Button */}
      <header className="home-header">
        <div className="header-content">
          <h2 className="app-logo">🎯 Resume Analyzer</h2>
          <div className="header-actions">
            {user && (
              <>
                <span className="user-info">Welcome, {user.username}!</span>
                <button
                  onClick={handleLogoutClick}
                  disabled={authLoading}
                  className="logout-btn"
                >
                  {authLoading ? "Logging out..." : "Logout"}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

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
              onChange={(e) => setJobDescription(e.target.value)}
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
                  ref={resumeInputRef}
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
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
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
            <button onClick={handleGenerateReport} className="generate-btn">
              <span className="btn-icon">✨</span>
              Generate My Interview Strategy
            </button>
          </div>
        </div>

        {reports.length > 0 && (
          <section className="recent-reports">
            <h2 className="section-title">Your Recent Interview Plans</h2>
            <div className="reports-list">
              {reports.slice(0, 3).map((report) => (
                <div
                  onClick={() => navigate(`/interview/${report._id}`)}
                  key={report._id}
                  className="report-card"
                >
                  <h3 className="report-title">{report.title}</h3>
                  <p className="report-date">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="match-score">
                    Match Score: {report.matchScore}%
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Note */}
        <p className="footer-note">
          AI-Powered Strategy. Generation • Approx 30s
        </p>
      </div>
    </main>
  );
};

export default Home;
