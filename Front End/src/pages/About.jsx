import React, { useState } from 'react';
import SiteNavigation from '../SiteNavigation';

function About() {
  const [imageErrors, setImageErrors] = useState({});
  const [socialIconErrors, setSocialIconErrors] = useState({});

  const handleImageError = (memberIndex) => {
    setImageErrors((prev) => ({ ...prev, [memberIndex]: true }));
  };

  const handleSocialIconError = (iconIndex) => {
    setSocialIconErrors((prev) => ({ ...prev, [iconIndex]: true }));
  };

  const teamMembers = [
    {
      name: "Manusha",
      image: "/images/manusha.jpg",
      role: "Hardware & 3D Modeling Lead",
      description: "Specializes in power supply assembly and LED layer connectivity. Responsible for 3D modeling and user input pattern recognition systems.",
      skills: ["Power Supply Assembly", "LED Layer Connection", "3D Modeling", "Pattern Recognition"],
      contact: "manusha@hardwarehackers.uom.lk"
    },
    {
      name: "Vishmi",
      image: "/images/vishmi.jpg",
      role: "PCB & Circuit Specialist",
      description: "Focuses on PCB design and assembly, control switch implementation, and user input pattern recognition for seamless cube operation.",
      skills: ["PCB Design", "Circuit Assembly", "Switch Control", "Pattern Recognition"],
      contact: "vishmi@hardwarehackers.uom.lk"
    },
    {
      name: "Umesha",
      image: "/images/umesha.jpg",
      role: "Firmware & Web Architect",
      description: "Handles NodeMCU configuration and programming, LED cube construction, and web interface development for remote control.",
      skills: ["NodeMCU Programming", "LED Cube Construction", "Web Development", "Interface Design"],
      contact: "umesha@hardwarehackers.uom.lk"
    },
    {
      name: "Sailendra",
      image: "/images/saile.jpg",
      role: "Embedded Systems Engineer",
      description: "Manages Arduino board configuration, remote controller setup, pattern creation, and web interface implementation.",
      skills: ["Arduino Programming", "Remote Control", "Pattern Creation", "Web Interface"],
      contact: "sailendra@hardwarehackers.uom.lk"
    }
  ];

  const projectStats = [
    { number: "4", label: "Team Members", icon: "👥" },
    { number: "1st", label: "Year Undergraduates", icon: "🎓" },
    { number: "512", label: "LEDs Managed", icon: "💡" },
    { number: "100+", label: "Hours Invested", icon: "⚡" }
  ];

  const achievements = [
    {
      title: "Innovation Award",
      description: "Best Hardware Project - Faculty of IT 2025",
      icon: "🏆",
      tag: "1st Place"
    },
    {
      title: "Technical Excellence",
      description: "Outstanding Use of 3D LED Matrix Technology",
      icon: "⚡",
      tag: "Engineering"
    },
    {
      title: "Team Collaboration",
      description: "Exemplary Teamwork in Hardware Development",
      icon: "🤝",
      tag: "Teamwork"
    },
    {
      title: "Creative Design",
      description: "Most Creative Volumetric Visual Display System",
      icon: "🎨",
      tag: "Design"
    }
  ];

  const timelineMilestones = [
    {
      date: "Weeks 1-2",
      title: "Concept & Planning",
      desc: "Initial brainstorming, feasibility research, matrix architecture, and project scope definition."
    },
    {
      date: "Weeks 3-6",
      title: "Design & Prototyping",
      desc: "Schematic design, PCB layout drafting, 3D jig fabrication, and component sourcing."
    },
    {
      date: "Weeks 7-10",
      title: "Development & Assembly",
      desc: "Layer-by-layer LED grid soldering (512 points), controller integration, and power testing."
    },
    {
      date: "Weeks 11-14",
      title: "Firmware & Optimization",
      desc: "NodeMCU firmware programming, animation algorithm math, and WebSocket frame streaming."
    },
    {
      date: "Weeks 15-16",
      title: "Web Platform & Launch",
      desc: "Full responsive control dashboard, documentation, and live showcase presentation."
    }
  ];

  const socialLinks = [
    { href: "https://www.facebook.com/", text: "FB", alt: "Facebook", icon: "/images/fb.png" },
    { href: "https://www.youtube.com/", text: "YT", alt: "YouTube", icon: "/images/youtube.png" },
    { href: "https://www.linkedin.com/", text: "LI", alt: "LinkedIn", icon: "/images/linkedin.png" },
    { href: "https://www.instagram.com/", text: "IG", alt: "Instagram", icon: "/images/inst.png" }
  ];

  return (
    <>
      <style>{`
        .about-page {
          min-height: 100vh;
          background: #06081a;
          color: #f1f5f9;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .about-bg-glow {
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.16) 0%, transparent 45%),
            radial-gradient(circle at 85% 40%, rgba(168, 85, 247, 0.14) 0%, transparent 45%),
            radial-gradient(circle at 50% 85%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .about-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem 6rem;
        }

        /* ── Hero Section ── */
        .about-hero {
          text-align: center;
          margin-bottom: 4.5rem;
          animation: fadeInDown 0.7s ease-out;
        }

        .about-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1.2rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(139, 92, 246, 0.35);
          color: #c4b5fd;
          margin-bottom: 1.5rem;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.15);
        }

        .about-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #818cf8;
          box-shadow: 0 0 10px #818cf8;
          animation: pulseDot 2s infinite ease-in-out;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .about-hero-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #f1f5f9;
          margin-bottom: 1.25rem;
          line-height: 1.15;
        }

        .about-hero-title .title-gradient {
          background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .about-hero-subtitle {
          font-size: 1.2rem;
          font-weight: 600;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .about-hero-desc {
          max-width: 720px;
          margin: 0 auto 2.5rem;
          font-size: 1.05rem;
          color: #94a3b8;
          line-height: 1.8;
        }

        .univ-card {
          display: inline-flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1.25rem 2.25rem;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(139, 92, 246, 0.25);
          backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .univ-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          color: #f1f5f9;
        }

        .univ-fac {
          font-size: 0.9rem;
          color: #818cf8;
          font-weight: 600;
        }

        .univ-sub {
          font-size: 0.8rem;
          color: #64748b;
        }

        /* ── Stats Section ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 5.5rem;
        }

        .stat-card {
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.18);
          border-radius: 20px;
          padding: 2rem 1.5rem;
          text-align: center;
          transition: all 0.35s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(168, 85, 247, 0.45);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35), 0 0 25px rgba(99, 102, 241, 0.15);
        }

        .stat-card:hover::before {
          opacity: 1;
        }

        .stat-icon {
          font-size: 1.75rem;
          margin-bottom: 0.6rem;
        }

        .stat-num {
          font-family: 'Outfit', sans-serif;
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-text {
          font-size: 0.9rem;
          color: #94a3b8;
          font-weight: 600;
        }

        /* ── Section Titles ── */
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-heading {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(1.8rem, 3.5vw, 2.5rem);
          font-weight: 800;
          color: #f1f5f9;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .section-desc {
          color: #94a3b8;
          font-size: 0.95rem;
        }

        /* ── Team Grid ── */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.75rem;
          margin-bottom: 5.5rem;
        }

        .member-card {
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.18);
          border-radius: 24px;
          padding: 2.25rem 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .member-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.14), transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .member-card:hover {
          transform: translateY(-6px);
          border-color: rgba(168, 85, 247, 0.45);
          box-shadow:
            0 20px 45px rgba(0, 0, 0, 0.4),
            0 0 35px rgba(99, 102, 241, 0.2);
        }

        .member-card:hover::before {
          opacity: 1;
        }

        .member-avatar-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .member-avatar {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          border: 3px solid #818cf8;
          box-shadow: 0 0 20px rgba(129, 140, 248, 0.4);
          overflow: hidden;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #1e1b4b, #312e81);
          color: #c4b5fd;
          font-family: 'Outfit', sans-serif;
          font-size: 1.75rem;
          font-weight: 800;
        }

        .member-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .member-info {
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .member-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.35rem;
          font-weight: 800;
          color: #f1f5f9;
          margin-bottom: 0.25rem;
        }

        .member-role {
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #a855f7;
          margin-bottom: 0.75rem;
        }

        .member-description {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        .member-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .skill-tag {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.25);
          color: #c4b5fd;
        }

        .member-contact {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.82rem;
          color: #818cf8;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .contact-link:hover {
          color: #c084fc;
          text-decoration: underline;
        }

        /* ── Achievements Section ── */
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 5.5rem;
        }

        .achievement-card {
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(139, 92, 246, 0.18);
          border-radius: 20px;
          padding: 1.75rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .achievement-card:hover {
          transform: translateY(-4px);
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
        }

        .achievement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .achievement-icon {
          font-size: 2rem;
        }

        .achievement-tag {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.25rem 0.65rem;
          border-radius: 999px;
          background: rgba(234, 179, 8, 0.12);
          border: 1px solid rgba(234, 179, 8, 0.3);
          color: #fde047;
        }

        .achievement-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.4rem;
        }

        .achievement-description {
          font-size: 0.88rem;
          color: #94a3b8;
          line-height: 1.5;
        }

        /* ── Project Timeline ── */
        .timeline-wrapper {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          padding-left: 2rem;
        }

        .timeline-wrapper::before {
          content: '';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 3px;
          background: linear-gradient(180deg, #6366f1, #8b5cf6, #ec4899);
          border-radius: 999px;
        }

        .timeline-node {
          position: relative;
          margin-bottom: 2rem;
        }

        .timeline-node:last-child {
          margin-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          left: -2rem;
          top: 6px;
          transform: translateX(-50%);
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #818cf8;
          border: 3px solid #06081a;
          box-shadow: 0 0 10px #818cf8;
        }

        .timeline-card {
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(139, 92, 246, 0.18);
          border-radius: 18px;
          padding: 1.5rem 1.75rem;
          transition: all 0.3s ease;
        }

        .timeline-card:hover {
          border-color: rgba(168, 85, 247, 0.4);
          transform: translateX(4px);
        }

        .timeline-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .timeline-date {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #a855f7;
          background: rgba(168, 85, 247, 0.1);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
        }

        .timeline-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .timeline-desc {
          font-size: 0.9rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-25px); }
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem 2.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2.5rem;
          align-items: center;
        }

        .footer-brand {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .footer-desc {
          color: #64748b;
          font-size: 0.88rem;
          line-height: 1.6;
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
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: rgba(139, 92, 246, 0.08);
          border: 1px solid rgba(139, 92, 246, 0.15);
          color: #c4b5fd;
          font-weight: 700;
          font-size: 0.85rem;
          text-decoration: none;
          transition: all 0.25s ease;
        }

        .footer-social-btn:hover {
          background: rgba(139, 92, 246, 0.22);
          border-color: rgba(139, 92, 246, 0.45);
          transform: translateY(-2px);
          color: #ffffff;
        }

        .footer-social-img {
          width: 20px;
          height: 20px;
          object-fit: contain;
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
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .footer-email:hover {
          color: #c084fc;
        }

        .footer-copy {
          color: #475569;
          font-size: 0.82rem;
          margin-top: 0.5rem;
        }
      `}</style>

      <div className="about-page">
        <div className="about-bg-glow" />
        <SiteNavigation />

        <div className="about-container">
          {/* Hero Section */}
          <section className="about-hero">
            <div className="about-badge">
              <span className="about-badge-dot" />
              <span>Undergraduate Engineering Team</span>
            </div>
            <h1 className="about-hero-title">
              Meet the <span className="title-gradient">Hardware Hackers</span>
            </h1>
            <p className="about-hero-subtitle">First-Year Innovators • Faculty of Information Technology</p>
            <p className="about-hero-desc">
              We are a passionate team of four undergraduate students from the University of Moratuwa.
              Our mission is to push the boundaries of embedded hardware innovation through creative
              engineering, elegant software interfaces, and volumetric light control.
            </p>

            <div className="univ-card">
              <span className="univ-title">University of Moratuwa</span>
              <span className="univ-fac">Faculty of Information Technology</span>
              <span className="univ-sub">Semester 2 Hardware Project • SonicGlow 3D LED Cube</span>
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-grid">
            {projectStats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-num">{stat.number}</div>
                <div className="stat-text">{stat.label}</div>
              </div>
            ))}
          </section>

          {/* Team Members Section */}
          <section>
            <div className="section-header">
              <h2 className="section-heading">Our Engineering Team</h2>
              <p className="section-desc">The minds behind the soldering iron, schematics, and firmware algorithms</p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member, idx) => (
                <div key={idx} className="member-card">
                  <div>
                    <div className="member-avatar-wrapper">
                      <div className="member-avatar">
                        {!imageErrors[idx] ? (
                          <img
                            src={member.image}
                            alt={member.name}
                            onError={() => handleImageError(idx)}
                          />
                        ) : (
                          member.name.split(' ').map((n) => n[0]).join('')
                        )}
                      </div>
                    </div>

                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      {member.role && <div className="member-role">{member.role}</div>}
                      <p className="member-description">{member.description}</p>
                    </div>
                  </div>

                  <div>
                    <div className="member-skills">
                      {member.skills.map((skill, skillIdx) => (
                        <span key={skillIdx} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="member-contact">
                      <a href={`mailto:${member.contact}`} className="contact-link">
                        <span>✉</span>
                        <span>{member.contact}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements Section */}
          <section>
            <div className="section-header">
              <h2 className="section-heading">Project Milestones & Accolades</h2>
              <p className="section-desc">Recognition received during the development and demonstration phases</p>
            </div>

            <div className="achievements-grid">
              {achievements.map((item, idx) => (
                <div key={idx} className="achievement-card">
                  <div className="achievement-header">
                    <span className="achievement-icon">{item.icon}</span>
                    <span className="achievement-tag">{item.tag}</span>
                  </div>
                  <h3 className="achievement-title">{item.title}</h3>
                  <p className="achievement-description">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Project Timeline Section */}
          <section>
            <div className="section-header">
              <h2 className="section-heading">The Development Journey</h2>
              <p className="section-desc">From initial ideation to final volumetric hardware deployment</p>
            </div>

            <div className="timeline-wrapper">
              {timelineMilestones.map((node, idx) => (
                <div key={idx} className="timeline-node">
                  <span className="timeline-dot" />
                  <div className="timeline-card">
                    <div className="timeline-meta">
                      <span className="timeline-date">{node.date}</span>
                      <h3 className="timeline-title">{node.title}</h3>
                    </div>
                    <p className="timeline-desc">{node.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="page-footer">
          <div className="footer-inner">
            <div>
              <div className="footer-brand">SonicGlow Cube</div>
              <p className="footer-desc">
                Created by Hardware Hackers<br />
                Faculty of Information Technology • University of Moratuwa
              </p>
            </div>

            <div className="footer-social-section">
              <div className="footer-socials">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    title={social.alt}
                  >
                    {!socialIconErrors[idx] ? (
                      <img
                        src={social.icon}
                        alt={social.alt}
                        className="footer-social-img"
                        onError={() => handleSocialIconError(idx)}
                      />
                    ) : (
                      <span>{social.text}</span>
                    )}
                  </a>
                ))}
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
}

export default About;