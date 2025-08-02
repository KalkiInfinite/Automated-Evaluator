import React from "react"
import { Link } from "react-router-dom"
import "./ExamChecker.css"

const Contact = () => {
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
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link active">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <div className="card">
        <div className="card-header">
          <h2>Contact Us</h2>
          <p className="subtitle">Get in touch with our team for support or inquiries</p>
        </div>

        <div className="card-body">
          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">👤</span> Your Name:
            </label>
            <input type="text" className="text-input" placeholder="Enter your name" />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">✉️</span> Email Address:
            </label>
            <input type="email" className="text-input" placeholder="Enter your email" />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span className="label-icon">📝</span> Message:
            </label>
            <textarea className="textarea" rows="5" placeholder="Type your message here..."></textarea>
          </div>

          <div className="button-group">
            <button className="check-btn">
              <span className="btn-icon">📤</span> Send Message
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Other Ways to Reach Us</h2>
        </div>

        <div className="card-body">
          <div className="contact-info">
            <div className="contact-item">
              <h3><span className="label-icon">📧</span> Email</h3>
              <p>support@examchecker.com</p>
            </div>
            
            <div className="contact-item">
              <h3><span className="label-icon">📞</span> Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            
            <div className="contact-item">
              <h3><span className="label-icon">🏢</span> Office</h3>
              <p>123 Education Lane<br />Learning City, ED 54321</p>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  )
}

export default Contact