import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Home.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/* ─── Status badge colour helper ─────────────────────────────────────────── */
const statusColor = (status) => {
  if (status === 'Completed') return '#00ffa3';
  if (status === 'Pending')   return '#ffd000';
  return '#adb5bd';
};

/* ─── Document type icon ──────────────────────────────────────────────────── */
const typeIcon = (type) => {
  const map = { Report: '📋', Presentation: '🎯', Charter: '📝', Checklist: '✅' };
  return map[type] || '📄';
};

/* ─── Expandable Description Component ───────────────────────────────────── */
const Description = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text && text.length > 300;
  
  if (!text) return null;

  if (!isLong) return <p className="hero-desc">{text}</p>;

  return (
    <p className="hero-desc">
      {expanded ? text : `${text.substring(0, 280)}...`}
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="read-more-btn"
      >
        {expanded ? ' Show Less' : ' Read More'}
      </button>
    </p>
  );
};

/* ─────────────────────────────────────────────────────────────────────────── */

const Home = () => {
  const navigate = useNavigate();
  const [overviews, setOverviews]   = useState([]);
  const [team, setTeam]             = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [documents, setDocuments]   = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [ovResult, teamResult, milResult, docResult] = await Promise.allSettled([
        api.get('/project-overview'),
        api.get('/team'),
        api.get('/milestones'),
        api.get('/documents'),
      ]);

      if (ovResult.status === 'fulfilled')   setOverviews(ovResult.value.data);
      if (teamResult.status === 'fulfilled') setTeam(teamResult.value.data);
      if (milResult.status === 'fulfilled')  setMilestones(milResult.value.data);
      if (docResult.status === 'fulfilled')  setDocuments(docResult.value.data);

      // Always stop the loading skeleton regardless of individual failures
      setLoading(false);
    };
    fetchAll();
  }, []);

  const hasOverview = overviews && overviews.length > 0;

  return (
    <div className="home-page">

      {/* ── HERO / PROJECT OVERVIEW LAYERS ────────────────────────────────── */}
      {loading ? (
        <section className="home-hero animate-fade-in">
          <div className="container">
            <div className="hero-placeholder">
              <div className="skeleton skeleton-title" />
              <div className="skeleton skeleton-body" />
              <div className="skeleton skeleton-body short" />
            </div>
          </div>
        </section>
      ) : hasOverview ? (
        overviews.map((ov, idx) => {
          const isLong = ov.description && ov.description.length > 250;
          return (
            <section key={ov._id || idx} className="home-hero animate-fade-in" style={{ animationDelay: `${idx * 0.1}s`, paddingBottom: '3rem' }}>
              <div className="container">
                <h1 className="hero-title">
                  <span className="text-gradient">{ov.title}</span>
                </h1>
                
                {/* {sessionStorage.getItem('adminToken') && (
                  <button 
                    className="admin-edit-shortcut"
                    onClick={() => navigate('/hidden-admin')}
                  >
                    ✏️ Edit Layer
                  </button>
                )} */}
                
                <div className="hero-desc-wrapper">
                  <Description text={ov.description} />
                  {ov.description2 && (
                    <div style={{ marginTop: '2rem' }}>
                      <Description text={ov.description2} />
                    </div>
                  )}
                </div>

                {ov.highlights && ov.highlights.length > 0 && (
                  <div className="highlights-row">
                    {ov.highlights.map((h, i) => (
                      <span key={i} className="highlight-chip">{h}</span>
                    ))}
                  </div>
                )}

                {ov.videoUrl && (
                  <div className="video-wrapper">
                    <iframe
                      src={ov.videoUrl}
                      title={`Project Demo Video ${idx + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </section>
          );
        })
      ) : (
        <section className="home-hero animate-fade-in">
          <div className="container">
            <h1 className="hero-title">
              Discover <span className="text-gradient">EduSinhala</span>
            </h1>
            <p className="hero-desc">
              A gamified, AI-powered interactive learning platform designed to help children
              learn the Sinhala language intuitively.
            </p>
            {/* <div className="hero-cta">
              <button className="btn-primary" onClick={() => navigate('/milestones')}>View Milestones</button>
              <button className="btn-outline" onClick={() => navigate('/about')}>Meet the Team</button>
            </div> */}
          </div>
        </section>
      )}

      {/* ── QUICK PEEK CARDS ──────────────────────────────────────────────── */}
      <section className="home-section animate-fade-in" style={{ animationDelay: '0.15s' }}>
        <div className="container">
          <h2 className="section-heading">Explore the Project</h2>
          <div className="peek-grid">

            {/* ── Team Members Card ── */}
            <div className="peek-card glass-panel" onClick={() => navigate('/about')} role="button" tabIndex={0}>
              <div className="peek-card-header">
                <span className="peek-icon">👥</span>
                <h3>Team Members</h3>
                <span className="peek-arrow">→</span>
              </div>
              {team.length === 0 ? (
                <p className="peek-empty">No team members added yet.</p>
              ) : (
                <>
                  <div className="team-preview-row">
                    {team.slice(0, 4).map((m) => (
                      <div key={m._id} className="team-avatar-wrap">
                        <div
                          className="team-avatar"
                          style={{
                            backgroundImage: `url(${API_BASE}/team/photo/${m._id})`,
                          }}
                        />
                        <span className="team-avatar-name">{m.name.split(' ')[0]}</span>
                      </div>
                    ))}
                    {team.length > 4 && (
                      <div className="team-more">+{team.length - 4}</div>
                    )}
                  </div>
                  <p className="peek-sub">{team.length} member{team.length !== 1 ? 's' : ''} — click to see full profiles</p>
                </>
              )}
            </div>

            {/* ── Milestones Card ──
            <div className="peek-card glass-panel" onClick={() => navigate('/milestones')} role="button" tabIndex={0}>
              <div className="peek-card-header">
                <span className="peek-icon">🏁</span>
                <h3>Milestones</h3>
                <span className="peek-arrow">→</span>
              </div>
              {milestones.length === 0 ? (
                <p className="peek-empty">No milestones added yet.</p>
              ) : (
                <>
                  <ul className="milestone-preview-list">
                    {milestones.slice(0, 3).map((m) => (
                      <li key={m._id} className="milestone-preview-item">
                        <span className="milestone-preview-title">{m.title}</span>
                        <span
                          className="milestone-preview-badge"
                          style={{ color: statusColor(m.status) }}
                        >
                          {m.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {milestones.length > 3 && (
                    <p className="peek-sub">+{milestones.length - 3} more milestones</p>
                  )}
                </>
              )}
            </div> */}

            {/* ── Documents Card ── */}
            <div className="peek-card glass-panel" onClick={() => navigate('/documents')} role="button" tabIndex={0}>
              <div className="peek-card-header">
                <span className="peek-icon">📄</span>
                <h3>Documents</h3>
                <span className="peek-arrow">→</span>
              </div>
              {documents.length === 0 ? (
                <p className="peek-empty">No documents uploaded yet.</p>
              ) : (
                <>
                  <ul className="doc-preview-list">
                    {documents.slice(0, 3).map((d) => (
                      <li key={d._id} className="doc-preview-item">
                        <span>{typeIcon(d.type)}</span>
                        <span className="doc-preview-title">{d.title}</span>
                        <span className="doc-type-badge">{d.type}</span>
                      </li>
                    ))}
                  </ul>
                  {documents.length > 3 && (
                    <p className="peek-sub">+{documents.length - 3} more documents</p>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ── ALL DOCUMENTS STRIP ───────────────────────────────────────────── */}
      {/* {documents.length > 0 && (
        <section className="home-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="container">
            <h2 className="section-heading">📂 Project Documents</h2>
            <p className="section-sub">Download any document directly from here.</p>
            <div className="docs-strip">
              {documents.map((doc) => (
                <div key={doc._id} className="doc-strip-item glass-panel">
                  <div className="doc-strip-left">
                    <span className="doc-strip-icon">{typeIcon(doc.type)}</span>
                    <div>
                      <p className="doc-strip-title">{doc.title}</p>
                      {doc.description && (
                        <p className="doc-strip-desc">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="doc-strip-right">
                    <span className="doc-type-badge">{doc.type}</span>
                    {doc.link && (
                      <a
                        href={`${API_BASE.replace('/api', '')}${doc.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary doc-download-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        ⬇ Download
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )} */}

    </div>
  );
};

export default Home;
