import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteNavigation from '../SiteNavigation';

function Home() {
  const navigator = useNavigate();
  const heroRef = useRef(null);

  const handleNavigation = (path) => {
    navigator(path);
  };

  // Parallax floating particles effect
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      hero.style.setProperty('--mx', `${x}px`);
      hero.style.setProperty('--my', `${y}px`);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <>
      <style>
        {`
          .home-page {
            min-height: 100vh;
            background: #06081a;
            position: relative;
            overflow-x: hidden;
          }

          /* ── Ambient Background ── */
          .home-page::before {
            content: '';
            position: fixed;
            inset: 0;
            background:
              radial-gradient(ellipse 60% 50% at 20% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 70%),
              radial-gradient(ellipse 50% 60% at 80% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 70%),
              radial-gradient(ellipse 40% 40% at 50% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
          }

          /* ── Hero Section ── */
          .home-hero {
            position: relative;
            z-index: 2;
            min-height: calc(100vh - 72px);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: clamp(2rem, 5vw, 5rem);
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: clamp(2rem, 5vw, 5rem) 1.5rem;
          }

          .home-hero-content {
            animation: heroSlideIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
          }

          @keyframes heroSlideIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .home-hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.4rem 1rem 0.4rem 0.5rem;
            border-radius: 50px;
            background: rgba(99, 102, 241, 0.1);
            border: 1px solid rgba(99, 102, 241, 0.2);
            font-size: 0.8rem;
            font-weight: 600;
            color: #a78bfa;
            margin-bottom: 1.5rem;
            backdrop-filter: blur(8px);
          }

          .badge-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #6366f1;
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.6);
            animation: pulseDot 2s infinite;
          }

          @keyframes pulseDot {
            0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(99, 102, 241, 0.6); }
            50% { opacity: 0.6; box-shadow: 0 0 20px rgba(99, 102, 241, 0.9); }
          }

          .home-hero-title {
            font-family: 'Outfit', 'Inter', sans-serif;
            font-size: clamp(2.5rem, 5.5vw, 4.2rem);
            font-weight: 900;
            line-height: 1.1;
            color: #f1f5f9;
            margin-bottom: 1.5rem;
            letter-spacing: -0.03em;
          }

          .title-gradient {
            background: linear-gradient(135deg, #818cf8, #c084fc, #e879f9);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            position: relative;
          }

          .home-hero-desc {
            font-size: clamp(1rem, 1.5vw, 1.2rem);
            line-height: 1.8;
            color: #94a3b8;
            margin-bottom: 2.5rem;
            max-width: 520px;
          }

          .home-hero-desc strong {
            color: #c4b5fd;
            font-weight: 700;
          }

          /* ── CTA Buttons ── */
          .home-cta-group {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          .home-cta-primary {
            display: inline-flex;
            align-items: center;
            gap: 0.6rem;
            padding: 0.9rem 2.2rem;
            border: none;
            border-radius: 14px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: #fff;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow:
              0 8px 25px rgba(99, 102, 241, 0.35),
              inset 0 1px 0 rgba(255, 255, 255, 0.15);
            letter-spacing: 0.02em;
            position: relative;
            overflow: hidden;
          }

          .home-cta-primary::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #8b5cf6, #a855f7);
            opacity: 0;
            transition: opacity 0.35s ease;
          }

          .home-cta-primary:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow:
              0 14px 40px rgba(99, 102, 241, 0.45),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }

          .home-cta-primary:hover::before {
            opacity: 1;
          }

          .home-cta-primary span {
            position: relative;
            z-index: 1;
          }

          .cta-arrow {
            transition: transform 0.3s ease;
          }

          .home-cta-primary:hover .cta-arrow {
            transform: translateX(4px);
          }

          .home-cta-secondary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.9rem 2rem;
            border: 1px solid rgba(148, 163, 184, 0.2);
            border-radius: 14px;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(10px);
            color: #cbd5e1;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .home-cta-secondary:hover {
            border-color: rgba(139, 92, 246, 0.3);
            background: rgba(99, 102, 241, 0.08);
            color: #e2e8f0;
            transform: translateY(-2px);
          }

          /* ── Cube Showcase ── */
          .home-hero-visual {
            display: flex;
            justify-content: center;
            align-items: center;
            animation: heroVisualIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
          }

          @keyframes heroVisualIn {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }

          .cube-showcase-wrapper {
            position: relative;
            max-width: 460px;
            width: 100%;
            --mx: 0px;
            --my: 0px;
          }

          .cube-glow-ring {
            position: absolute;
            inset: -20px;
            border-radius: 2.5rem;
            background: conic-gradient(
              from 180deg,
              rgba(99, 102, 241, 0.3),
              rgba(139, 92, 246, 0.2),
              rgba(168, 85, 247, 0.3),
              rgba(99, 102, 241, 0.1),
              rgba(139, 92, 246, 0.3)
            );
            filter: blur(30px);
            opacity: 0.6;
            animation: rotateGlow 8s linear infinite;
            transform: translate(var(--mx), var(--my));
          }

          @keyframes rotateGlow {
            to { rotate: 360deg; }
          }

          .cube-card {
            position: relative;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(139, 92, 246, 0.2);
            border-radius: 2rem;
            padding: 1.5rem;
            backdrop-filter: blur(20px);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .cube-card:hover {
            border-color: rgba(139, 92, 246, 0.4);
            transform: translateY(-5px);
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          }

          .cube-img {
            width: 100%;
            height: auto;
            border-radius: 1.25rem;
            display: block;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
            transition: transform 0.5s ease;
          }

          .cube-card:hover .cube-img {
            transform: scale(1.03);
          }

          /* ── Features Section ── */
          .home-features {
            position: relative;
            z-index: 2;
            max-width: 1200px;
            margin: 0 auto;
            padding: 4rem 1.5rem 6rem;
          }

          .home-features-title {
            font-family: 'Outfit', sans-serif;
            font-size: clamp(1.8rem, 3.5vw, 2.5rem);
            font-weight: 800;
            color: #f1f5f9;
            text-align: center;
            margin-bottom: 3rem;
            letter-spacing: -0.02em;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
          }

          .feature-card {
            background: rgba(15, 23, 42, 0.5);
            border: 1px solid rgba(148, 163, 184, 0.1);
            border-radius: 20px;
            padding: 2rem;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--accent), transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .feature-card:hover {
            transform: translateY(-6px);
            border-color: rgba(139, 92, 246, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }

          .feature-card:hover::before {
            opacity: 1;
          }

          .feature-icon {
            width: 48px;
            height: 48px;
            border-radius: 14px;
            display: grid;
            place-items: center;
            font-size: 1.4rem;
            margin-bottom: 1.25rem;
            background: var(--accent-bg);
            border: 1px solid var(--accent-border);
          }

          .feature-card-title {
            font-family: 'Outfit', sans-serif;
            font-size: 1.15rem;
            font-weight: 700;
            color: #f1f5f9;
            margin-bottom: 0.6rem;
          }

          .feature-card-desc {
            font-size: 0.9rem;
            color: #94a3b8;
            line-height: 1.7;
          }

          /* ── Footer ── */
          .home-footer {
            position: relative;
            z-index: 5;
            background: rgba(6, 8, 26, 0.95);
            border-top: 1px solid rgba(139, 92, 246, 0.12);
          }

          .footer-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 1.5rem 2rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 2.5rem;
            align-items: center;
          }

          .footer-brand-section { text-align: left; }
          .footer-social-section { text-align: center; }
          .footer-contact-section { text-align: right; }

          .footer-brand-name {
            font-family: 'Outfit', sans-serif;
            font-size: 1.4rem;
            font-weight: 800;
            margin-bottom: 0.6rem;
            background: linear-gradient(135deg, #818cf8, #c084fc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .footer-brand-desc {
            color: #64748b;
            font-size: 0.9rem;
            line-height: 1.6;
          }

          .footer-socials {
            display: flex;
            gap: 0.75rem;
            justify-content: center;
          }

          .footer-social-btn {
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

          .footer-social-btn:hover {
            background: rgba(99, 102, 241, 0.15);
            border-color: rgba(99, 102, 241, 0.3);
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
          }

          .footer-social-btn img {
            width: 20px;
            height: 20px;
            filter: brightness(0) invert(1);
            opacity: 0.7;
            transition: opacity 0.3s;
          }

          .footer-social-btn:hover img {
            opacity: 1;
          }

          .footer-contact-email {
            color: #a78bfa;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.95rem;
            transition: color 0.3s;
          }

          .footer-contact-email:hover {
            color: #c4b5fd;
          }

          .footer-copyright {
            color: #475569;
            font-size: 0.8rem;
            margin-top: 0.5rem;
          }

          /* ── Responsive ── */
          @media (max-width: 968px) {
            .home-hero {
              grid-template-columns: 1fr;
              text-align: center;
              min-height: auto;
              padding-top: 3rem;
            }
            .home-hero-content { order: 1; }
            .home-hero-visual { order: 2; }
            .home-hero-desc { margin-left: auto; margin-right: auto; }
            .home-cta-group { justify-content: center; }
            .cube-showcase-wrapper { max-width: 380px; }
            .home-hero-badge { margin-left: auto; margin-right: auto; }

            .footer-brand-section,
            .footer-social-section,
            .footer-contact-section {
              text-align: center;
            }
          }

          @media (max-width: 480px) {
            .home-cta-group { flex-direction: column; align-items: stretch; }
            .home-cta-primary, .home-cta-secondary { justify-content: center; }
            .features-grid { grid-template-columns: 1fr; }
          }
        `}
      </style>

      <div className="home-page">
        <SiteNavigation />

        {/* ── Hero ── */}
        <section className="home-hero" ref={heroRef}>
          <div className="home-hero-content">
            <div className="home-hero-badge">
              <span className="badge-dot" />
              University of Moratuwa — Hardware Project
            </div>

            <h1 className="home-hero-title">
              Welcome to<br />
              <span className="title-gradient">SonicGlow Cube</span>
            </h1>

            <p className="home-hero-desc">
              <strong>SonicGlow Cube</strong> is an innovative 3D LED display system
              designed to light up your world with dynamic patterns, animations, and custom text.
              Explore pre-designed effects or create your own!
            </p>

            <div className="home-cta-group">
              <button onClick={() => handleNavigation("/cube")} className="home-cta-primary">
                <span>Get Started</span>
                <span className="cta-arrow">→</span>
              </button>
              <button onClick={() => handleNavigation("/about")} className="home-cta-secondary">
                Meet the Team
              </button>
            </div>
          </div>

          <div className="home-hero-visual">
            <div className="cube-showcase-wrapper">
              <div className="cube-glow-ring" />
              <div className="cube-card">
                <img
                  src="/images/soniccube1.png"
                  alt="SonicGlow LED Cube"
                  className="cube-img"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="home-features">
          <h2 className="home-features-title">What Makes It Special</h2>
          <div className="features-grid">
            {[
              {
                icon: '🎨',
                title: 'Dynamic Patterns',
                desc: 'Choose from 10+ pre-designed LED animations including rain, spiral, wave, and fireworks effects.',
                accent: '#6366f1',
                accentBg: 'rgba(99, 102, 241, 0.1)',
                accentBorder: 'rgba(99, 102, 241, 0.2)'
              },
              {
                icon: '✏️',
                title: 'Custom Text Display',
                desc: 'Send your own text messages to be displayed on the 3D LED cube in real-time.',
                accent: '#8b5cf6',
                accentBg: 'rgba(139, 92, 246, 0.1)',
                accentBorder: 'rgba(139, 92, 246, 0.2)'
              },
              {
                icon: '📡',
                title: 'Wireless Control',
                desc: 'Control your cube wirelessly via WebSocket — no cables needed. Just connect and create.',
                accent: '#a855f7',
                accentBg: 'rgba(168, 85, 247, 0.1)',
                accentBorder: 'rgba(168, 85, 247, 0.2)'
              }
            ].map((f, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  '--accent': f.accent,
                  '--accent-bg': f.accentBg,
                  '--accent-border': f.accentBorder,
                  animationDelay: `${i * 0.15}s`
                }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-card-title">{f.title}</h3>
                <p className="feature-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="home-footer">
          <div className="footer-inner">
            <div className="footer-brand-section">
              <h3 className="footer-brand-name">SonicGlow Cube</h3>
              <p className="footer-brand-desc">
                Created by Hardware Hackers<br />
                University of Moratuwa — First-Year Hardware Project
              </p>
            </div>

            <div className="footer-social-section">
              <div className="footer-socials">
                {[
                  { href: "https://www.facebook.com/", src: "/images/fb.png", alt: "Facebook" },
                  { href: "https://www.youtube.com/", src: "/images/youtube.png", alt: "YouTube" },
                  { href: "https://www.linkedin.com/", src: "/images/linkedin.png", alt: "LinkedIn" },
                  { href: "https://www.instagram.com/", src: "/images/inst.png", alt: "Instagram" }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="footer-social-btn" title={s.alt}>
                    <img src={s.src} alt={s.alt} />
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-contact-section">
              <p>
                <a href="mailto:hardwarehackers@uom.lk" className="footer-contact-email">
                  hardwarehackers@uom.lk
                </a>
              </p>
              <p className="footer-copyright">© 2025 SonicGlow Cube | All rights reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Home;