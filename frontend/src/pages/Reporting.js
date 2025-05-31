import React, { useState, useEffect } from 'react';
import { FaChartLine } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import axios from 'axios';

const mockReports = [
    { id: 1, title: 'Sprint 1 Report', summary: 'Completed initial setup and UI design.', date: '2025-05-15' },
    { id: 2, title: 'Sprint 2 Report', summary: 'Backend API implemented.', date: '2025-05-22' },
];

export default function Reporting() {
    const [reports] = useState(mockReports);
    const [selectedPeriods, setSelectedPeriods] = useState({});
    const [user, setUser] = useState(null);
    const [showName, setShowName] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');
        if (token && storedUsername) {
            setUser({ username: storedUsername });
        } else {
            setUser(null);
        }
    }, []);

    const handlePeriodChange = (reportId, value) => {
        setSelectedPeriods((prev) => ({ ...prev, [reportId]: value }));
    };

    const handleDownload = async (reportId) => {
        const period = selectedPeriods[reportId] || 'Weekly';
        try {

            const token = localStorage.getItem('token');

            const res = await axios.post(
                'http://localhost:8080/api/v1/reports/download',
                { projectId: reportId, period: period, email: "reddeboinasoujanya@gmail.com" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob',
                }
            );

            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${reportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error downloading report:', err);
            alert('Failed to download report.');
        }
    };

    const handleDownloadOption = async (reportId, option) => {
        const period = selectedPeriods[reportId] || 'Weekly';
        const email = "reddeboinasoujanya@gmail.com";
        const token = localStorage.getItem('token');

        try {
            if (option === 'direct') {
                await handleDownload(reportId);
            } else if (option === 'email') {
                const response = await axios.post(
                    'http://localhost:8080/api/v1/reports/email',
                    {
                        projectId: reportId,
                        period: period,
                        email: email,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    alert('PDF report sent to your email.');
                } else {
                    alert('⚠️ Report request succeeded but unexpected response.');
                }
            }
        } catch (err) {
            console.error('Error during report handling:', err);
            if (option === 'email') {
                alert('Failed to send PDF via email. Please try again.');
            } else {
                alert('Failed to download report.');
            }
        }
    };

    return (
        <div className="feature-page revamp-main-bg" style={{ minHeight: '100vh', padding: 0, background: '#f1f5f9' }}>
            <header className="landing-header landing-revamp-header" style={{
                width: '100vw',
                margin: 0,
                paddingTop: '2.5rem', // Increased top padding
                paddingBottom: '1.5rem', // Increased bottom padding
                left: 0,
                right: 0,
                borderRadius: 0,
                position: 'relative',
                boxSizing: 'border-box',
                background: '#fff',
                borderBottom: '1.5px solid #e0e7ef',
                zIndex: 10
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: 26,
                            cursor: 'pointer',
                            marginLeft: 0,
                            marginRight: '1.5rem',
                            color: '#2563eb',
                            padding: 0,
                            lineHeight: 1,
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        aria-label="Back"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5 19L9 12L15.5 5" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <div className="logo-title landing-revamp-logo">
                        <span className="logo-circle">OPM</span>
                    </div>
                </div>
                <nav className="landing-nav landing-revamp-nav">
                    {user ? (
                        <div className="landing-user-info">
                            <span
                                className="landing-user-avatar revamp-user-avatar"
                                onClick={() => setShowName(v => !v)}
                                style={{ cursor: 'pointer' }}
                                title="Show name"
                            >
                                {user.username[0].toUpperCase()}
                            </span>
                            {showName && (
                                <span className="landing-user-name">{user.username}</span>
                            )}
                            <button
                                className="nav-btn"
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('username');
                                    setUser(null);
                                    navigate('/');
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className="nav-btn nav-btn-primary" onClick={() => navigate('/login')} style={{ marginRight: 12 }}>Login</button>
                            <button className="nav-btn" onClick={() => navigate('/register')}>Register</button>
                        </>
                    )}
                </nav>
            </header>
            <div className="revamp-header-row" style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                borderRadius: '1.1rem',
                boxShadow: '0 2px 8px 0 rgba(44,62,80,0.06)',
                border: '1.5px solid #e0e7ef',
                padding: '1.5rem 2.2rem',
                marginBottom: 28,
                marginTop: 0,
                marginLeft: 0,
                position: 'relative',
                overflow: 'visible',
                gap: 24,
                width: '100%',
                maxWidth: '100%',
                justifyContent: 'flex-start',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18, width: '100%' }}>
                    <div style={{
                        width: 54,
                        height: 54,
                        borderRadius: '50%',
                        background: '#f3f4f6',
                        boxShadow: '0 1px 4px #e0e7ef',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16,
                        border: '1.5px solid #e0e7ef',
                        flexShrink: 0,
                    }}>
                        <FaChartLine style={{ fontSize: 28, color: '#3b82f6' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 className="revamp-title" style={{
                            fontSize: '1.45rem',
                            fontWeight: 800,
                            color: '#232946',
                            marginBottom: 2,
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>Project Reporting</h2>
                        <div style={{ color: '#6c6f7b', fontWeight: 500, fontSize: '1.08rem', marginTop: 2, letterSpacing: '0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            View, download, or email project reports.
                        </div>
                    </div>
                </div>
            </div>
            <div style={{
                background: 'linear-gradient(90deg, #f8fafc 60%, #e0e7ef 100%)',
                borderRadius: 16,
                boxShadow: '0 4px 18px #e0e7ef',
                border: '1.5px solid #dbeafe',
                padding: 32,
                maxWidth: 1000,
                margin: '0 auto 32px auto',
                position: 'relative',
                transition: 'box-shadow 0.2s, transform 0.2s',
                overflow: 'hidden',
            }}>
                <table className="feature-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #e0e7ef' }}>
                    <thead style={{ background: '#f1f5f9' }}>
                        <tr>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Date</th>
                            <th style={thStyle}>Summary</th>
                            <th style={thStyle}>Period</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={tdStyle}>{r.title}</td>
                                <td style={tdStyle}>{r.date}</td>
                                <td style={{ ...tdStyle, maxWidth: 300, wordBreak: 'break-word' }}>{r.summary}</td>
                                <td style={tdStyle}>
                                    <select
                                        onChange={(e) => handlePeriodChange(r.id, e.target.value)}
                                        value={selectedPeriods[r.id] || 'Weekly'}
                                        style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: '#fff', fontSize: 14 }}
                                    >
                                        <option value="Weekly">Weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        <select
                                            onChange={(e) => handleDownloadOption(r.id, e.target.value)}
                                            defaultValue=""
                                            style={{ padding: '6px 10px', borderRadius: 6, fontSize: 14, background: '#10b981', color: '#fff' }}
                                        >
                                            <option disabled value="">Download</option>
                                            <option value="direct">Download PDF</option>
                                            <option value="email">Email PDF</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    padding: '14px 18px',
    fontWeight: 700,
    color: '#334155',
    fontSize: 16,
};

const tdStyle = {
    padding: '12px 18px',
    fontSize: 15,
};