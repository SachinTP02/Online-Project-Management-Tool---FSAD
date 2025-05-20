import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import { FaTasks, FaUsers, FaCalendarAlt, FaChartLine, FaCloudUploadAlt, FaBell, FaUserShield } from 'react-icons/fa';
import Lottie from 'lottie-react';
import dashboard3D from '../assets/3d-dashboard.json';

const features = [
  {
    icon: <FaTasks className="feature-icon" />,
    title: 'Project Planner',
    desc: 'Create detailed task lists, schedule tasks, assign members, and automate notifications.'
  },
  {
    icon: <FaChartLine className="feature-icon" />,
    title: 'Project Reporting',
    desc: 'Track weekly/monthly progress, view, email, and print project status reports.'
  },
  {
    icon: <FaCloudUploadAlt className="feature-icon" />,
    title: 'Online Storage',
    desc: 'Centralized file sharing and management for efficient collaboration.'
  },
  {
    icon: <FaCalendarAlt className="feature-icon" />,
    title: 'Calendars',
    desc: 'Work calendar with holidays and important project dates.'
  },
  {
    icon: <FaBell className="feature-icon" />,
    title: 'Email Alerts',
    desc: 'Automated email alerts for important project events and deadlines.'
  },
  {
    icon: <FaUserShield className="feature-icon" />,
    title: 'Administration',
    desc: 'Admin facilities to manage users, interactions, and complaints.'
  }
];

export default function LandingPage() {
  // Animated counter logic
  const stats = [25, 34, 19, 27];
  const statRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    statRefs.forEach((ref, idx) => {
      const end = stats[idx];
      if (!ref.current) return;
      const duration = 32000 + idx * 4000; // MUCH SLOWER: 5x previous
      const step = Math.max(1, Math.ceil(end / (duration / 16)));
      let current = 0;
      const animate = () => {
        current += step;
        if (current > end) current = end;
        ref.current.textContent = current;
        if (current < end) {
          requestAnimationFrame(animate);
        }
      };
      ref.current.textContent = 0;
      animate();
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="landing-root landing-revamp">
      <header className="landing-header landing-revamp-header">
        <div className="logo-title landing-revamp-logo">
          <span className="logo-circle">OPM</span>
        </div>
        <nav className="landing-nav landing-revamp-nav">
          <Link to="/login" className="nav-btn">Login</Link>
          <Link to="/register" className="nav-btn nav-btn-primary">Register</Link>
        </nav>
      </header>
      <main className="landing-main">
        <section className="revamp-hero">
          {/* 3D Background Animation */}
          <div className="revamp-3d-bg" style={{ top: '120px', filter: 'none' }}>
            <Lottie
              animationData={dashboard3D}
              loop={true}
              style={{ width: '520px', height: '520px', filter: 'none', opacity: 1 }}
            />
          </div>
          <div className="revamp-hero-content">
            <h1 className="revamp-title">Online Project Management</h1>
            <h2 className="revamp-subtitle">Plan. Collaborate. Deliver.</h2>
            <p className="revamp-desc">A web-based enterprise project management application that helps organizations plan, execute and deliver on their entire portfolio of projects.</p>
            <div className="revamp-cta-row">
              <Link to="/register" className="revamp-cta-btn">Get Started</Link>
              <Link to="/login" className="revamp-cta-link">Already have an account?</Link>
            </div>
          </div>
          <div className="revamp-hero-visual">
            <div className="revamp-hero-circlecard">
              <div className="revamp-circle-main">
                <span ref={statRefs[0]} className="revamp-circle-num">0</span>
                <div className="revamp-circle-label">Projects</div>
              </div>
              <div className="revamp-circle-row">
                <div className="revamp-circle-sub">
                  <span ref={statRefs[1]} className="revamp-circle-num">0</span>
                  <div className="revamp-circle-label">Tasks</div>
                </div>
                <div className="revamp-circle-sub">
                  <span ref={statRefs[2]} className="revamp-circle-num">0</span>
                  <div className="revamp-circle-label">Milestones</div>
                </div>
                <div className="revamp-circle-sub">
                  <span ref={statRefs[3]} className="revamp-circle-num">0</span>
                  <div className="revamp-circle-label">Meetings</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="features-section revamp-features">
          <div className="revamp-features-grid">
            {features.map((f, i) => (
              <div className="revamp-feature-card" key={i}>
                <div className="revamp-feature-icon">{f.icon}</div>
                <div className="revamp-feature-content">
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer className="landing-footer revamp-footer">
        <p>&copy; {new Date().getFullYear()} Online Project Management. All rights reserved.</p>
      </footer>
    </div>
  );
}
