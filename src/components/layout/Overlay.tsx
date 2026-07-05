'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, Cpu, Radio, Zap, Activity, ShieldAlert, 
  Search, X, Check, Laptop, Smartphone, Tv, Database, ArrowRight 
} from 'lucide-react';

interface OverlayProps {
  currentSection: number;
  waveParamsRef: React.MutableRefObject<{
    frequency: number;
    amplitude: number;
    speed: number;
  }>;
}

export default function Overlay({ currentSection, waveParamsRef }: OverlayProps) {
  // --- Modulator Sliders & Ref Syncing ---
  const [freq, setFreq] = useState(1.5);
  const [amp, setAmp] = useState(0.4);
  const [spd, setSpd] = useState(1.2);

  useEffect(() => {
    waveParamsRef.current.frequency = freq;
  }, [freq, waveParamsRef]);

  useEffect(() => {
    waveParamsRef.current.amplitude = amp;
  }, [amp, waveParamsRef]);

  useEffect(() => {
    waveParamsRef.current.speed = spd;
  }, [spd, waveParamsRef]);

  // --- Sub-Tab State per Section ---
  const [activeTabSec1, setActiveTabSec1] = useState<'fibre' | 'adsl' | 'lte'>('fibre');
  const [activeTabSec2, setActiveTabSec2] = useState<'peotv' | 'vod' | 'ott'>('peotv');
  const [activeTabSec3, setActiveTabSec3] = useState<'biz' | 'cloud' | 'security'>('cloud');
  const [activeTabSec4, setActiveTabSec4] = useState<'mobile' | 'mcash'>('mobile');

  // --- Modals State ---
  const [showBroadbandModal, setShowBroadbandModal] = useState(false);
  const [showChannelsModal, setShowChannelsModal] = useState(false);
  const [broadbandSearch, setBroadbandSearch] = useState('');
  const [selectedPlanSuccess, setSelectedPlanSuccess] = useState<string | null>(null);

  // --- SME/Cloud Hosting Configurator State ---
  const [cpuCores, setCpuCores] = useState(2);
  const [ramGb, setRamGb] = useState(8);
  const [storageGb, setStorageGb] = useState(250);
  const [hostingPrice, setHostingPrice] = useState(0);

  // Calculate pricing based on CPU, RAM, and Storage
  useEffect(() => {
    const basePrice = 2500;
    const cpuCost = cpuCores * 1500;
    const ramCost = ramGb * 800;
    const storageCost = Math.round((storageGb / 10) * 150);
    setHostingPrice(basePrice + cpuCost + ramCost + storageCost);
  }, [cpuCores, ramGb, storageGb]);

  // --- Live Telemetry Data ---
  const [telemetry, setTelemetry] = useState({
    bandwidth: 984.3,
    latency: 1.8,
    activeNodes: 14209,
    efficiency: 99.98,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => ({
        bandwidth: Number((980 + Math.random() * 10).toFixed(1)),
        latency: Number((1.5 + Math.random() * 0.5).toFixed(2)),
        activeNodes: prev.activeNodes + (Math.random() > 0.5 ? 1 : -1),
        efficiency: Number((99.95 + Math.random() * 0.04).toFixed(2)),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // --- Mock Data ---
  const broadbandPlans = [
    { id: 'bb1', name: 'Fiber Flash', category: 'fibre', speed: '100 Mbps', quota: '20 GB (Daily)', price: 'LKR 1,490/mo', popular: false },
    { id: 'bb2', name: 'Fiber Family', category: 'fibre', speed: '100 Mbps', quota: '150 GB', price: 'LKR 2,690/mo', popular: true },
    { id: 'bb3', name: 'Fiber Unlimited 100', category: 'fibre', speed: '100 Mbps', quota: 'Unlimited (No FUP)', price: 'LKR 5,990/mo', popular: false },
    { id: 'bb4', name: 'Megaline Home', category: 'adsl', speed: '21 Mbps', quota: 'Unlimited (Off-Peak)', price: 'LKR 990/mo', popular: false },
    { id: 'bb5', name: 'Megaline Office', category: 'adsl', speed: '21 Mbps', quota: '100 GB', price: 'LKR 1,890/mo', popular: false },
    { id: 'bb6', name: 'LTE Entry', category: 'lte', speed: '4G Wireless', quota: '50 GB', price: 'LKR 1,190/mo', popular: false },
    { id: 'bb7', name: 'LTE Family', category: 'lte', speed: '4G Wireless', quota: '120 GB', price: 'LKR 2,290/mo', popular: true },
  ];

  const peotvPlans = [
    { name: 'PEO Entry', channels: '70+ Channels', price: 'LKR 990/mo', desc: 'Ideal starting pack with local and key entertainment channels.' },
    { name: 'PEO Family', channels: '100+ Channels', price: 'LKR 1,490/mo', desc: 'Tailored for everyone with movies, kids, and international news.' },
    { name: 'PEO Premium', channels: '140+ Channels', price: 'LKR 2,490/mo', desc: 'All premium HD channels, sports, and educational networks.' },
  ];

  const channelCategories = [
    { name: 'Sports', channels: ['Sony Sports 1 HD', 'Sony Sports 2', 'Star Sports Select', 'Ten Sports'] },
    { name: 'Movies', channels: ['HBO HD', 'Warner TV', 'Star Movies', 'Cinema World'] },
    { name: 'Kids', channels: ['Cartoon Network', 'Nickelodeon', 'Disney Channel', 'Pogo'] },
    { name: 'News', channels: ['CNN International', 'BBC World News', 'Al Jazeera', 'CNA'] }
  ];

  // Dynamic values for Section 4 carrier details
  const getCarrierType = (f: number) => {
    const freqMhz = Math.round(900 + (f - 0.2) * (3500 - 900) / 3.8);
    if (freqMhz >= 3000) return `5G Ultra-Wideband (${freqMhz} MHz)`;
    if (freqMhz >= 1700) return `LTE-Advanced Pro (${freqMhz} MHz)`;
    return `Standard LTE / 3G (${freqMhz} MHz)`;
  };

  const getSignalStrength = (a: number) => {
    if (a >= 0.7) return { label: 'Excellent', color: 'var(--cyan)' };
    if (a >= 0.4) return { label: 'Good', color: 'var(--violet)' };
    return { label: 'Poor / Searching...', color: 'var(--magenta)' };
  };

  const handleSelectPlan = (name: string) => {
    setSelectedPlanSuccess(name);
    setTimeout(() => setSelectedPlanSuccess(null), 3000);
  };

  return (
    <div style={{ position: 'relative', width: '100%', pointerEvents: 'none', zIndex: 10 }}>
      
      {/* ========================================================================= */}
      {/* 1. HUD / TOP HEADER */}
      {/* ========================================================================= */}
      <header
        className="glass-hud"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          padding: '16px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto',
          zIndex: 100,
        }}
      >
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
              fontSize: '18px',
              letterSpacing: '0.2em',
              background: 'linear-gradient(90deg, #fff, var(--cyan))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SLT QUANTUM
          </span>
        </div>

        {/* HUD Telemetry Stats */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            fontSize: '11px',
            fontFamily: 'var(--font-geist-mono)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
          className="hud-stats-container"
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Throughput</span>
            <span style={{ color: 'var(--cyan)', fontWeight: 'bold' }}>{telemetry.bandwidth} Gbps</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Latency</span>
            <span style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>{telemetry.latency} ms</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>Spectral Efficiency</span>
            <span style={{ color: '#fff', fontWeight: 'bold' }}>{telemetry.efficiency}%</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }} className="hud-nodes-stat">
            <span>Nodes Connected</span>
            <span style={{ color: 'var(--violet)', fontWeight: 'bold' }}>{telemetry.activeNodes}</span>
          </div>
        </div>

        <div>
          <button 
            className="btn-cyber" 
            style={{ fontSize: '11px', padding: '8px 16px' }}
            onClick={() => window.open('https://www.slt.lk/home', '_blank')}
          >
            SLT.LK PORTAL
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FLOATING INDICATORS (LEFT) */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          left: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          pointerEvents: 'auto',
          zIndex: 50,
        }}
      >
        {[0, 1, 2, 3].map((sec) => (
          <div
            key={sec}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              opacity: currentSection === sec ? 1 : 0.3,
              transition: 'opacity 0.4s ease',
            }}
            onClick={() => {
              window.scrollTo({
                top: sec * window.innerHeight,
                behavior: 'smooth',
              });
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: currentSection === sec ? 'var(--cyan)' : '#fff',
                boxShadow: currentSection === sec ? '0 0 10px var(--cyan)' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                fontFamily: 'var(--font-geist-mono)',
                color: currentSection === sec ? 'var(--cyan)' : '#fff',
                letterSpacing: '0.1em',
              }}
            >
              {sec === 0 && '01 // Broadband'}
              {sec === 1 && '02 // PEOTV'}
              {sec === 2 && '03 // Cloud/SME'}
              {sec === 3 && '04 // Mobile'}
            </span>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN SECTION SCROLL LAYOUT */}
      {/* ========================================================================= */}
      <div className="scroll-container">
        
        {/* ------------------------------------------------------------------------- */}
        {/* SECTION 1: Fixed Broadband & SLT Fiber (Globe) */}
        {/* ------------------------------------------------------------------------- */}
        <section className="scroll-section">
          <div className="glass-panel" style={{ maxWidth: '520px', padding: '40px', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Globe size={18} className="glow-text-cyan" />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cyan)' }}>
                Sector 01 // Fixed Broadband
              </span>
            </div>
            
            <h1 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              SLT Fiber & <br />Broadband Network
            </h1>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              High-speed fixed network infrastructure connecting homes and businesses across Sri Lanka with next-gen fiber optic pipelines.
            </p>

            {/* Sub Tabs */}
            <div className="sub-tabs">
              <button 
                className={`tab-btn ${activeTabSec1 === 'fibre' ? 'active' : ''}`}
                onClick={() => setActiveTabSec1('fibre')}
              >
                Fibre (FTTx)
              </button>
              <button 
                className={`tab-btn ${activeTabSec1 === 'adsl' ? 'active' : ''}`}
                onClick={() => setActiveTabSec1('adsl')}
              >
                Megaline (ADSL)
              </button>
              <button 
                className={`tab-btn ${activeTabSec1 === 'lte' ? 'active' : ''}`}
                onClick={() => setActiveTabSec1('lte')}
              >
                4G/LTE
              </button>
            </div>

            {/* Plan Display Card */}
            <div style={{ marginBottom: '24px' }}>
              {broadbandPlans
                .filter((p) => p.category === activeTabSec1 && p.popular)
                .map((plan) => (
                  <div key={plan.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(0, 240, 255, 0.2)', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--cyan)', textTransform: 'uppercase', fontWeight: 'bold' }}>Featured Package</span>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{plan.price}</span>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{plan.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', gap: '16px' }}>
                      <span>Speed: <strong>{plan.speed}</strong></span>
                      <span>Quota: <strong>{plan.quota}</strong></span>
                    </div>
                  </div>
                ))}
              {broadbandPlans
                .filter((p) => p.category === activeTabSec1 && !p.popular)
                .slice(0, 1)
                .map((plan) => (
                  <div key={plan.id} style={{ background: 'rgba(255, 255, 255, 0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Entry Pack</span>
                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>{plan.price}</span>
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{plan.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Speed: {plan.speed} | Quota: {plan.quota}
                    </div>
                  </div>
                ))}
            </div>

            <button 
              className="btn-cyber" 
              style={{ width: '100%' }}
              onClick={() => setShowBroadbandModal(true)}
            >
              Explore All Broadband Plans
            </button>
          </div>
        </section>

        {/* ------------------------------------------------------------------------- */}
        {/* SECTION 2: PEOTV & Digital Entertainment (Tunnel) */}
        {/* ------------------------------------------------------------------------- */}
        <section className="scroll-section" style={{ alignItems: 'flex-end' }}>
          <div className="glass-panel" style={{ maxWidth: '520px', padding: '40px', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Zap size={18} style={{ color: 'var(--magenta)' }} />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--magenta)' }}>
                Sector 02 // Digital IPTV
              </span>
            </div>
            
            <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              PEOTV & Digital <br />Entertainment
            </h2>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              Enjoy standard definition and high-definition channels, premium sports network nodes, and dedicated Video on Demand portals.
            </p>

            {/* Sub Tabs */}
            <div className="sub-tabs">
              <button 
                className={`tab-btn ${activeTabSec2 === 'peotv' ? 'active' : ''}`}
                onClick={() => setActiveTabSec2('peotv')}
              >
                PEOTV Plans
              </button>
              <button 
                className={`tab-btn ${activeTabSec2 === 'vod' ? 'active' : ''}`}
                onClick={() => setActiveTabSec2('vod')}
              >
                VOD & Filmhall
              </button>
              <button 
                className={`tab-btn ${activeTabSec2 === 'ott' ? 'active' : ''}`}
                onClick={() => setActiveTabSec2('ott')}
              >
                OTT Add-Ons
              </button>
            </div>

            {/* Content Switcher */}
            <div style={{ marginBottom: '24px', minHeight: '120px' }}>
              {activeTabSec2 === 'peotv' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {peotvPlans.slice(0, 2).map((pack, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{pack.name} ({pack.channels})</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pack.desc}</div>
                      </div>
                      <div style={{ color: 'var(--magenta)', fontWeight: 'bold', fontSize: '14px' }}>{pack.price}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTabSec2 === 'vod' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderLeft: '2px solid var(--magenta)', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Filmhall Unlimited</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>Access blockbusters, teledramas, and music videos.</div>
                    <div style={{ fontSize: '13px', color: 'var(--magenta)', fontWeight: 'bold' }}>LKR 199/mo</div>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderLeft: '2px solid var(--magenta)', borderRadius: '4px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Video-On-Demand (VOD) Library</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0' }}>Educational lectures, local movies, and documentaries.</div>
                    <div style={{ fontSize: '13px', color: 'var(--magenta)', fontWeight: 'bold' }}>LKR 299/mo</div>
                  </div>
                </div>
              )}

              {activeTabSec2 === 'ott' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 16px', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>YouTube Unlimited Add-on</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Continuous HD streaming for standard broadband lines</div>
                    </div>
                    <div style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>LKR 299</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)', padding: '10px 16px', borderRadius: '4px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>7xFun Add-on</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Unlimited WhatsApp, Viber, Messenger, Telegram, Spotify, at 4G speeds</div>
                    </div>
                    <div style={{ color: 'var(--magenta)', fontWeight: 'bold' }}>LKR 349</div>
                  </div>
                </div>
              )}
            </div>

            <button 
              className="btn-cyber" 
              style={{ 
                width: '100%',
                borderColor: 'var(--magenta)', 
                color: 'var(--magenta)', 
                boxShadow: '0 0 8px rgba(255,0,127,0.2)' 
              }}
              onClick={() => setShowChannelsModal(true)}
            >
              View Full Channel Lineup
            </button>
          </div>
        </section>

        {/* ------------------------------------------------------------------------- */}
        {/* SECTION 3: SME & Enterprise Cloud Solutions (City Grid) */}
        {/* ------------------------------------------------------------------------- */}
        <section className="scroll-section">
          <div className="glass-panel" style={{ maxWidth: '520px', padding: '40px', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Cpu size={18} style={{ color: 'var(--violet)' }} />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--violet)' }}>
                Sector 03 // Business & Cloud
              </span>
            </div>
            
            <h2 style={{ fontSize: '38px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em' }}>
              Enterprise & Cloud <br />Infrastructure
            </h2>

            {/* Sub Tabs */}
            <div className="sub-tabs" style={{ marginBottom: '16px' }}>
              <button 
                className={`tab-btn ${activeTabSec3 === 'biz' ? 'active' : ''}`}
                onClick={() => setActiveTabSec3('biz')}
              >
                SME Biz
              </button>
              <button 
                className={`tab-btn ${activeTabSec3 === 'cloud' ? 'active' : ''}`}
                onClick={() => setActiveTabSec3('cloud')}
              >
                Hosting Configurator
              </button>
              <button 
                className={`tab-btn ${activeTabSec3 === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTabSec3('security')}
              >
                Security (Kaspersky)
              </button>
            </div>

            {/* SME / CONFIGURATOR / SECURITY Dynamic Content */}
            <div style={{ minHeight: '220px' }}>
              {activeTabSec3 === 'biz' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                    Empower your start-up or micro business with robust connectivity solutions, virtual domain registrations, and cloud voice channels.
                  </p>
                  <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>SME Biz Fibre Lite</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0' }}>Uncapped bandwidth during business hours, 1 static IP address.</div>
                    <div style={{ fontSize: '13px', color: 'var(--violet)', fontWeight: 'bold' }}>LKR 4,990/mo</div>
                  </div>
                  <div style={{ border: '1px solid var(--border-color)', padding: '12px', borderRadius: '6px', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>Biz Cloud Office Suite</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0' }}>Includes 5 corporate emails, 50 GB cloud drive space, domain support.</div>
                    <div style={{ fontSize: '13px', color: 'var(--violet)', fontWeight: 'bold' }}>LKR 9,990/mo</div>
                  </div>
                </div>
              )}

              {activeTabSec3 === 'cloud' && (
                <div style={{ background: 'rgba(139, 92, 246, 0.03)', padding: '20px', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Database size={16} style={{ color: 'var(--violet)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Custom VM Configurator</span>
                  </div>

                  {/* CPU Slider */}
                  <div className="configurator-row">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Compute Cores</span>
                      <span>{cpuCores} vCPU</span>
                    </div>
                    <input 
                      type="range" min="1" max="16" step="1" 
                      value={cpuCores} 
                      onChange={(e) => setCpuCores(parseInt(e.target.value))}
                      className="configurator-slider"
                    />
                  </div>

                  {/* RAM Slider */}
                  <div className="configurator-row">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Memory Buffer</span>
                      <span>{ramGb} GB RAM</span>
                    </div>
                    <input 
                      type="range" min="2" max="64" step="2" 
                      value={ramGb} 
                      onChange={(e) => setRamGb(parseInt(e.target.value))}
                      className="configurator-slider"
                    />
                  </div>

                  {/* Storage Slider */}
                  <div className="configurator-row" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Solid State Storage</span>
                      <span>{storageGb} GB NVMe SSD</span>
                    </div>
                    <input 
                      type="range" min="50" max="2000" step="50" 
                      value={storageGb} 
                      onChange={(e) => setStorageGb(parseInt(e.target.value))}
                      className="configurator-slider"
                    />
                  </div>

                  {/* Calculated Price */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. Cost:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--violet)' }}>LKR {hostingPrice.toLocaleString()}/mo</span>
                  </div>
                </div>
              )}

              {activeTabSec3 === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                    Protect your computing nodes from malware threats and telemetry surveillance. Fully managed end-point security powered by Kaspersky.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Kaspersky internet Security (Home)</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>License for 3 devices, standard adware block.</div>
                    </div>
                    <div style={{ color: 'var(--violet)', fontWeight: 'bold' }}>LKR 150/mo</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Enterprise Secure Shield</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cloud-managed threat control console, endpoint logs.</div>
                    </div>
                    <div style={{ color: 'var(--violet)', fontWeight: 'bold' }}>LKR 1,200/mo</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------------- */}
        {/* SECTION 4: Mobile & mCash Modulator (Signal Modulator) */}
        {/* ------------------------------------------------------------------------- */}
        <section className="scroll-section" style={{ alignItems: 'center' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '620px', padding: '40px', pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Radio size={18} className="glow-text-cyan" />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--cyan)' }}>
                Sector 04 // 5G Carrier & mCash Modulator
              </span>
            </div>
            
            <h2 style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.1, marginBottom: '16px', letterSpacing: '-0.02em', textAlign: 'center' }}>
              Wireless & Mobile money Modulator
            </h2>

            {/* Sub Tabs */}
            <div className="sub-tabs" style={{ justifyContent: 'center', marginBottom: '24px' }}>
              <button 
                className={`tab-btn ${activeTabSec4 === 'mobile' ? 'active' : ''}`}
                onClick={() => setActiveTabSec4('mobile')}
              >
                Mobile connections
              </button>
              <button 
                className={`tab-btn ${activeTabSec4 === 'mcash' ? 'active' : ''}`}
                onClick={() => setActiveTabSec4('mcash')}
              >
                mCash Network
              </button>
            </div>

            {/* Left/Right layouts: Sliders and info details */}
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
              {/* Sliders (Controls the shader) */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontFamily: 'var(--font-geist-mono)' }}>
                    <span>Carrier Band Frequency</span>
                    <span style={{ color: 'var(--cyan)' }}>{getCarrierType(freq)}</span>
                  </div>
                  <input
                    type="range" min="0.2" max="4.0" step="0.05"
                    value={freq}
                    onChange={(e) => setFreq(parseFloat(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--cyan)',
                      background: 'rgba(255,255,255,0.1)',
                      height: '4px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontFamily: 'var(--font-geist-mono)' }}>
                    <span>Signal Transmit Gain</span>
                    <span style={{ color: 'var(--cyan)' }}>{(amp * 40).toFixed(0)} dB</span>
                  </div>
                  <input
                    type="range" min="0.05" max="1.0" step="0.02"
                    value={amp}
                    onChange={(e) => setAmp(parseFloat(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--cyan)',
                      background: 'rgba(255,255,255,0.1)',
                      height: '4px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', fontFamily: 'var(--font-geist-mono)' }}>
                    <span>Phase Signal Latency</span>
                    <span style={{ color: 'var(--cyan)' }}>{(4 / spd).toFixed(1)} ms</span>
                  </div>
                  <input
                    type="range" min="0.1" max="3.0" step="0.05"
                    value={spd}
                    onChange={(e) => setSpd(parseFloat(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--cyan)',
                      background: 'rgba(255,255,255,0.1)',
                      height: '4px',
                      borderRadius: '2px',
                      cursor: 'pointer',
                    }}
                  />
                </div>
              </div>

              {/* Status and Pack info */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '11px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Signal Status: </span>
                  <strong style={{ color: getSignalStrength(amp).color }}>{getSignalStrength(amp).label}</strong>
                </div>

                {activeTabSec4 === 'mobile' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <strong style={{ color: '#fff' }}>Digital Super Combo</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Unlimited Calls, SMS & 30 GB Internet.</div>
                      <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '11px', marginTop: '2px' }}>LKR 1,999 / 30 Days</div>
                    </div>
                    <div style={{ fontSize: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                      <strong style={{ color: '#fff' }}>Unlimited Social Add-on</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Facebook, Insta, TikTok, Whatsapp.</div>
                      <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '11px', marginTop: '2px' }}>LKR 499 / 30 Days</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '12px' }}>
                      <strong style={{ color: '#fff' }}>mCash Basic Wallet</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Top-up, send money, and withdraw up to LKR 10,000.</div>
                      <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '11px', marginTop: '2px' }}>LKR 0 Signup / No Fees</div>
                    </div>
                    <div style={{ fontSize: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                      <strong style={{ color: '#fff' }}>mCash Power Plus</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Utility bill settlements and insurance premiums.</div>
                      <div style={{ color: 'var(--cyan)', fontWeight: 'bold', fontSize: '11px', marginTop: '2px' }}>Fast digital signature verified</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 4. FOOTER STATUS BAR */}
      {/* ========================================================================= */}
      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          padding: '12px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9px',
          fontFamily: 'var(--font-geist-mono)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(3, 3, 7, 0.8)',
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>FPS: 60 / LOCK</span>
          <span>GPU: RENDERER // CORE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={10} style={{ color: 'var(--cyan)' }} />
          <span>Security link established // SECURE_SSL</span>
        </div>
        <div>
          <span>©2026 SLT-MOBITEL TECHNOLOGY GROUP</span>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 5. MODAL: ALL BROADBAND PLANS */}
      {/* ========================================================================= */}
      {showBroadbandModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-container" style={{ pointerEvents: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={20} className="glow-text-cyan" />
                <h3 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SLT Broadband Catalogue</h3>
              </div>
              <button 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={() => setShowBroadbandModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            {/* Search filter */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder="Search packages (e.g. Flash, Megaline, Unlimited...)"
                value={broadbandSearch}
                onChange={(e) => setBroadbandSearch(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '12px 16px 12px 40px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--text-muted)' }} />
            </div>

            {/* Selection notification */}
            {selectedPlanSuccess && (
              <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--cyan)', color: 'var(--cyan)', padding: '12px', borderRadius: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                <Check size={16} />
                <span>Simulated Order: Package <strong>{selectedPlanSuccess}</strong> activation code dispatched.</span>
              </div>
            )}

            {/* Packages Grid */}
            <div className="plan-grid">
              {broadbandPlans
                .filter((p) => p.name.toLowerCase().includes(broadbandSearch.toLowerCase()))
                .map((plan) => (
                  <div key={plan.id} className="plan-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                    {plan.popular && (
                      <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--cyan)', color: '#030307', fontSize: '8px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        Popular
                      </span>
                    )}
                    <div>
                      <span style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--cyan)', fontFamily: 'var(--font-geist-mono)' }}>
                        {plan.category}
                      </span>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 12px 0' }}>{plan.name}</h4>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Speed</span>
                          <strong style={{ color: '#fff' }}>{plan.speed}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Data Limit</span>
                          <strong style={{ color: '#fff' }}>{plan.quota}</strong>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--cyan)', marginBottom: '12px' }}>{plan.price}</div>
                      <button 
                        className="btn-cyber" 
                        style={{ width: '100%', fontSize: '11px', padding: '8px' }}
                        onClick={() => handleSelectPlan(plan.name)}
                      >
                        Activate Plan
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: PEOTV CHANNEL LINEUP */}
      {/* ========================================================================= */}
      {showChannelsModal && (
        <div className="modal-overlay">
          <div className="glass-panel modal-container" style={{ pointerEvents: 'auto', maxWidth: '720px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tv size={20} style={{ color: 'var(--magenta)' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PEOTV Channel Lineup</h3>
              </div>
              <button 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={() => setShowChannelsModal(false)}
              >
                <X size={24} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px', lineHeight: 1.5 }}>
              Choose packages containing premium HD networks. Here is the categorized broadcast selection:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {channelCategories.map((cat, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '16px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--magenta)', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'var(--font-geist-mono)' }}>
                    {cat.name} Category
                  </span>
                  <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {cat.channels.map((chan, cIdx) => (
                      <li key={cIdx} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                        <div style={{ width: '4px', height: '4px', background: 'var(--magenta)', borderRadius: '50%' }} />
                        <span>{chan}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button 
                className="btn-cyber" 
                style={{ borderColor: 'var(--magenta)', color: 'var(--magenta)' }}
                onClick={() => setShowChannelsModal(false)}
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
