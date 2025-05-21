import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FaTasks, FaUsers, FaCalendarAlt, FaChartLine, FaCloudUploadAlt, FaBell, FaUserShield } from 'react-icons/fa';
import Lottie from 'lottie-react';
import dashboard3D from '../assets/3d-dashboard.json';
import Login from './Login';
import Register from './Register';

const features = [
	{
		icon: <FaTasks className="feature-icon" />,
		title: 'Project Planner',
		desc: 'Create detailed task lists, schedule tasks, assign members, and automate notifications.',
	},
	{
		icon: <FaChartLine className="feature-icon" />,
		title: 'Project Reporting',
		desc: 'Track weekly/monthly progress, view, email, and print project status reports.',
	},
	{
		icon: <FaCloudUploadAlt className="feature-icon" />,
		title: 'Online Storage',
		desc: 'Centralized file sharing and management for efficient collaboration.',
	},
	{
		icon: <FaCalendarAlt className="feature-icon" />,
		title: 'Calendars',
		desc: 'Work calendar with holidays and important project dates.',
	},
	{
		icon: <FaBell className="feature-icon" />,
		title: 'Email Alerts',
		desc: 'Automated email alerts for important project events and deadlines.',
	},
	{
		icon: <FaUserShield className="feature-icon" />,
		title: 'Administration',
		desc: 'Admin facilities to manage users, interactions, and complaints.',
	},
];

const featureRoutes = [
	'/planner',
	'/reporting',
	'/storage',
	'/calendar',
	null, // Email Alerts (no direct page)
	'/admin',
];

export default function LandingPage() {
	// Animated counter logic
	const stats = [25, 34, 19, 27];
	const statRefs = [useRef(), useRef(), useRef(), useRef()];

	const [showLogin, setShowLogin] = useState(false);
	const [showRegister, setShowRegister] = useState(false);
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	// Check for user on mount and when login state changes
	useEffect(() => {
		const token = localStorage.getItem('token');
		const storedUsername = localStorage.getItem('username');
		if (token && storedUsername) {
			setUser({ username: storedUsername });
		} else {
			setUser(null);
		}
	}, [showLogin]);

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
					{user ? (
						<div className="landing-user-info">
							<span className="landing-user-avatar">{user.username[0]}</span>
							<span className="landing-user-name">{user.username}</span>
							<button
								className="nav-btn"
								onClick={() => {
									localStorage.removeItem('token');
									localStorage.removeItem('username');
									setUser(null);
								}}
							>
								Logout
							</button>
						</div>
					) : (
						<>
							<button className="nav-btn" onClick={() => setShowLogin(true)}>
								Login
							</button>
							<button className="nav-btn nav-btn-primary" onClick={() => setShowRegister(true)}>
								Register
							</button>
						</>
					)}
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
						<p className="revamp-desc">
							A web-based enterprise project management application that helps organizations plan, execute and deliver on
							their entire portfolio of projects.
						</p>
						<div className="revamp-cta-row">
							<button className="revamp-cta-btn" onClick={() => setShowRegister(true)}>
								Get Started
							</button>
							<button className="revamp-cta-link" onClick={() => setShowLogin(true)}>
								Already have an account?
							</button>
						</div>
					</div>
					<div className="revamp-hero-visual">
						<div className="revamp-hero-circlecard">
							<div className="revamp-circle-main">
								<span ref={statRefs[0]} className="revamp-circle-num">
									0
								</span>
								<div className="revamp-circle-label">Projects</div>
							</div>
							<div className="revamp-circle-row">
								<div className="revamp-circle-sub">
									<span ref={statRefs[1]} className="revamp-circle-num">
										0
									</span>
									<div className="revamp-circle-label">Tasks</div>
								</div>
								<div className="revamp-circle-sub">
									<span ref={statRefs[2]} className="revamp-circle-num">
										0
									</span>
									<div className="revamp-circle-label">Milestones</div>
								</div>
								<div className="revamp-circle-sub">
									<span ref={statRefs[3]} className="revamp-circle-num">
										0
									</span>
									<div className="revamp-circle-label">Meetings</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<section className="features-section revamp-features">
					<div className="revamp-features-grid">
						{features.map((f, i) => (
							<div
								className={`revamp-feature-card${featureRoutes[i] ? ' clickable' : ''}`}
								key={i}
								onClick={() => {
									if (featureRoutes[i]) navigate(featureRoutes[i]);
								}}
								style={featureRoutes[i] ? { cursor: 'pointer' } : {}}
							>
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
			{/* Dialog overlays for Login/Register */}
			{showLogin && (
				<div className="landing-dialog-overlay" onClick={() => setShowLogin(false)}>
					<div className="landing-dialog landing-dialog-custom" onClick={(e) => e.stopPropagation()}>
						<Login
							onSuccess={(username) => {
								setShowLogin(false);
								setUser({ username });
								localStorage.setItem('username', username);
							}}
							customUI
						/>
						<button className="landing-dialog-close" onClick={() => setShowLogin(false)}>
							&times;
						</button>
					</div>
				</div>
			)}
			{showRegister && (
				<div className="landing-dialog-overlay" onClick={() => setShowRegister(false)}>
					<div className="landing-dialog landing-dialog-custom" onClick={(e) => e.stopPropagation()}>
						<Register
							onSuccess={() => {
								setShowRegister(false);
								setShowLogin(true);
							}}
							customUI
						/>
						<button className="landing-dialog-close" onClick={() => setShowRegister(false)}>
							&times;
						</button>
					</div>
				</div>
			)}
			<footer className="landing-footer revamp-footer">
				<p>
					&copy; {new Date().getFullYear()} Online Project Management. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
