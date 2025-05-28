import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { FaTasks, FaCalendarAlt, FaChartLine, FaCloudUploadAlt, FaBell, FaUserShield } from 'react-icons/fa';
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
	{
		icon: <FaUserShield className="feature-icon" />,
		title: 'Milestones',
		desc: 'Add Milestones.',
	},
];

const featureRoutes = [
	'/planner',
	'/reporting',
	'/storage',
	'/calendar',
	null, // Email Alerts (no direct page)
	'/admin',
	'/milestones',
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
        		if (!ref.current) return;
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

	// Handle feature card clicks - only allow if user is logged in
	const handleFeatureClick = (route) => {
		if (!user) {
			// User not logged in - show login modal instead
			setShowLogin(true);
			return;
		}
		// User is logged in - navigate to the route
		if (route) {
			navigate(route);
		}
	};

	// Handle "Get Started" button click
	const handleGetStartedClick = () => {
		if (user) {
			// User is logged in - navigate to dashboard
			navigate('/dashboard');
		} else {
			// User not logged in - show register modal
			setShowRegister(true);
		}
	};

	return (
		<div className="landing-root landing-revamp">
			{/* Doodle SVG watermark background for project management/corporate theme - always visible, behind all content */}
			<div className="landing-doodle-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none', opacity: 0.85 }}>
				<svg viewBox="0 0 1920 1080" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100vw', height: '100vh', display: 'block' }}>
					<g stroke="#b6c2d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
						{/* Doodle: calendar */}
						<rect x="120" y="80" width="120" height="90" rx="16" />
						<line x1="120" y1="110" x2="240" y2="110" />
						<circle cx="140" cy="130" r="7" />
						<circle cx="170" cy="130" r="7" />
						<circle cx="200" cy="130" r="7" />
						{/* Doodle: pie chart */}
						<circle cx="350" cy="200" r="40" />
						<path d="M350 200 L390 200 A40 40 0 0 0 350 160 Z" />
						{/* Doodle: task list */}
						<rect x="1600" y="120" width="140" height="80" rx="14" />
						<line x1="1620" y1="150" x2="1720" y2="150" />
						<rect x="1620" y="170" width="18" height="18" rx="4" />
						<line x1="1640" y1="179" x2="1720" y2="179" />
						{/* Doodle: document */}
						<rect x="300" y="900" width="90" height="120" rx="12" />
						<line x1="320" y1="930" x2="370" y2="930" />
						<line x1="320" y1="950" x2="370" y2="950" />
						{/* Doodle: chat bubble */}
						<ellipse cx="1700" cy="950" rx="60" ry="38" />
						<ellipse cx="1700" cy="950" rx="40" ry="20" fill="#e0e7ef" />
						{/* Doodle: milestone flag */}
						<rect x="900" y="900" width="60" height="18" rx="6" />
						<polygon points="960,900 990,909 960,918" />
						{/* Additional doodles for more visual interest */}
						{/* Bar chart */}
						<rect x="600" y="800" width="18" height="60" rx="4" />
						<rect x="630" y="830" width="18" height="30" rx="4" />
						<rect x="660" y="810" width="18" height="50" rx="4" />
						{/* Clock */}
						<circle cx="1550" cy="300" r="32" />
						<line x1="1550" y1="300" x2="1550" y2="275" />
						<line x1="1550" y1="300" x2="1570" y2="300" />
						{/* Lightbulb (idea) */}
						<ellipse cx="1800" cy="400" rx="22" ry="30" />
						<line x1="1800" y1="430" x2="1800" y2="450" />
						<line x1="1790" y1="450" x2="1810" y2="450" />
						{/* Laptop */}
						<rect x="1200" y="800" width="70" height="30" rx="6" />
						<rect x="1210" y="830" width="50" height="10" rx="2" />
						{/* Teamwork (three heads) */}
						<circle cx="500" cy="1000" r="18" />
						<circle cx="540" cy="1000" r="18" />
						<circle cx="520" cy="1040" r="18" />
						{/* Cloud */}
						<ellipse cx="300" cy="400" rx="40" ry="18" />
						<ellipse cx="340" cy="400" rx="20" ry="10" />
						{/* Pen (edit) */}
						<rect x="1700" y="700" width="60" height="10" rx="4" transform="rotate(-20 1700 700)" />
						<rect x="1750" y="690" width="10" height="20" rx="3" />
						{/* More doodles for extra density and visibility */}
						{/* Trophy (achievement) */}
						<rect x="800" y="100" width="40" height="60" rx="10" />
						<ellipse cx="820" cy="100" rx="20" ry="10" />
						<line x1="820" y1="160" x2="820" y2="180" />
						{/* Star (success) */}
						<polygon points="1500,800 1507,818 1526,818 1511,830 1517,848 1500,838 1483,848 1489,830 1474,818 1493,818" />
						{/* Graph/line chart */}
						<polyline points="200,600 300,550 400,650 500,500 600,700" />
						{/* Folder */}
						<rect x="1100" y="200" width="70" height="40" rx="8" />
						<rect x="1100" y="190" width="40" height="20" rx="6" />
						{/* Bell (notification) */}
						<ellipse cx="1800" cy="800" rx="18" ry="22" />
						<rect x="1792" y="822" width="16" height="8" rx="3" />
						{/* Magnifier (search) */}
						<circle cx="300" cy="700" r="18" />
						<line x1="312" y1="712" x2="330" y2="730" />
						{/* User avatar */}
						<circle cx="170" cy="900" r="22" />
						<ellipse cx="170" cy="930" rx="18" ry="10" />
						{/* Checklist */}
						<rect x="1400" y="600" width="60" height="80" rx="10" />
						<line x1="1410" y1="620" x2="1450" y2="620" />
						<line x1="1410" y1="640" x2="1450" y2="640" />
						<rect x="1410" y="660" width="12" height="12" rx="3" />
						<rect x="1430" y="660" width="12" height="12" rx="3" />
					</g>
				</svg>
			</div>
			{/* Modal overlays for Login/Register */}
			{showLogin && (
				<div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, boxShadow: '0 2px 16px #cbd5e1', position: 'relative' }}>
						<button onClick={() => setShowLogin(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
						<Login onSuccess={(usernameOrSwitch) => {
							if (usernameOrSwitch === 'register') {
								setShowLogin(false); setShowRegister(true);
								return;
							}
							if (usernameOrSwitch) {
								setUser({ username: usernameOrSwitch });
								setShowLogin(false);
								navigate('/dashboard');
							}
						}} />
					</div>
				</div>
			)}
			{showRegister && (
				<div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<div className="modal-content" style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 340, boxShadow: '0 2px 16px #cbd5e1', position: 'relative' }}>
						<button onClick={() => setShowRegister(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
						<Register onSuccess={(switchTo) => {
							if (switchTo === 'login') {
								setShowRegister(false); setShowLogin(true);
								return;
							}
							setShowRegister(false);
						}} />
					</div>
				</div>
			)}
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
							<button className="nav-btn nav-btn-primary" onClick={() => setShowLogin(true)} style={{ marginRight: 12 }}>Login</button>
							<button className="nav-btn" onClick={() => setShowRegister(true)}>Register</button>
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
							<button className="revamp-cta-btn" onClick={handleGetStartedClick}>
								{user ? 'Go to Dashboard' : 'Get Started'}
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
				<section className="roadmap-section">
					<div className="roadmap-vertical">
						{/* SVG roadmap line for row arrangement */}
						<svg className="roadmap-zigzag-svg" width="100%" height={Math.ceil(features.length / 3) * 320 + 100} style={{ height: `${Math.ceil(features.length / 3) * 320 + 100}px` }}>
							{(() => {
								// Row arrangement: 3 tiles, then 2, then remaining
								const rowYs = [100, 520, 940]; // Increased vertical spacing between rows
								const rowXs = [
									[180, 450, 720], // 3 tiles
									[315, 585],      // 2 tiles
									[450]            // fallback for any remaining
								];
								let d = '';
								let prevX = null, prevY = null;
								let idx = 0;
								for (let row = 0; idx < features.length && row < rowYs.length; row++) {
									const y = rowYs[row];
									for (let col = 0; col < rowXs[row].length && idx < features.length; col++, idx++) {
										const x = rowXs[row][col];
										if (prevX !== null && prevY !== null) {
											// Draw a smooth curve from previous to current
											d += `M${prevX},${prevY} C${prevX},${(prevY + y) / 2} ${x},${(prevY + y) / 2} ${x},${y} `;
										}
										prevX = x;
										prevY = y;
									}
								}
								return <path d={d} />;
							})()}
						</svg>
						{/* Render tiles in rows: 3, 2, remaining */}
						{(() => {
							const rows = [[], [], []];
							let idx = 0;
							for (let row = 0; idx < features.length && row < 3; row++) {
								const count = row === 0 ? 3 : (row === 1 ? 2 : features.length - 5);
								for (let col = 0; col < count && idx < features.length; col++, idx++) {
									rows[row].push(idx);
								}
							}
							// Remove top positioning, let rows stack naturally
							return rows.flatMap((rowIdxs, row) =>
								<div className="roadmap-row" key={row}>
									{rowIdxs.map((featureIdx, col) => (
										<div
											className="roadmap-step"
											key={featureIdx}
											tabIndex={0}
											style={{
												width: '160px',
												maxWidth: '90vw',
												opacity: !user && featureRoutes[featureIdx] ? 0.7 : 1,
												pointerEvents: featureRoutes[featureIdx] ? 'auto' : 'none',
												outline: 'none',
											}}
											onClick={() => featureRoutes[featureIdx] && handleFeatureClick(featureRoutes[featureIdx])}
										>
											<div className="roadmap-dot" style={{ left: '50%', transform: 'translateX(-50%)' }} />
											<div className="roadmap-content">
												<div className="roadmap-feature-icon">{features[featureIdx].icon}</div>
												<div className="roadmap-feature-title">{features[featureIdx].title}</div>
												<div className="roadmap-feature-desc">{features[featureIdx].desc}</div>
											</div>
										</div>
									))}
								</div>
							);
						})()}
					</div>
				</section>
			</main>
			<footer className="landing-footer revamp-footer">
				<p>
					&copy; {new Date().getFullYear()} Online Project Management. All rights reserved.
				</p>
			</footer>
		</div>
	);
}
