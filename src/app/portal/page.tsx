'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Laptop, ShieldAlert, Check, Globe, 
  Cpu, Zap, Phone, Database, AlertCircle, ArrowLeft 
} from 'lucide-react';

export default function PortalPage() {
  // --- Portal Authentication State ---
  const [portalStep, setPortalStep] = useState<'login' | 'dashboard'>('login');
  const [portalAccountNo, setPortalAccountNo] = useState('');
  const [portalMobileNo, setPortalMobileNo] = useState('');
  const [portalLoginError, setPortalLoginError] = useState<string | null>(null);

  // --- New Ticket Form State ---
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketCategory, setNewTicketCategory] = useState('Broadband (Fibre)');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);

  // --- Complaints Data List (State-managed) ---
  const [complaints, setComplaints] = useState([
    {
      id: "CP-84920",
      date: "2026-06-18",
      category: "Broadband (Fibre)",
      title: "Intermittent speed drops",
      description: "Fiber line connection speed drops down below 5Mbps during evening peak hours.",
      status: "Resolved",
      solution: "Local fiber distribution hub node recalibrated and optic line gains optimized by local field technician."
    },
    {
      id: "CP-85102",
      date: "2026-07-02",
      category: "PEOTV",
      title: "HD channels freezing",
      description: "Premium HD channels freezing intermittently with high packet losses.",
      status: "In Progress",
      solution: "Assigned technician node check in progress at the central office. Remote firmware update pushed to the set-top-box."
    }
  ]);

  // --- Authentication Handler ---
  const handlePortalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPortalLoginError(null);

    // Validate 10-digit number requirements
    const acctRegex = /^\d{10}$/;
    const mobRegex = /^\d{10}$/;

    if (!acctRegex.test(portalAccountNo)) {
      setPortalLoginError("Please enter a valid 10-digit Account Number (e.g. 1029485721).");
      return;
    }
    if (!mobRegex.test(portalMobileNo)) {
      setPortalLoginError("Please enter a valid 10-digit Mobile Number (e.g. 0712345678).");
      return;
    }

    setPortalStep('dashboard');
  };

  const handlePortalLogout = () => {
    setPortalStep('login');
    setPortalAccountNo('');
    setPortalMobileNo('');
    setPortalLoginError(null);
  };

  // --- Ticket Creation Handler ---
  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !newTicketDesc.trim()) return;

    const newId = `CP-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date().toISOString().split('T')[0];

    const ticket = {
      id: newId,
      date: today,
      category: newTicketCategory,
      title: newTicketTitle,
      description: newTicketDesc,
      status: "Pending",
      solution: "Ticket logged. Our engineering desk is currently assigning a technical officer to analyze your connection node."
    };

    setComplaints([ticket, ...complaints]);
    setNewTicketTitle('');
    setNewTicketDesc('');
    setShowTicketSuccess(true);
    
    // Clear success banner after 3 seconds
    setTimeout(() => {
      setShowTicketSuccess(false);
    }, 3000);
  };

  return (
    <div className="portal-bg">
      <div className="portal-wrapper">
        
        {/* ========================================================================= */}
        {/* HEADER BRANDING */}
        {/* ========================================================================= */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: 'var(--cyan)',
                borderRadius: '50%',
                boxShadow: '0 0 10px var(--cyan)',
              }}
            />
            <span
              style={{
                fontWeight: 800,
                fontSize: '20px',
                letterSpacing: '0.2em',
                background: 'linear-gradient(90deg, #fff, var(--cyan))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SLT QUANTUM GATEWAY
            </span>
          </div>

          <Link href="/">
            <button className="btn-cyber" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', padding: '8px 16px' }}>
              <ArrowLeft size={12} />
              Return to Holo Grid
            </button>
          </Link>
        </header>

        {/* ========================================================================= */}
        {/* PORTAL STEP 1: AUTHENTICATION */}
        {/* ========================================================================= */}
        {portalStep === 'login' && (
          <div className="glass-panel portal-login-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Laptop size={22} className="glow-text-cyan" />
              <h1 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscriber Access</h1>
            </div>

            <form onSubmit={handlePortalLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                Access your SLT billing dashboard, review node connection status, log complaints, and view dispatched technical solutions.
              </p>

              {portalLoginError && (
                <div style={{ background: 'rgba(255, 0, 127, 0.1)', border: '1px solid var(--magenta)', color: 'var(--magenta)', padding: '12px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={16} />
                  <span>{portalLoginError}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  SLT Account Number (10 Digits)
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 1029485721"
                  value={portalAccountNo}
                  onChange={(e) => setPortalAccountNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="cyber-input"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Registered Mobile Number
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 0712345678"
                  value={portalMobileNo}
                  onChange={(e) => setPortalMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="cyber-input"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-cyber" 
                style={{ width: '100%', padding: '12px', marginTop: '10px' }}
              >
                Access Self-Care Dashboard
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* PORTAL STEP 2: DASHBOARD (SPLIT DUAL COLUMN) */}
        {/* ========================================================================= */}
        {portalStep === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Account connection details banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '16px 24px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)' }}>CONNECTED SUBSCRIBER</span>
                <strong style={{ fontSize: '14px', color: '#fff' }}>Acct: {portalAccountNo} | Mob: {portalMobileNo}</strong>
              </div>
              <button 
                onClick={handlePortalLogout}
                className="btn-cyber" 
                style={{ fontSize: '10px', padding: '8px 16px', borderColor: 'var(--magenta)', color: 'var(--magenta)', boxShadow: 'none' }}
              >
                Disconnect / Sign Out
              </button>
            </div>

            {/* Split layout columns */}
            <div className="portal-grid-split">
              
              {/* LEFT COLUMN: TICKET HISTORY FEED */}
              <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket History Log ({complaints.length})</h2>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)' }}>SELF_CARE // CORE</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
                  {complaints.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '40px' }}>No previous tickets found.</p>
                  ) : (
                    complaints.map((item) => (
                      <div key={item.id} className={`info-card ${item.status === 'Resolved' ? 'cyan-featured' : item.status === 'In Progress' ? 'magenta-featured' : 'violet-featured'}`} style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <span style={{ fontSize: '9px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)' }}>{item.date} // TICKET: {item.id}</span>
                            <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: '2px 0 4px 0' }}>{item.title}</h4>
                            <span style={{ fontSize: '10px', color: 'var(--cyan)', textTransform: 'uppercase', fontWeight: '600', fontFamily: 'var(--font-geist-mono)' }}>{item.category}</span>
                          </div>
                          <span className={`badge ${item.status === 'Resolved' ? 'badge-resolved' : item.status === 'In Progress' ? 'badge-progress' : 'badge-pending'}`}>
                            {item.status}
                          </span>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5, marginTop: '8px' }}>
                          <strong>Issue Logged:</strong> {item.description}
                        </p>

                        {item.solution && (
                          <div className="solution-box">
                            <span style={{ display: 'block', fontSize: '9px', fontWeight: 'bold', color: item.status === 'Resolved' ? '#00ff7f' : '#ffaa00', textTransform: 'uppercase', fontFamily: 'var(--font-geist-mono)', marginBottom: '4px' }}>
                              Dispatched Resolution Status
                            </span>
                            <p style={{ fontSize: '12px', color: '#fff', lineHeight: 1.4 }}>
                              {item.solution}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: FILE COMPLAINT TICKET */}
              <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Log Support Ticket</h2>
                </div>

                <form onSubmit={handleAddComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {showTicketSuccess && (
                    <div style={{ background: 'rgba(0, 255, 127, 0.1)', border: '1px solid #00ff7f', color: '#00ff7f', padding: '12px', borderRadius: '6px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={16} />
                      <span>Support Ticket successfully submitted! View the updated logs grid on the left.</span>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Affected Service Category
                    </label>
                    <select 
                      value={newTicketCategory} 
                      onChange={(e) => setNewTicketCategory(e.target.value)}
                      className="cyber-select"
                    >
                      <option value="Broadband (Fibre)">Fixed Broadband & Fibre FTTx</option>
                      <option value="PEOTV">PEOTV & IPTV Entertainment</option>
                      <option value="Cloud / SME Hosting">Enterprise Cloud Hosting / Domain IP</option>
                      <option value="Mobile Connections">SLT-Mobitel Mobile LTE/5G</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Brief Summary of Issue
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. Fibre Router red light indicator blinking"
                      value={newTicketTitle}
                      onChange={(e) => setNewTicketTitle(e.target.value)}
                      className="cyber-input"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'var(--font-geist-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Full Problem Description
                    </label>
                    <textarea 
                      rows={5}
                      placeholder="Explain what happened. (Include detail description, e.g. router restarts when downloading, phone line noise, particular channel freezes, mcash limits exceeded, etc.)"
                      value={newTicketDesc}
                      onChange={(e) => setNewTicketDesc(e.target.value)}
                      className="cyber-textarea"
                      style={{ resize: 'none' }}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-cyber" 
                    style={{ width: '100%', padding: '12px', marginTop: '10px' }}
                  >
                    Log Support Ticket
                  </button>
                </form>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
