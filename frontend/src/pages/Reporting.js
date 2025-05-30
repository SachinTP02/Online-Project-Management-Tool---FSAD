import React, { useState } from 'react';
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
    const navigate = useNavigate();

    const handlePeriodChange = (reportId, value) => {
        setSelectedPeriods((prev) => ({ ...prev, [reportId]: value }));
    };

    const handleView = async (reportId) => {
        const period = selectedPeriods[reportId] || 'Weekly';
        try {
            const token = localStorage.getItem('token');

            const res = await axios.post(
                'http://localhost:8080/api/v1/reports',
                {
                    projectId: 1,
                    period: period,
                    email: "reddeboinasoujanya@gmail.com",
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'blob',
                }
            );

            const file = new Blob([res.data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);

            window.open(fileURL);

        } catch (err) {
            console.error('Error viewing report:', err);
            alert('Failed to fetch report.');
        }
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

    const handleViewOption = async (reportId, option) => {
        if (option === 'inline') {
            await handleView(reportId);
        } else if (option === 'email') {
            const email = prompt("Enter your email to receive the summary:");
            try {
                await axios.post('http://localhost:8080/api/v1/reports/email', {
                    projectId: reportId,
                    period: selectedPeriods[reportId] || 'Weekly',
                    email: email,
                });
                alert('Report summary sent to your email.');
            } catch (err) {
                console.error('Error emailing summary:', err);
                alert('Failed to email report summary.');
            }
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
        <div className="feature-page">
            <div className="revamp-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaChartLine className="feature-icon" style={{ fontSize: 36, color: '#3b82f6', marginRight: 12 }} />
                    <h2 className="revamp-title">Project Reporting</h2>
                </div>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 22px',
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: 'pointer',
                        boxShadow: '0 1px 4px #dbeafe',
                        marginLeft: 16,
                        marginRight: 12,
                    }}
                >
                    Back to Home
                </button>
            </div>

            <div style={{ maxWidth: 1000, margin: '32px auto' }}>
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
                                        onChange={(e) => handleViewOption(r.id, e.target.value)}
                                        defaultValue=""
                                        style={{ padding: '6px 10px', borderRadius: 6, fontSize: 14, background: '#3b82f6', color: '#fff' }}
                                    >
                                        <option disabled value="">View</option>
                                        <option value="inline">View Inline</option>
                                    </select>
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