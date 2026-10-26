import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './SiteNavigation.css';

const links = [
  { to: '/', label: 'Home', icon: '⌂', end: true },
  { to: '/cube', label: 'Cube', icon: '▣' },
  { to: '/patternselector', label: 'Patterns', icon: '✦' },
  { to: '/about', label: 'About', icon: '◈' },
];

function SiteNavigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!e.target.closest('.site-nav')) setMenuOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [menuOpen]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (to, end) => {
    if (to === '/cube') return pathname === '/cube' || pathname === '/section1';
    if (to === '/patternselector') {
      return ['/patternselector', '/predefined', '/usertext'].includes(pathname);
    }
    return end ? pathname === to : pathname.startsWith(to);
  };

  return (
    <nav className={`site-nav${scrolled ? ' is-scrolled' : ''}`} aria-label="Main navigation">
      <div className="site-nav-inner">
        {/* Brand / Logo */}
        <NavLink to="/" className="site-nav-brand" onClick={() => setMenuOpen(false)}>
          <span className="site-nav-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </span>
          <span className="site-nav-brand-text">
            Sonic<span className="brand-glow">Glow</span>
          </span>
        </NavLink>

        {/* Hamburger Toggle */}
        <button
          className={`site-nav-toggle${menuOpen ? ' is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="site-nav-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation Links */}
        <div
          className={`site-nav-links${menuOpen ? ' is-open' : ''}`}
          id="site-nav-links"
        >
          {links.map(({ to, label, icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={`site-nav-link${isActive(to, end) ? ' is-active' : ''}`}
              aria-current={isActive(to, end) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              <span className="nav-link-icon" aria-hidden="true">{icon}</span>
              <span className="nav-link-label">{label}</span>
              {isActive(to, end) && <span className="nav-link-indicator" />}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {menuOpen && <div className="site-nav-backdrop" onClick={() => setMenuOpen(false)} />}
    </nav>
  );
}

export default SiteNavigation;
