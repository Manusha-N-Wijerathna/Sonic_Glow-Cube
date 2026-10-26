import { useState } from "react";
import SiteNavigation from '../SiteNavigation';

const Predefined = () => {
  const [selectedPattern, setSelectedPattern] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Define available patterns
  const patterns = [
    { id: 0, name: "Rain Effect", description: "Falling droplets cascading through the 3D matrix", icon: "🌧️" },
    { id: 1, name: "Snake", description: "Dynamic crawling 3D snake navigating the volume", icon: "🐍" },
    { id: 2, name: "Pingpong", description: "Bouncing energy pulse oscillating between planes", icon: "🏓" },
    { id: 3, name: "Fireworks", description: "Expansive bursts of illumination radiating outward", icon: "🎆" },
    { id: 4, name: "Breathing", description: "Smooth volumetric pulse fading in and out", icon: "✨" },
    { id: 5, name: "Countdown", description: "Numeric sequence countdown rendered in 3D voxels", icon: "⏳" },
    { id: 6, name: "Random Sparkle", description: "Stochastic twinkling across all 512 LEDs", icon: "💫" },
    { id: 7, name: "Spiral", description: "Helical light spiral twisting through the core", icon: "🌀" },
    { id: 8, name: "Wave", description: "Harmonic mathematical sine wave propagation", icon: "🌊" },
    { id: 9, name: "Cube Rotate", description: "Rotating volumetric cube outline animation", icon: "🧊" }
  ];

  const handleSubmit = async (overrideId = null) => {
    const patternToSend = overrideId !== null ? overrideId.toString() : selectedPattern;
    if (patternToSend === "") {
      alert("Please select a pattern first!");
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);
    
    try {
      console.log("Sending pattern:", patternToSend);
      
      const data = {
        pattern: parseInt(patternToSend),
        timestamp: Date.now()
      };

      const result = await fetch("http://192.168.77.77:5000/send-pattern", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (result.ok) {
        const response = await result.json();
        console.log("Pattern sent successfully:", response);
        const pat = patterns.find(p => p.id === parseInt(patternToSend));
        setStatusMessage({ type: 'success', text: `Pattern "${pat ? pat.name : patternToSend}" triggered successfully!` });
        alert(`Pattern ${patternToSend} sent to cube!`);
      } else {
        throw new Error(`HTTP error! status: ${result.status}`);
      }
    } catch (error) {
      console.error("Error sending pattern:", error);
      setStatusMessage({ type: 'error', text: 'Failed to send pattern to cube. Please check your NodeMCU connection.' });
      alert("Failed to send pattern to cube. Please check connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePatternChange = (e) => {
    setSelectedPattern(e.target.value);
  };

  const handleCardClick = (patternId) => {
    setSelectedPattern(patternId.toString());
  };

  const selectedPatternInfo = patterns.find(p => p.id === parseInt(selectedPattern));

  return (
    <>
      <style>{`
        .predefined-page {
          min-height: 100vh;
          background: #06081a;
          color: #f1f5f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .predefined-bg-glow {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(99, 102, 241, 0.16) 0%, transparent 45%),
            radial-gradient(circle at 82% 78%, rgba(168, 85, 247, 0.14) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .predefined-content {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 3rem 1.5rem 5rem;
        }

        /* ── Header ── */
        .predefined-header {
          text-align: center;
          margin-bottom: 3.5rem;
          animation: fadeInDown 0.6s ease-out;
        }

        .predefined-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.1rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.35);
          color: #c4b5fd;
          margin-bottom: 1.25rem;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
        }

        .predefined-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #a855f7;
          box-shadow: 0 0 10px #a855f7;
          animation: pulseDot 2s infinite ease-in-out;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .predefined-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.2rem, 4.5vw, 3.4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #f1f5f9;
          margin-bottom: 1rem;
          line-height: 1.15;
        }

        .predefined-title .title-accent {
          background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .predefined-subtitle {
          font-size: 1.05rem;
          color: #94a3b8;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* ── Control Console Card ── */
        .control-console {
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 92, 246, 0.22);
          border-radius: 24px;
          padding: 2.5rem;
          margin-bottom: 3.5rem;
          box-shadow:
            0 20px 50px rgba(0, 0, 0, 0.4),
            0 0 40px rgba(99, 102, 241, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          animation: fadeInUp 0.7s ease-out;
        }

        .console-top-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1.5rem;
          align-items: flex-end;
          margin-bottom: 1.5rem;
        }

        @media (max-width: 720px) {
          .console-top-row {
            grid-template-columns: 1fr;
          }
        }

        .console-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .console-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #cbd5e1;
          letter-spacing: 0.02em;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .select-wrapper {
          position: relative;
        }

        .console-select {
          width: 100%;
          padding: 1rem 1.25rem;
          font-size: 1rem;
          font-family: inherit;
          color: #f1f5f9;
          background: rgba(11, 18, 34, 0.9);
          border: 1.5px solid rgba(139, 92, 246, 0.3);
          border-radius: 14px;
          outline: none;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .console-select:hover {
          border-color: rgba(168, 85, 247, 0.5);
          background: rgba(15, 23, 42, 0.95);
        }

        .console-select:focus {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25), 0 8px 24px rgba(99, 102, 241, 0.2);
        }

        .select-chevron {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #94a3b8;
          font-size: 0.8rem;
        }

        .console-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 2.2rem;
          border-radius: 14px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 10px 25px rgba(99, 102, 241, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          white-space: nowrap;
          min-height: 54px;
          position: relative;
          overflow: hidden;
        }

        .console-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .console-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 35px rgba(99, 102, 241, 0.45);
        }

        .console-btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .console-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .console-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        .btn-label-content {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* ── Active Pattern Preview Card ── */
        .preview-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-radius: 16px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(168, 85, 247, 0.08));
          border: 1px solid rgba(139, 92, 246, 0.3);
          animation: fadeIn 0.4s ease-out;
          gap: 1.25rem;
        }

        .preview-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .preview-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid rgba(139, 92, 246, 0.4);
          display: grid;
          place-items: center;
          font-size: 1.5rem;
        }

        .preview-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.2rem;
        }

        .preview-desc {
          font-size: 0.88rem;
          color: #94a3b8;
        }

        .preview-status-pill {
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.35);
          color: #4ade80;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── Status Banner ── */
        .status-alert {
          margin-top: 1.25rem;
          padding: 0.9rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .status-alert.success {
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #86efac;
        }

        .status-alert.error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        /* ── Pattern Cards Grid ── */
        .grid-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .grid-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }

        .grid-count {
          font-size: 0.85rem;
          color: #94a3b8;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.3rem 0.8rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        .pattern-card {
          position: relative;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1.5px solid rgba(139, 92, 246, 0.15);
          border-radius: 20px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          overflow: hidden;
        }

        .pattern-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.12), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .pattern-card:hover {
          transform: translateY(-5px);
          border-color: rgba(168, 85, 247, 0.45);
          box-shadow:
            0 12px 30px rgba(0, 0, 0, 0.3),
            0 0 25px rgba(99, 102, 241, 0.2);
        }

        .pattern-card:hover::before {
          opacity: 1;
        }

        .pattern-card.selected {
          border-color: #818cf8;
          background: rgba(30, 27, 75, 0.65);
          transform: translateY(-4px) scale(1.02);
          box-shadow:
            0 14px 35px rgba(0, 0, 0, 0.4),
            0 0 35px rgba(129, 140, 248, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .pattern-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pattern-icon {
          font-size: 1.7rem;
        }

        .pattern-id-badge {
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          color: #a855f7;
          background: rgba(168, 85, 247, 0.12);
          border: 1px solid rgba(168, 85, 247, 0.25);
          padding: 0.2rem 0.65rem;
          border-radius: 8px;
        }

        .pattern-card.selected .pattern-id-badge {
          background: #818cf8;
          color: #06081a;
          border-color: #818cf8;
        }

        .card-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #f1f5f9;
          letter-spacing: -0.01em;
        }

        .card-desc {
          font-size: 0.85rem;
          color: #94a3b8;
          line-height: 1.5;
          flex-grow: 1;
        }

        .card-action-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 0.8rem;
          color: #818cf8;
          font-weight: 600;
        }

        .card-action-bar span {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Consistent Footer ── */
        .page-footer {
          position: relative;
          z-index: 5;
          background: rgba(6, 8, 26, 0.95);
          border-top: 1px solid rgba(139, 92, 246, 0.12);
          margin-top: 5rem;
        }

        .footer-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem 2rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
          align-items: center;
        }

        .footer-brand {
          font-family: 'Outfit', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.4rem;
        }

        .footer-desc {
          color: #64748b;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        .footer-social-section {
          text-align: center;
        }

        .footer-socials {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .footer-social-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.15);
          color: #c4b5fd;
          font-weight: 700;
          font-size: 0.8rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .footer-social-btn:hover {
          background: rgba(139, 92, 246, 0.22);
          border-color: rgba(139, 92, 246, 0.45);
          transform: translateY(-2px);
          color: #ffffff;
        }

        .footer-contact-section {
          text-align: right;
        }

        @media (max-width: 768px) {
          .footer-contact-section, .footer-social-section {
            text-align: left;
          }
        }

        .footer-email {
          color: #a855f7;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.85rem;
          transition: color 0.2s;
        }

        .footer-email:hover {
          color: #c084fc;
        }

        .footer-copy {
          color: #475569;
          font-size: 0.8rem;
          margin-top: 0.35rem;
        }
      `}</style>

      <div className="predefined-page">
        <div className="predefined-bg-glow" />
        <SiteNavigation />

        <main className="predefined-content">
          {/* Header */}
          <header className="predefined-header">
            <div className="predefined-badge">
              <span className="predefined-badge-dot" />
              <span>Volumetric Pattern Engine</span>
            </div>
            <h1 className="predefined-title">
              Sonic<span className="title-accent">Glow</span> Pattern Control
            </h1>
            <p className="predefined-subtitle">
              Choose from 10 algorithmically choreographed animations mapped onto the 8×8×8 LED cube matrix.
            </p>
          </header>

          {/* Console / Selection Box */}
          <section className="control-console">
            <div className="console-top-row">
              <div className="console-input-group">
                <label htmlFor="patternSelect" className="console-label">
                  <span>⚡ Select Active Pattern</span>
                </label>
                <div className="select-wrapper">
                  <select
                    id="patternSelect"
                    name="patternSelect"
                    value={selectedPattern}
                    onChange={handlePatternChange}
                    className="console-select"
                    disabled={isLoading}
                  >
                    <option value="">-- Choose an animation pattern --</option>
                    {patterns.map((pattern) => (
                      <option key={pattern.id} value={pattern.id}>
                        [{pattern.id}] {pattern.name} — {pattern.description}
                      </option>
                    ))}
                  </select>
                  <span className="select-chevron">▼</span>
                </div>
              </div>

              <button
                onClick={() => handleSubmit()}
                className="console-btn"
                disabled={isLoading || selectedPattern === ""}
              >
                <span className="btn-label-content">
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Transmitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Transmit to Cube</span>
                      <span>→</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Selected Pattern Info Box */}
            {selectedPatternInfo && (
              <div className="preview-box">
                <div className="preview-left">
                  <div className="preview-icon-wrapper">
                    {selectedPatternInfo.icon}
                  </div>
                  <div>
                    <h3 className="preview-name">Pattern #{selectedPatternInfo.id}: {selectedPatternInfo.name}</h3>
                    <p className="preview-desc">{selectedPatternInfo.description}</p>
                  </div>
                </div>
                <div className="preview-status-pill">Ready to Stream</div>
              </div>
            )}

            {/* Inline Status Message */}
            {statusMessage && (
              <div className={`status-alert ${statusMessage.type}`}>
                <span>{statusMessage.type === 'success' ? '✓' : '⚠'}</span>
                <span>{statusMessage.text}</span>
              </div>
            )}
          </section>

          {/* Grid of All Patterns */}
          <section>
            <div className="grid-header">
              <h2 className="grid-title">Available Patterns</h2>
              <span className="grid-count">10 Presets</span>
            </div>

            <div className="pattern-grid">
              {patterns.map((pattern) => {
                const isSelected = selectedPattern === pattern.id.toString();
                return (
                  <div
                    key={pattern.id}
                    className={`pattern-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCardClick(pattern.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(pattern.id); }}
                  >
                    <div className="pattern-card-header">
                      <span className="pattern-icon">{pattern.icon}</span>
                      <span className="pattern-id-badge">#{pattern.id}</span>
                    </div>

                    <h3 className="card-name">{pattern.name}</h3>
                    <p className="card-desc">{pattern.description}</p>

                    <div className="card-action-bar">
                      <span>{isSelected ? '✓ Selected' : 'Click to select'}</span>
                      <span>{isSelected ? '●' : '→'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="page-footer">
          <div className="footer-inner">
            <div>
              <div className="footer-brand">SonicGlow Cube</div>
              <p className="footer-desc">
                First-Year Hardware Project • Faculty of Information Technology<br />
                University of Moratuwa
              </p>
            </div>

            <div className="footer-social-section">
              <div className="footer-socials">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Facebook">FB</a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="YouTube">YT</a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="LinkedIn">LI</a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Instagram">IG</a>
              </div>
            </div>

            <div className="footer-contact-section">
              <a href="mailto:hardwarehackers@uom.lk" className="footer-email">
                hardwarehackers@uom.lk
              </a>
              <div className="footer-copy">© 2025 SonicGlow Cube. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Predefined;