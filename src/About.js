import React from "react"
import { Link } from "react-router-dom"
import "./ExamChecker.css"

const About = () => {
  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">
            <span className="logo-icon">✓</span> Exam Checker
          </h1>
          <div className="nav-links">
            <Link to="/examchecker" className="nav-link">
              Home
            </Link>
            <Link to="/about" className="nav-link active">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div className="card">
        <div className="card-header">
          <h2>About Exam Checker</h2>
          <p className="subtitle">Revolutionizing the way educators grade exams</p>
        </div>

        <div className="card-body">
          <div className="about-section">
            <h3>Our Mission</h3>
            <p>
              At Exam Checker, we're dedicated to transforming the educational assessment process through 
              cutting-edge AI technology. Our mission is to empower educators with tools that save time, 
              provide consistent grading, and deliver valuable insights into student performance.
            </p>
            
            <h3>How It Works</h3>
            <p>
              Our platform uses advanced natural language processing and machine learning algorithms to 
              analyze student responses against model answers. By evaluating keyword usage, semantic 
              understanding, and grammatical accuracy, we provide comprehensive scoring that closely 
              mirrors human grading—but in a fraction of the time.
            </p>
            
            <h3>Key Features</h3>
            <ul className="feature-list">
              <li>
                <strong>PDF Processing:</strong> Upload student answer PDFs and model answer PDFs for 
                batch processing.
              </li>
              <li>
                <strong>OCR Technology:</strong> Convert handwritten answers to text for evaluation.
              </li>
              <li>
                <strong>Manual Input:</strong> Enter individual student answers for quick assessment.
              </li>
              <li>
                <strong>Keyword Analysis:</strong> Ensure critical concepts are covered in responses.
              </li>
              <li>
                <strong>Semantic Evaluation:</strong> Assess understanding beyond simple keyword matching.
              </li>
              <li>
                <strong>Grammar Checking:</strong> Evaluate the technical quality of written responses.
              </li>
            </ul>
            
            <h3>Our Team</h3>
            <p>
              Exam Checker was developed by a team of educators, AI specialists, and software engineers 
              who understand the challenges of modern education. We're constantly improving our algorithms 
              based on feedback from teachers and educational institutions around the world.
            </p>
          </div>
        </div>
      </div>

     
    </div>
  )
}

export default About