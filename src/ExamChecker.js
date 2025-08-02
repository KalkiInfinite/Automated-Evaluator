"use client"

import { useState } from "react"
import "./ExamChecker.css"


const ExamChecker = () => {
  const [mode, setMode] = useState("pdf")
  const [pdfFile, setPdfFile] = useState(null)
  const [idealFile, setIdealFile] = useState(null)
  const [isHandwritten, setIsHandwritten] = useState(false)
  const [answers, setAnswers] = useState([""])
  const [keywords, setKeywords] = useState("")
  const [modelAnswer, setModelAnswer] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleEvaluate = async () => {
    try {
      setIsLoading(true)

      if (mode === "pdf") {
        if (!pdfFile || !idealFile) {
          alert("Please upload both the student and ideal answer PDFs.")
          setIsLoading(false)
          return
        }

        const formData = new FormData()
        formData.append("pdf", pdfFile)
        formData.append("ideal_pdf", idealFile)
        formData.append("handwritten", isHandwritten)

        const response = await fetch("http://localhost:5000/evaluate-pdf", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()
        setResults(data.results)
      } else {
        const response = await fetch("http://localhost:5000/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            keywords: keywords.split(",").map((k) => k.trim().toLowerCase()),
            modelAnswer,
          }),
        })

        const data = await response.json()
        setResults(data.results)
      }
      setIsLoading(false)
    } catch (err) {
      console.error("Evaluation error:", err)
      alert("An error occurred while evaluating the answers.")
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPdfFile(null)
    setIdealFile(null)
    setAnswers([""])
    setKeywords("")
    setModelAnswer("")
    setResults([])
    setIsHandwritten(false)
  }

  const getFileName = (file) => {
    return file ? file.name : "No file chosen"
  }

  return (
    <div className="container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">
            <span className="logo-icon">✓</span> Exam Checker
          </h1>
          <div className="nav-links">
            <a href="/examchecker" className="nav-link active">
              Home
            </a>
            <a href="/about" className="nav-link">
              About
            </a>
            <a href="/contact" className="nav-link">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <div className="card">
        <div className="card-header">
          <h2>Automated Exam Evaluation</h2>
          <p className="subtitle">AI-powered analysis for accurate and efficient grading</p>
        </div>

        <div className="tabs">
          <button className={`tab-btn ${mode === "pdf" ? "active" : ""}`} onClick={() => setMode("pdf")}>
            PDF Upload
          </button>
          <button className={`tab-btn ${mode === "manual" ? "active" : ""}`} onClick={() => setMode("manual")}>
            Manual Input
          </button>
        </div>

        <div className="card-body">
          {mode === "pdf" ? (
            <>
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📄</span> Upload Student Answers PDF:
                </label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="student-pdf"
                    className="file-input"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                  />
                  <label htmlFor="student-pdf" className="file-label">
                    <span className="file-icon">📎</span> Choose File
                  </label>
                  <span className="file-name">{getFileName(pdfFile)}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">📄</span> Upload Ideal Answers PDF:
                </label>
                <div className="file-input-container">
                  <input
                    type="file"
                    id="ideal-pdf"
                    className="file-input"
                    accept="application/pdf"
                    onChange={(e) => setIdealFile(e.target.files[0])}
                  />
                  <label htmlFor="ideal-pdf" className="file-label">
                    <span className="file-icon">📎</span> Choose File
                  </label>
                  <span className="file-name">{getFileName(idealFile)}</span>
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input type="checkbox" checked={isHandwritten} onChange={() => setIsHandwritten(!isHandwritten)} />
                  <span className="checkmark"></span>
                  This is a handwritten student answer PDF (use OCR)
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon"></span> Model Answer:
                </label>
                <textarea
                  className="textarea"
                  rows="3"
                  placeholder="Enter the model answer here..."
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon"></span> Keywords:
                </label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="Enter keywords separated by commas"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
                <small className="input-hint">Important terms that should appear in correct answers</small>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon"></span> Student Answers:
                </label>
                {answers.map((ans, idx) => (
                  <div key={idx} className="student-answer">
                    <div className="answer-header">
                      <span className="answer-number">Student Answer {idx + 1}</span>
                    </div>
                    <textarea
                      className="textarea"
                      rows="3"
                      placeholder="Type or paste student answer here..."
                      value={ans}
                      onChange={(e) => {
                        const newAns = [...answers]
                        newAns[idx] = e.target.value
                        setAnswers(newAns)
                      }}
                    />
                  </div>
                ))}
                <button className="add-btn" onClick={() => setAnswers([...answers, ""])}>
                  <span className="btn-icon">+</span> Add Another Answer
                </button>
              </div>
            </>
          )}

          <div className="button-group">
            <button className={`check-btn ${isLoading ? "loading" : ""}`} onClick={handleEvaluate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="btn-icon">✓</span> Check Answers
                </>
              )}
            </button>
            <button className="reset-btn" onClick={handleReset}>
              <span className="btn-icon">↺</span> Reset
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="results">
            <h3 className="results-title">
              <span className="results-icon">📊</span> Evaluation Results
            </h3>
            <div className="results-list">
              {results.map((res, idx) => (
                <div key={idx} className="result-item">
                  <div className="result-header">
                    <strong>{res.question || `Student ${idx + 1}`}</strong>
                    <span
                      className={`score-badge ${res.finalScore >= 7 ? "high" : res.finalScore >= 5 ? "medium" : "low"}`}
                    >
                      {res.finalScore} / 10
                    </span>
                  </div>
                  <div className="score-details">
                    <div className="score-metric">
                      <span className="metric-label">Keywords:</span>
                      <div className="progress-bar">
                        <div className="progress-fill keywords" style={{ width: `${res.keywordScore * 10}%` }}></div>
                      </div>
                      <span className="metric-value">{res.keywordScore}</span>
                    </div>
                    <div className="score-metric">
                      <span className="metric-label">Grammar:</span>
                      <div className="progress-bar">
                        <div className="progress-fill grammar" style={{ width: `${res.grammarScore * 10}%` }}></div>
                      </div>
                      <span className="metric-value">{res.grammarScore}</span>
                    </div>
                    <div className="score-metric">
                      <span className="metric-label">Semantic:</span>
                      <div className="progress-bar">
                        <div className="progress-fill semantic" style={{ width: `${res.semanticScore * 10}%` }}></div>
                      </div>
                      <span className="metric-value">{res.semanticScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
     
    </div>
  )
}

export default ExamChecker
