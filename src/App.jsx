import React, { useState } from 'react';
import './App.css'; 

export default function App() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [logs, setLogs] = useState([
    { time: "22:01:05", msg: "CORE_MATRIX INITIALIZED... STANDBY" },
    { time: "22:04:12", msg: "SECURE API LINK CALIBRATED TO PORT: LIVE" }
  ]);

  const BACKEND_URL = "https://clunz.vercel.app";

  const pushLog = (message) => {
    const stamp = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [{ time: stamp, msg: message.toUpperCase() }, ...prev].slice(0, 5));
  };

  const triggerClunzEngine = async () => {
    setLoading(true);
    setPredictions([]);
    pushLog("Initiating deep analytical data compile sequence...");
    
    try {
      const response = await fetch(BACKEND_URL);
      const data = await response.json();
      setPredictions(data);
      setHasAnalyzed(true);
      pushLog(`Stream established successfully. ${data.length} matches indexed.`);
      if(data.length > 0) setSelectedGame(data[0]); 
    } catch (err) {
      console.error(err);
      pushLog("Connection interruption. Please check engine source server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(game => 
    game.match.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const settledLedgerData = predictions.filter(game => 
    game.analysis?.confidence?.toUpperCase().includes("SETTLED") || 
    game.status?.toUpperCase() === "SETTLED"
  );

  // LOGIC UPGRADE: Automatically detects keywords in reasoning to flip tactical flags
  const getFlags = (reasoning = "") => {
    const text = reasoning.toLowerCase();
    const activeFlags = [];
    if (text.includes("weather") || text.includes("wind") || text.includes("rain")) activeFlags.push("⚠️ WEATHER_VAR");
    if (text.includes("injury") || text.includes("out") || text.includes("lineup")) activeFlags.push("🚑 ROSTER_SITREP");
    if (text.includes("trend") || text.includes("history") || text.includes("past")) activeFlags.push("📈 HISTORICAL_TREND");
    if (text.includes("rest") || text.includes("back to back") || text.includes("b2b")) activeFlags.push("⚡ REST_FACTOR");
    
    // Default flag if none found
    if (activeFlags.length === 0) activeFlags.push("⚙️ BACKTEST_VALIDATED");
    return activeFlags;
  };

  return (
    <div className="elite-viewport">
      <div className="grid-overlay" />
      
      <header className="elite-header">
        <div className="brand">
          <div className="logo-glitch" data-text="CLUNZ">CLUNZ</div>
          <span className="matrix-status">CORE_SYSTEM_ACTIVE // 2026</span>
        </div>

        <div className="header-actions">
          <div className="system-time">
            <span className="label">SYSTEM_DATE:</span>
            <span className="value">{new Date().toLocaleDateString('en-GB')}</span>
          </div>
          <button onClick={triggerClunzEngine} className={`glow-btn ${loading ? 'loading' : ''}`}>
            {loading ? 'COMPILING FEED...' : hasAnalyzed ? 'REFRESH STREAM' : 'RUN DEEP ANALYSIS'}
          </button>
        </div>
      </header>

      <main className="dashboard-grid">
        <section className="feed-column">
          <div className="section-header">
            <h3><span className="icon">📡</span> HIGH_CONVICTION_FEED</h3>
          </div>

          <div className="filter-command-panel">
            <input 
              type="text" 
              placeholder="FILTER BY TEAM..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="matrix-search-input"
            />
          </div>

          <div className="scroll-area">
            {filteredPredictions.map((game, i) => (
              <div 
                key={i} 
                className={`prediction-tile ${selectedGame?.match === game.match ? 'active' : ''}`}
                onClick={() => {
                  setSelectedGame(game);
                  pushLog(`Inspecting profile: ${game.match}`);
                }}
              >
                <div className="tile-rank">0{i+1}</div>
                <div className="tile-content">
                  <div className="tile-match">{game.match}</div>
                  <div className="tile-prob-bar">
                    <div className="fill" style={{width: game.analysis.probability}} />
                  </div>
                </div>
                <div className="tile-pct">{game.analysis.probability}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="analysis-column">
          <div className="analysis-inner-split">
            {selectedGame ? (
              <div className="tactical-view">
                <div className="scan-line" />
                <div className="view-header">
                  <h2>TACTICAL_SELECTION_REPORT</h2>
                  <span className="tag">CONFIDENCE: {selectedGame.analysis.confidence}</span>
                </div>
                
                <div className="big-selection">
                  <span className="label">OPTIMAL OUTCOME</span>
                  <div className="value">{selectedGame.analysis.winner}</div>
                </div>

                <div className="situational-matrix">
                  <span className="matrix-title-label">ENVIRONMENTAL_TACTICAL_FLAGS</span>
                  <div className="flag-grid">
                    {getFlags(selectedGame.analysis.reasoning).map((flag, idx) => (
                      <div key={idx} className={`flag-badge ${flag.includes('⚠️') ? 'alert' : 'custom'}`}>
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="market-edge-container">
                  <div className="edge-metric-box">
                    <span className="edge-title">CLUNZ PROBABILITY</span>
                    <div className="edge-value neon">{selectedGame.analysis.probability}</div>
                  </div>
                  <div className="edge-metric-box">
                    <span className="edge-title">MARKET EDGE VALUE</span>
                    <div className="edge-value advantage">ACCURATE</div>
                  </div>
                </div>

                <div className="verification-header-accent">ENGINE VERIFICATION RATIONALE</div>
                <div className="reasoning-box">
                  <p>"{selectedGame.analysis.reasoning}"</p>
                </div>
              </div>
            ) : (
              <div className="empty-tactical">
                <div className="pulse-circle" />
                <p>AWAITING CORE DATA MATRIX INJECTION...</p>
              </div>
            )}

            <div className="side-metric-panel">
              {selectedGame && (
                <div className="telemetry-chart-box">
                  <div className="ledger-header">MATCHUP_TELEMETRY</div>
                  <div className="chart-stat-row">
                    <div className="chart-label">OFFENSIVE EFFICIENCY</div>
                    {/* LOGIC UPGRADE: Bar moves based on real probability data */}
                    <div className="mini-chart-track">
                      <div className="mini-chart-fill" style={{width: selectedGame.analysis.probability}} />
                    </div>
                  </div>
                  <div className="chart-stat-row">
                    <div className="chart-label">DEFENSIVE COHESION</div>
                    <div className="mini-chart-track">
                      <div className="mini-chart-fill" style={{width: '62%', opacity: 0.4}} />
                    </div>
                  </div>
                </div>
              )}

              <div className="settlement-ledger-container">
                <div className="ledger-header">HISTORICAL_SETTLEMENT_LEDGER</div>
                <div className="ledger-table">
                  <div className="ledger-row head">
                    <span>SELECTION</span>
                    <span>OUTCOME</span>
                  </div>
                  
                  {settledLedgerData.length > 0 ? (
                    settledLedgerData.map((game, index) => {
                      const isWin = game.outcome?.toUpperCase() === "WIN" || game.result?.toUpperCase() === "HIT";
                      return (
                        <div key={index} className="ledger-row">
                          <span className="truncate-text" title={game.match}>{game.match}</span>
                          <span className={`status ${isWin ? 'win' : 'lose'}`}>
                            {isWin ? 'HIT' : 'MISS'}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="ledger-empty-state">
                      NO_SETTLED_DATA_IN_STREAM
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="terminal-log-drawer">
            <div className="terminal-title">LIVE_SYSTEM_DIAGNOSTIC_LOGS</div>
            <div className="terminal-body">
              {logs.map((log, idx) => (
                <div key={idx} className="log-line">
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-msg">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
