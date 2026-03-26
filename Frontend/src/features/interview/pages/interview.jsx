import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../style/interview.scss";

const Interview = () => {
  const { interviewId } = useParams();
  const [activeTab, setActiveTab] = useState("technical");

  // Sample data structure (will be replaced with props/API call in hooks layer)
  // TODO: This will be replaced with actual API call in hooks layer
  const interviewData = {
    matchScore: 75,
    technicalQuestions: [
      {
        question:
          "Can you explain how you handled user authentication in your Spotify Backend Application, specifically regarding JWT and cookie handling?",
        intention:
          "To assess the candidate's understanding of secure authentication mechanisms and their practical implementation.",
        answer:
          "In the Spotify Backend Application, I implemented JWT (JSON Web Tokens) for user authentication. When a user logs in, a JWT is generated on the server, containing claims like the user ID. This token is then sent back to the client, typically stored in an HTTP-only cookie to prevent XSS attacks.",
      },
      {
        question:
          "Regarding the FOREVER E-commerce Website, how did you ensure component reusability and optimize performance?",
        intention:
          "To gauge the candidate's understanding of React best practices, component architecture, and performance considerations.",
        answer:
          "For component reusability, I broke down the UI into smaller, self-contained components like ProductCard, Button, Navbar, and Footer.",
      },
    ],
    behavioralQuestions: [
      {
        question:
          "Tell me about a time you faced a significant technical challenge in one of your projects.",
        intention:
          "To assess problem-solving skills, resilience, and learning from difficulties.",
        answer:
          "In the Spotify Backend project, a significant challenge was implementing secure JWT-based authentication with refresh tokens.",
      },
      {
        question:
          "As a student pursuing graduation, how do you manage your time to balance your studies and personal project development?",
        intention:
          "To understand time management, prioritization skills, and dedication to personal development.",
        answer:
          "I am very passionate about full-stack development, so I try to treat my personal projects as an extension of my learning.",
      },
    ],
    roadMap: [
      {
        phase: "Phase 1: Foundation",
        description: "Build core full-stack basics",
        tasks: [
          "Master React fundamentals",
          "Learn Node.js basics",
          "Setup MongoDB",
        ],
        duration: "2 weeks",
      },
      {
        phase: "Phase 2: Integration",
        description: "Integrate all technologies",
        tasks: [
          "Build REST APIs",
          "Connect frontend to backend",
          "Database operations",
        ],
        duration: "3 weeks",
      },
      {
        phase: "Phase 3: Authentication",
        description: "Implement secure auth",
        tasks: ["JWT implementation", "Password hashing", "Session management"],
        duration: "2 weeks",
      },
    ],
    skillGaps: [
      {
        skill: "Testing (Unit, Integration)",
        severity: "medium",
      },
      {
        skill: "Advanced Database Concepts",
        severity: "low",
      },
      {
        skill: "DevOps/Deployment",
        severity: "medium",
      },
      {
        skill: "TypeScript",
        severity: "medium",
      },
      {
        skill: "Frontend performance optimization",
        severity: "low",
      },
    ],
  };

  const getSeverityClass = (severity) => {
    return `severity-${severity}`;
  };

  const renderMainContent = () => {
    if (activeTab === "technical") {
      return (
        <div className="content-section">
          <h2 className="content-title">
            <span className="content-icon">❓</span>
            Technical Questions
          </h2>
          <div className="questions-list">
            {interviewData.technicalQuestions.map((q, index) => (
              <div key={index} className="question-card">
                <div className="question-header">
                  <span className="question-num">Q{index + 1}</span>
                  <h3 className="question-text">{q.question}</h3>
                </div>
                <div className="question-body">
                  <div className="detail-block">
                    <label className="detail-label">Intention:</label>
                    <p className="detail-text">{q.intention}</p>
                  </div>
                  <div className="detail-block">
                    <label className="detail-label">Your Answer:</label>
                    <p className="detail-text">{q.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (activeTab === "behavioral") {
      return (
        <div className="content-section">
          <h2 className="content-title">
            <span className="content-icon">💬</span>
            Behavioral Questions
          </h2>
          <div className="questions-list">
            {interviewData.behavioralQuestions.map((q, index) => (
              <div key={index} className="question-card">
                <div className="question-header">
                  <span className="question-num">Q{index + 1}</span>
                  <h3 className="question-text">{q.question}</h3>
                </div>
                <div className="question-body">
                  <div className="detail-block">
                    <label className="detail-label">Intention:</label>
                    <p className="detail-text">{q.intention}</p>
                  </div>
                  <div className="detail-block">
                    <label className="detail-label">Your Answer:</label>
                    <p className="detail-text">{q.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (activeTab === "roadmap") {
      return (
        <div className="content-section">
          <h2 className="content-title">
            <span className="content-icon">🗺️</span>
            Road Map
          </h2>
          <div className="roadmap-list">
            {interviewData.roadMap.map((phase, index) => (
              <div key={index} className="roadmap-card">
                <div className="roadmap-header">
                  <h3 className="roadmap-phase">{phase.phase}</h3>
                  <span className="roadmap-duration">{phase.duration}</span>
                </div>
                <p className="roadmap-description">{phase.description}</p>
                <div className="roadmap-tasks">
                  <label className="tasks-label">Tasks:</label>
                  <ul className="tasks-list">
                    {phase.tasks.map((task, taskIdx) => (
                      <li key={taskIdx} className="task-item">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="interview-container">
      {/* Left Sidebar - Navigation */}
      <aside className="left-sidebar">
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-title">Interview Plan</h3>

            <div className="nav-items">
              <button
                className={`nav-item ${
                  activeTab === "technical" ? "active" : ""
                }`}
                onClick={() => setActiveTab("technical")}
              >
                <span className="nav-icon">❓</span>
                <span className="nav-label">Technical Questions</span>
                <span className="nav-count">
                  {interviewData.technicalQuestions.length}
                </span>
              </button>

              <button
                className={`nav-item ${
                  activeTab === "behavioral" ? "active" : ""
                }`}
                onClick={() => setActiveTab("behavioral")}
              >
                <span className="nav-icon">💬</span>
                <span className="nav-label">Behavioral Questions</span>
                <span className="nav-count">
                  {interviewData.behavioralQuestions.length}
                </span>
              </button>

              <button
                className={`nav-item ${
                  activeTab === "roadmap" ? "active" : ""
                }`}
                onClick={() => setActiveTab("roadmap")}
              >
                <span className="nav-icon">🗺️</span>
                <span className="nav-label">Road Map</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Match Score Header */}
        <div className="content-header">
          <div className="match-score-card">
            <div className="match-score-label">Match Score</div>
            <div className="match-score-value">{interviewData.matchScore}%</div>
            <div className="match-score-bar">
              <div
                className="match-score-fill"
                style={{ width: `${interviewData.matchScore}%` }}
              ></div>
            </div>
            <p className="match-score-text">Strong Match</p>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderMainContent()}
      </main>

      {/* Right Sidebar - Skill Gaps */}
      <aside className="right-sidebar">
        <div className="skill-gaps-section">
          <h3 className="sidebar-title">
            <span className="sidebar-icon">⚠️</span>
            Skill Gaps
          </h3>

          <div className="skill-gaps-list">
            {interviewData.skillGaps.map((gap, index) => (
              <div
                key={index}
                className={`skill-gap-badge ${getSeverityClass(gap.severity)}`}
              >
                <div className="skill-gap-name">{gap.skill}</div>
                <div className="skill-gap-severity">{gap.severity}</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Interview;
