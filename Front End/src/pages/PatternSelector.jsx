import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNavigation from '../SiteNavigation';

function PatternSelector() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .ps-page {
          min-height: 100vh;
          background: #06081a;
          position: relative;
        }

        .ps-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 50% 50% at 30% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%),
            radial-gradient(ellipse 50% 50% at 70% 40%, rgba(168, 85, 247, 0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .ps-main {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 72px);
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .ps-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 900;
          color: #f1f5f9;
          margin-bottom: 0.75rem;
          letter-spacing: -0.03em;
        }

        .ps-title-accent {
          background: linear-gradient(135deg, #818cf8, #c084fc, #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ps-subtitle {
          font-size: 1.1rem;
          color: #94a3b8;
          margin-bottom: 3rem;
          max-width: 460px;
        }

        .ps-options {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          justify-content: center;
          width: 100%;
          max-width: 600px;
        }

        .ps-card {
          flex: 1 1 250px;
          max-width: 280px;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 2rem 1.5rem;
          background: rgba(15, 23, 42, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .ps-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--glow), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .ps-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: var(--border);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px var(--shadow);
        }

        .ps-card:hover::before { opacity: 1; }

        .ps-card:focus-visible {
          outline: 2px solid #818cf8;
          outline-offset: 4px;
        }

        .ps-card-icon {
          font-size: 2.8rem;
          position: relative;
          z-index: 2;
        }

        .ps-card-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #f1f5f9;
          position: relative;
          z-index: 2;
        }

        .ps-card-desc {
          font-size: 0.85rem;
          color: #94a3b8;
          position: relative;
          z-index: 2;
        }

        @media (max-width: 600px) {
          .ps-options { flex-direction: column; align-items: center; }
          .ps-card { max-width: 320px; width: 100%; }
        }
      `}</style>

      <div className="ps-page">
        <SiteNavigation />
        <main className="ps-main">
          <h1 className="ps-title">
            Choose a <span className="ps-title-accent">Pattern</span>
          </h1>
          <p className="ps-subtitle">
            Select a predefined animation or compose your own custom text to display on the cube.
          </p>
          <div className="ps-options">
            <div
              className="ps-card"
              style={{
                '--glow': 'rgba(99, 102, 241, 0.12)',
                '--border': 'rgba(99, 102, 241, 0.4)',
                '--shadow': 'rgba(99, 102, 241, 0.15)'
              }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/predefined')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/predefined')}
            >
              <span className="ps-card-icon">🎆</span>
              <span className="ps-card-title">Predefined Patterns</span>
              <span className="ps-card-desc">10+ ready-to-use effects</span>
            </div>
            <div
              className="ps-card"
              style={{
                '--glow': 'rgba(139, 92, 246, 0.12)',
                '--border': 'rgba(139, 92, 246, 0.4)',
                '--shadow': 'rgba(139, 92, 246, 0.15)'
              }}
              role="button"
              tabIndex={0}
              onClick={() => navigate('/usertext')}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/usertext')}
            >
              <span className="ps-card-icon">✏️</span>
              <span className="ps-card-title">User Text</span>
              <span className="ps-card-desc">Type your own message</span>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default PatternSelector;
