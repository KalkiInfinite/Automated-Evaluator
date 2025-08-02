import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    howItWorks: false,
    stats: false,
    cta: false
  });

  useEffect(() => {
    // Trigger animations on component mount
    setIsVisible({
      hero: true,
      features: false,
      howItWorks: false,
      stats: false,
      cta: false
    });

    // Set up scroll event listener for section animations
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      
      // Get positions of different sections
      const featuresSection = document.getElementById("features");
      const howItWorksSection = document.getElementById("how-it-works");
      const statsSection = document.getElementById("stats");
      const ctaSection = document.getElementById("cta");
      
      if (featuresSection && scrollPosition > featuresSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, features: true }));
      }
      
      if (howItWorksSection && scrollPosition > howItWorksSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, howItWorks: true }));
      }
      
      if (statsSection && scrollPosition > statsSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, stats: true }));
      }
      
      if (ctaSection && scrollPosition > ctaSection.offsetTop + 100) {
        setIsVisible(prev => ({ ...prev, cta: true }));
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    // Trigger initial scroll check
    handleScroll();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleGetStarted = () => {
    navigate("/examchecker"); // Navigate to the ExamChecker page
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">✓</span> Exam Checker
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#cta">Get Started</a>
            <button className="login-btn">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`hero-section ${isVisible.hero ? "visible" : ""}`}>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">AI-Powered</span> Exam Evaluation
          </h1>
          <p className="hero-subtitle">
            Grade exams faster and more accurately with our intelligent evaluation system
          </p>
          <div className="hero-buttons">
            <button className="primary-btn" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="secondary-btn">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-element document-1">
            <div className="document-icon">📝</div>
            <div className="document-lines">
              <div className="doc-line"></div>
              <div className="doc-line"></div>
              <div className="doc-line"></div>
            </div>
          </div>
          <div className="floating-element document-2">
            <div className="document-icon">📊</div>
            <div className="document-lines">
              <div className="doc-line"></div>
              <div className="doc-line"></div>
              <div className="doc-line"></div>
            </div>
          </div>
          <div className="floating-element checkmark">✓</div>
          <div className="circle-bg"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`features-section ${isVisible.features ? "visible" : ""}`}>
        <h2 className="section-title">Why Choose Exam Checker?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Evaluation</h3>
            <p>Process hundreds of exams in minutes instead of hours</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3>AI-Powered Analysis</h3>
            <p>Intelligent semantic understanding of student answers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Detailed Reports</h3>
            <p>Get comprehensive insights on student performance</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Multiple Formats</h3>
            <p>Support for PDF uploads and manual text entry</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Keyword Detection</h3>
            <p>Automatically identify key concepts in answers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Grade exams from any device, anywhere</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={`how-it-works-section ${isVisible.howItWorks ? "visible" : ""}`}>
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Upload Exams</h3>
              <p>Upload student answer PDFs and ideal answer key</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>AI Analysis</h3>
              <p>Our AI evaluates answers for keywords, grammar, and semantic understanding</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Review Results</h3>
              <p>Get detailed scores and insights for each student answer</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Export & Share</h3>
              <p>Download reports or share results with students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className={`stats-section ${isVisible.stats ? "visible" : ""}`}>
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number count-up">85%</div>
            <div className="stat-label">Time Saved</div>
          </div>
          <div className="stat-card">
            <div className="stat-number count-up">10,000+</div>
            <div className="stat-label">Exams Processed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number count-up">98%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-number count-up">500+</div>
            <div className="stat-label">Happy Educators</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className={`cta-section ${isVisible.cta ? "visible" : ""}`}>
        <div className="cta-content">
          <h2>Ready to Transform Your Grading Process?</h2>
          <p>Join hundreds of educators who are saving time and improving accuracy with Exam Checker</p>
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">✓</span> Exam Checker
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Testimonials</a>
              <a href="#">FAQ</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 Exam Checker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
