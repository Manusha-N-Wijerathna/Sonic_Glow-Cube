import { useState } from "react";
import SiteNavigation from '../SiteNavigation';

const Text = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputText.trim()) {
      setFeedback({ type: 'error', text: 'Please enter a message before sending.' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    const upperCaseText = inputText.toUpperCase();
    console.log("Submitted text:", upperCaseText);

    try {
      const payload = {
        command: "user_input",
        text: upperCaseText
      };

      const result = await fetch("http://192.168.77.77:5000/send-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Response:", result);

      if (result.ok) {
        console.log("✅ Text sent successfully!");
        setFeedback({ type: 'success', text: `Message "${upperCaseText}" broadcast to cube!` });
      } else {
        console.error("❌ Failed to send text:", result.status);
        setFeedback({ type: 'error', text: `Failed to broadcast. Server responded with status ${result.status}` });
      }
    } catch (error) {
      console.error("Error:", error);
      setFeedback({ type: 'error', text: 'Connection failed. Ensure the NodeMCU backend is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setInputText(e.target.value.toUpperCase());
  };

  const handleQuickPreset = (presetText) => {
    setInputText(presetText.toUpperCase());
  };

  const quickPresets = ["HELLO", "SONIC GLOW", "UOM FIT", "2025", "HACKERS", "WELCOME"];

  return (
    <>
      <style>{`
        .usertext-page {
          min-height: 100vh;
          background: #06081a;
          color: #f1f5f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
        }

        .usertext-bg-glow {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at 20% 25%, rgba(99, 102, 241, 0.16) 0%, transparent 45%),
            radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .usertext-main {
          flex: 1;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3.5rem 1.5rem 4rem;
        }

        .usertext-card {
          width: 100%;
          max-width: 620px;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(139, 92, 246, 0.25);
          border-radius: 28px;
          padding: 3rem 2.5rem;
          box-shadow:
            0 24px 60px rgba(0, 0, 0, 0.45),
            0 0 50px rgba(99, 102, 241, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          animation: slideUpFade 0.7s ease-out;
        }

        @media (max-width: 600px) {
          .usertext-card {
            padding: 2rem 1.5rem;
          }
        }

        /* ── Header ── */
        .usertext-header {
          text-align: center;
          margin-bottom: 2.25rem;
        }

        .usertext-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 1rem;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.35);
          color: #c4b5fd;
          margin-bottom: 1rem;
        }

        .usertext-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 8px #818cf8;
          animation: pulseDot 2s infinite ease-in-out;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .usertext-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.9rem, 3.8vw, 2.6rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          color: #f1f5f9;
          margin-bottom: 0.6rem;
          line-height: 1.15;
        }

        .usertext-title .title-accent {
          background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .usertext-desc {
          font-size: 0.95rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        /* ── Live Matrix Preview ── */
        .matrix-preview-container {
          background: #030511;
          border: 1px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          padding: 1.25rem;
          margin-bottom: 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.7);
        }

        .matrix-preview-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15) 0px,
            rgba(0, 0, 0, 0.15) 1px,
            transparent 1px,
            transparent 3px
          );
          pointer-events: none;
        }

        .matrix-preview-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .matrix-display {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Courier New', Courier, monospace;
          font-size: 1.45rem;
          font-weight: 900;
          letter-spacing: 0.25em;
          color: #a855f7;
          text-shadow:
            0 0 10px rgba(168, 85, 247, 0.8),
            0 0 20px rgba(168, 85, 247, 0.4);
          word-break: break-all;
          text-align: center;
        }

        .matrix-empty-hint {
          color: #334155;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-shadow: none;
          font-family: 'Inter', sans-serif;
          font-style: italic;
        }

        /* ── Input Form ── */
        .usertext-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .input-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          font-weight: 600;
          color: #cbd5e1;
        }

        .char-counter {
          font-size: 0.78rem;
          color: #64748b;
          font-variant-numeric: tabular-nums;
        }

        .input-wrapper {
          position: relative;
        }

        .usertext-input {
          width: 100%;
          padding: 1.1rem 1.25rem;
          font-size: 1.1rem;
          font-family: inherit;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #f1f5f9;
          background: rgba(11, 18, 34, 0.9);
          border: 1.5px solid rgba(139, 92, 246, 0.3);
          border-radius: 16px;
          outline: none;
          text-transform: uppercase;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .usertext-input::placeholder {
          color: #475569;
          font-weight: 400;
          text-transform: none;
          letter-spacing: 0;
        }

        .usertext-input:hover {
          border-color: rgba(168, 85, 247, 0.5);
          background: rgba(15, 23, 42, 0.95);
        }

        .usertext-input:focus {
          border-color: #818cf8;
          box-shadow:
            0 0 0 3px rgba(99, 102, 241, 0.25),
            0 8px 24px rgba(99, 102, 241, 0.2);
        }

        /* ── Quick Presets ── */
        .presets-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .presets-label {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 600;
          margin-right: 0.25rem;
        }

        .preset-chip {
          padding: 0.3rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .preset-chip:hover {
          background: rgba(99, 102, 241, 0.18);
          border-color: rgba(139, 92, 246, 0.4);
          color: #ffffff;
          transform: translateY(-1px);
        }

        /* ── Submit CTA ── */
        .usertext-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.1rem 2rem;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow:
            0 12px 28px rgba(99, 102, 241, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }

        .usertext-submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #8b5cf6, #d946ef);
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        .usertext-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 16px 38px rgba(99, 102, 241, 0.45);
        }

        .usertext-submit-btn:hover:not(:disabled)::before {
          opacity: 1;
        }

        .usertext-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .usertext-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(0.4);
        }

        .btn-content {
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

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ── Feedback Message ── */
        .feedback-banner {
          padding: 0.9rem 1.25rem;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          animation: fadeIn 0.3s ease-out;
        }

        .feedback-banner.success {
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.4);
          color: #86efac;
        }

        .feedback-banner.error {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Footer ── */
        .page-footer {
          position: relative;
          z-index: 5;
          background: rgba(6, 8, 26, 0.95);
          border-top: 1px solid rgba(139, 92, 246, 0.12);
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

      <div className="usertext-page">
        <div className="usertext-bg-glow" />
        <SiteNavigation />

        <main className="usertext-main">
          <div className="usertext-card">
            <header className="usertext-header">
              <div className="usertext-pill">
                <span className="usertext-pill-dot" />
                <span>Text Matrix Streamer</span>
              </div>
              <h1 className="usertext-title">
                Sonic<span className="title-accent">Glow</span> Text Input
              </h1>
              <p className="usertext-desc">
                Broadcast custom messages directly across the 3D LED voxel cube layers.
              </p>
            </header>

            {/* Simulated LED Matrix Preview */}
            <div className="matrix-preview-container">
              <div className="matrix-preview-label">
                <span>Voxel Display Preview</span>
                <span>8×8×8 Grid</span>
              </div>
              <div className="matrix-display">
                {inputText ? (
                  <span>{inputText}</span>
                ) : (
                  <span className="matrix-empty-hint">Waiting for input...</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="usertext-form">
              <div className="input-group">
                <div className="input-label-row">
                  <label htmlFor="inputText">Message to Scroll</label>
                  <span className="char-counter">{inputText.length} characters</span>
                </div>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="inputText"
                    name="inputText"
                    value={inputText}
                    onChange={handleChange}
                    required
                    maxLength={48}
                    className="usertext-input"
                    placeholder="E.G. HELLO MORATUWA"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="presets-row">
                <span className="presets-label">Quick:</span>
                {quickPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    className="preset-chip"
                    onClick={() => handleQuickPreset(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Status / Feedback */}
              {feedback && (
                <div className={`feedback-banner ${feedback.type}`}>
                  <span>{feedback.type === 'success' ? '✓' : '⚠'}</span>
                  <span>{feedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                className="usertext-submit-btn"
                disabled={isLoading || !inputText.trim()}
              >
                <span className="btn-content">
                  {isLoading ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Broadcast to Cube</span>
                      <span>→</span>
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
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

export default Text;