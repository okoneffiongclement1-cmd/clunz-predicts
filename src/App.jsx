import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/predictions')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to connect to the CLUNZ engine backend.');
        }
        return res.json();
      })
      .then((data) => {
        setPredictions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Frontend Fetch Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CLUNZ PREDICTS</h1>
        <p className="subtitle">DAILY ANALYSIS ENGINE</p>
        <div className="status-badge">
          <span className="pulse-dot"></span> SYSTEM ACTIVE
        </div>
      </header>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Processing Archival Metrics & Win Probabilities...</p>
        </div>
      )}

      {error && (
        <div className="error-card">
          <h3>Connection Error Detected</h3>
          <p>{error}</p>
          <small>Make sure Terminal 1 is active with <code>node server.js</code></small>
        </div>
      )}

      {!loading && !error && (
        <main className="dashboard-grid">
          {predictions.map((item, index) => {
            const isHighConfidence = item.analysis.confidence === 'HIGH';
            
            return (
              <div key={index} className="prediction-card">
                <div className="card-header">
                  <span className={`confidence-tag ${isHighConfidence ? 'high' : 'medium'}`}>
                    {item.analysis.confidence} CONVICTION
                  </span>
                  <span className="live-status-tag">
                    {item.time === 'Finished' ? '● ANALYSIS COMPLETE' : item.time}
                  </span>
                </div>

                <h2 className="match-title">{item.match}</h2>
                
                <hr className="divider" />

                <div className="analysis-body">
                  <p className="label">Highest Probability Outcome:</p>
                  <p className="winner-pick">{item.analysis.winner}</p>
                  
                  <div className="probability-container">
                    <div className="probability-bar-bg">
                      <div 
                        className="probability-bar-fill" 
                        style={{ width: item.analysis.probability }}
                      ></div>
                    </div>
                    <span className="probability-text">{item.analysis.probability}</span>
                  </div>

                  {item.analysis.reasoning && (
                    <p className="reasoning-text">
                      <strong>Core Factor:</strong> {item.analysis.reasoning}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </main>
      )}

      <footer className="app-footer">
        <p>&copy; 2026 CLUNZ PREDICTS • Optimized Historical Simulator Module</p>
      </footer>
    </div>
  );
}

export default App;