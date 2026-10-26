import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNavigation from '../SiteNavigation';

function Section1() {
  const navigator = useNavigate();
  const [cubeConnected, setCubeConnected] = useState(false);
  const [lastConnectionTime, setLastConnectionTime] = useState(null);

  // WebSocket connection
  useEffect(() => {
    let ws = null;
    let reconnectInterval = null;

    const connectWebSocket = () => {
      try {
        ws = new WebSocket('ws://192.168.77.77:5000'); // Update this IP

        ws.onopen = () => {
          console.log('✅ Connected to WebSocket server');
        };

        ws.onmessage = (event) => {
          console.log('📨 WebSocket message:', event.data);

          try {
            const data = JSON.parse(event.data);
            console.log('📦 Parsed data:', data);

            // 🔌 DEVICE CONNECTED - Any of these means device is active
            if (data.command === 'device_startup' ||
              data.command === 'sensor_data' ||
              (data.command === 'device_status_update' && data.device_connected === true)) {

              console.log('🟢 DEVICE CONNECTED EVENT - Source:', data.command);
              setCubeConnected(true);
              setLastConnectionTime(Date.now());
            }

            // ❌ DEVICE DISCONNECTED - Any of these means device is offline
            else if (data.command === 'device_disconnected' ||
              data.command === 'device_inactive' ||
              (data.command === 'device_status_update' && data.device_connected === false)) {

              console.log('🔴 DEVICE DISCONNECTED EVENT - Source:', data.command);
              setCubeConnected(false);
            }

          } catch (e) {
            // Handle plain text messages
            if (event.data.includes('NodeMCU ready') || event.data.includes('startup')) {
              console.log('🟢 DEVICE CONNECTED (plain text)');
              setCubeConnected(true);
              setLastConnectionTime(Date.now());
            }
          }
        };

        ws.onclose = () => {
          console.log('❌ WebSocket connection closed');

          if (!reconnectInterval) {
            reconnectInterval = setInterval(() => {
              console.log('🔄 Attempting to reconnect...');
              connectWebSocket();
            }, 5000);
          }
        };

        ws.onerror = (error) => {
          console.error('🚨 WebSocket error:', error);
        };

      } catch (error) {
        console.error('❌ Failed to connect to WebSocket:', error);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectInterval) clearInterval(reconnectInterval);
      if (ws) ws.close();
    };
  }, []);

  // Timeout disconnection (if no activity for too long)
  useEffect(() => {
    if (!cubeConnected) return;

    const timeout = setTimeout(() => {
      console.log('⏰ Connection timeout - no activity for 15 seconds');
      setCubeConnected(false);
    }, 15000); // 15 seconds timeout

    return () => clearTimeout(timeout);
  }, [lastConnectionTime, cubeConnected]);

  // Debug logging
  useEffect(() => {
    console.log('🔄 CUBE STATE CHANGED:', cubeConnected ? 'CONNECTED' : 'DISCONNECTED');
  }, [cubeConnected]);

  const handleNavigation = (path) => {
    navigator(path);
  };

  return (
    <>
      <style>
        {`
          .cube-page {
            min-height: 100vh;
            background: #06081a;
            position: relative;
          }

          .cube-page::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
              radial-gradient(ellipse 60% 50% at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 80% 30%, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
            pointer-events: none;
          }

          /* ── Status Banner ── */
          .cube-status-banner {
            position: relative;
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 0.75rem 1.5rem;
            font-size: 0.9rem;
            font-weight: 600;
            letter-spacing: 0.02em;
            transition: all 0.5s ease;
          }

          .cube-status-banner.connected {
            background: linear-gradient(90deg, rgba(16, 185, 129, 0.08), rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.08));
            border-bottom: 1px solid rgba(16, 185, 129, 0.2);
            color: #6ee7b7;
          }

          .cube-status-banner.disconnected {
            background: linear-gradient(90deg, rgba(239, 68, 68, 0.06), rgba(239, 68, 68, 0.12), rgba(239, 68, 68, 0.06));
            border-bottom: 1px solid rgba(239, 68, 68, 0.15);
            color: #fca5a5;
          }

          .status-pulse {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            animation: pulse 2s infinite;
            flex-shrink: 0;
          }

          .status-pulse.connected {
            background: #10b981;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
          }

          .status-pulse.disconnected {
            background: #ef4444;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.85); }
          }

          /* ── Main Content ── */
          .cube-main {
            position: relative;
            z-index: 2;
            max-width: 900px;
            margin: 0 auto;
            padding: clamp(3rem, 8vw, 6rem) 1.5rem;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - 180px);
          }

          /* ── Connected View ── */
          .cube-options {
            display: flex;
            gap: 2rem;
            justify-content: center;
            flex-wrap: wrap;
            animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @keyframes fadeUpIn {
            from { opacity: 0; transform: translateY(25px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .cube-option-card {
            width: 280px;
            height: 220px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(148, 163, 184, 0.1);
            border-radius: 24px;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .cube-option-card::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--card-glow), transparent 70%);
            opacity: 0;
            transition: opacity 0.4s;
          }

          .cube-option-card:hover {
            transform: translateY(-8px) scale(1.02);
            border-color: var(--card-border);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 30px var(--card-shadow);
          }

          .cube-option-card:hover::before {
            opacity: 1;
          }

          .cube-option-icon {
            font-size: 2.5rem;
            position: relative;
            z-index: 2;
          }

          .cube-option-label {
            font-family: 'Outfit', sans-serif;
            font-size: 1.3rem;
            font-weight: 700;
            color: #f1f5f9;
            text-align: center;
            position: relative;
            z-index: 2;
            line-height: 1.3;
          }

          .cube-option-sublabel {
            font-size: 0.85rem;
            color: #94a3b8;
            position: relative;
            z-index: 2;
          }

          /* ── Disconnected View ── */
          .cube-disconnected {
            max-width: 520px;
            text-align: center;
            animation: fadeUpIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          .disconnected-card {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(239, 68, 68, 0.15);
            border-radius: 24px;
            padding: clamp(2rem, 5vw, 3.5rem);
            backdrop-filter: blur(20px);
          }

          .disconnected-emoji {
            font-size: 3.5rem;
            margin-bottom: 1.5rem;
            filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.2));
          }

          .disconnected-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.8rem;
            font-weight: 800;
            color: #fca5a5;
            margin-bottom: 0.75rem;
          }

          .disconnected-text {
            font-size: 1rem;
            color: #94a3b8;
            line-height: 1.7;
            margin-bottom: 2rem;
          }

          .disconnected-instruction {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.9rem 1.5rem;
            background: rgba(250, 204, 21, 0.06);
            border: 1px solid rgba(250, 204, 21, 0.15);
            border-radius: 14px;
            color: #fde68a;
            font-weight: 600;
            font-size: 0.95rem;
            margin-bottom: 2rem;
          }

          .manual-fallback-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.85rem 2rem;
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 14px;
            background: rgba(99, 102, 241, 0.08);
            color: #a78bfa;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .manual-fallback-btn:hover {
            background: rgba(99, 102, 241, 0.15);
            border-color: rgba(99, 102, 241, 0.3);
            color: #c4b5fd;
            transform: translateY(-2px);
          }

          /* ── Footer ── */
          .cube-footer {
            position: relative;
            z-index: 5;
            background: rgba(6, 8, 26, 0.95);
            border-top: 1px solid rgba(139, 92, 246, 0.12);
          }

          .cube-footer-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 1.5rem 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 2.5rem;
            align-items: center;
          }

          .cf-section { text-align: center; }
          .cf-left { text-align: left; }
          .cf-right { text-align: right; }

          .cf-brand {
            font-family: 'Outfit', sans-serif;
            font-size: 1.4rem;
            font-weight: 800;
            margin-bottom: 0.6rem;
            background: linear-gradient(135deg, #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .cf-desc { color: #64748b; font-size: 0.9rem; line-height: 1.6; }

          .cf-socials {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
          }

          .cf-social-btn {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: rgba(99, 102, 241, 0.08);
            border: 1px solid rgba(99, 102, 241, 0.15);
            display: grid;
            place-items: center;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .cf-social-btn:hover {
            background: rgba(99, 102, 241, 0.15);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
          }

          .cf-social-btn img {
            width: 20px;
            height: 20px;
            filter: brightness(0) invert(1);
            opacity: 0.7;
            transition: opacity 0.3s;
          }

          .cf-social-btn:hover img { opacity: 1; }

          .cf-email {
            color: #a78bfa;
            text-decoration: none;
            font-weight: 600;
            transition: color 0.3s;
          }

          .cf-email:hover { color: #c4b5fd; }

          .cf-copy {
            color: #475569;
            font-size: 0.8rem;
            margin-top: 0.5rem;
          }

          /* ── Responsive ── */
          @media (max-width: 768px) {
            .cube-options {
              flex-direction: column;
              align-items: center;
            }
            .cube-option-card {
              width: min(100%, 300px);
              height: 180px;
            }
            .cf-left, .cf-right { text-align: center; }
          }
        `}
      </style>

      <div className="cube-page">
        <SiteNavigation />

        {/* Status Banner */}
        <div className={`cube-status-banner ${cubeConnected ? 'connected' : 'disconnected'}`}>
          <span className={`status-pulse ${cubeConnected ? 'connected' : 'disconnected'}`} />
          {cubeConnected ? 'Cube Connected — Ready to Play' : 'Cube Disconnected — Waiting for Connection'}
        </div>

        {/* Main Content */}
        <main className="cube-main">
          {cubeConnected ? (
            <div className="cube-options">
              <div
                className="cube-option-card"
                style={{
                  '--card-glow': 'rgba(99, 102, 241, 0.12)',
                  '--card-border': 'rgba(99, 102, 241, 0.4)',
                  '--card-shadow': 'rgba(99, 102, 241, 0.15)'
                }}
                onClick={() => handleNavigation("/predefined")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigation("/predefined")}
              >
                <span className="cube-option-icon">🎆</span>
                <span className="cube-option-label">Pre Defined<br />Patterns</span>
                <span className="cube-option-sublabel">10+ ready-to-use effects</span>
              </div>
              <div
                className="cube-option-card"
                style={{
                  '--card-glow': 'rgba(139, 92, 246, 0.12)',
                  '--card-border': 'rgba(139, 92, 246, 0.4)',
                  '--card-shadow': 'rgba(139, 92, 246, 0.15)'
                }}
                onClick={() => handleNavigation("/patternselector")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleNavigation("/patternselector")}
              >
                <span className="cube-option-icon">✨</span>
                <span className="cube-option-label">Manual<br />Pattern</span>
                <span className="cube-option-sublabel">Create your own designs</span>
              </div>
            </div>
          ) : (
            <div className="cube-disconnected">
              <div className="disconnected-card">
                <div className="disconnected-emoji">🔌</div>
                <h2 className="disconnected-title">Cube Not Powered On</h2>
                <p className="disconnected-text">
                  Your SonicGlow Cube is not currently connected to the system.
                  Make sure the cube is powered on and connected to the same network.
                </p>
                <div className="disconnected-instruction">
                  📋 Press and hold the power switch to turn on the cube
                </div>
                <br />
                <button
                  onClick={() => handleNavigation("/patternselector")}
                  className="manual-fallback-btn"
                >
                  Open Manual Pattern →
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="cube-footer">
          <div className="cube-footer-inner">
            <div className="cf-section cf-left">
              <h3 className="cf-brand">SonicGlow Cube</h3>
              <p className="cf-desc">
                Created by Hardware Hackers<br />
                University of Moratuwa — First-Year Hardware Project
              </p>
            </div>
            <div className="cf-section">
              <div className="cf-socials">
                {[
                  { href: "https://www.facebook.com/", src: "/images/fb.png", alt: "Facebook" },
                  { href: "https://www.youtube.com/", src: "/images/youtube.png", alt: "YouTube" },
                  { href: "https://www.linkedin.com/", src: "/images/linkedin.png", alt: "LinkedIn" },
                  { href: "https://www.instagram.com/", src: "/images/inst.png", alt: "Instagram" }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="cf-social-btn" title={s.alt}>
                    <img src={s.src} alt={s.alt} />
                  </a>
                ))}
              </div>
            </div>
            <div className="cf-section cf-right">
              <p>
                <a href="mailto:hardwarehackers@uom.lk" className="cf-email">hardwarehackers@uom.lk</a>
              </p>
              <p className="cf-copy">© 2025 SonicGlow Cube | All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Section1;