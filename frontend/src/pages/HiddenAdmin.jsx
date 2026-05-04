import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './HiddenAdmin.css';

const HiddenAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Universal Data State
  const [documents, setDocuments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [team, setTeam] = useState([]);
  const [overviews, setOverviews] = useState([]);

  // Document Upload State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Report');
  const [file, setFile] = useState(null);

  // Milestone State
  const [mTitle, setMTitle] = useState('');
  const [mDesc, setMDesc] = useState('');
  const [mDate, setMDate] = useState('');
  const [mMarks, setMMarks] = useState('');
  const [mStatus, setMStatus] = useState('Upcoming');

  // Team Member State
  const [tName, setTName] = useState('');
  const [tRole, setTRole] = useState('');
  const [tEmail, setTEmail] = useState('');
  const [tAchieve, setTAchieve] = useState('');
  const [tPhotoFile, setTPhotoFile] = useState(null);

  // Project Overview State
  const [ovTitle, setOvTitle] = useState('');
  const [ovDesc, setOvDesc] = useState('');
  const [ovDesc2, setOvDesc2] = useState('');
  const [ovHighlights, setOvHighlights] = useState('');
  const [ovVideo, setOvVideo] = useState('');
  const [editingOvId, setEditingOvId] = useState(null);

  const fetchAllData = async () => {
    try {
      const [docRes, milRes, teamRes, ovRes] = await Promise.all([
        api.get('/documents'),
        api.get('/milestones'),
        api.get('/team'),
        api.get('/project-overview')
      ]);
      setDocuments(docRes.data);
      setMilestones(milRes.data);
      setTeam(teamRes.data);
      setOverviews(ovRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOverview = async () => {
    // Overviews are now fetched in fetchAllData
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllData();
      fetchOverview();
    }
  }, [isLoggedIn]);

  const config = () => ({
    headers: { Authorization: `Bearer ${sessionStorage.getItem('adminToken')}` }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });
      sessionStorage.setItem('adminToken', res.data.token);
      setIsLoggedIn(true);
      setMessage('');
    } catch (err) {
      setMessage('Invalid credentials');
    }
  };

  const handleDocUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('file', file);

    try {
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });
      setMessage('Document uploaded successfully!');
      setTitle(''); setDescription(''); setFile(null);
      fetchAllData();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleMilestoneAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/milestones', {
        title: mTitle, description: mDesc, date: mDate, marksPercentage: mMarks, status: mStatus
      }, config());
      setMessage('Milestone added successfully!');
      setMTitle(''); setMDesc(''); setMDate(''); setMMarks(''); setMStatus('Upcoming');
      fetchAllData();
    } catch (err) {
      setMessage('Failed to add milestone');
    }
  };

  const handleTeamAdd = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', tName);
      formData.append('role', tRole);
      formData.append('email', tEmail);
      formData.append('achievements', tAchieve);
      if (tPhotoFile) {
        formData.append('photo', tPhotoFile);
      }

      await api.post('/team', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`
        }
      });
      setMessage('Team member added successfully!');
      setTName(''); setTRole(''); setTEmail(''); setTAchieve(''); setTPhotoFile(null);
      fetchAllData();
    } catch (err) {
      setMessage('Failed to add team member');
    }
  };

  const handleOverviewSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: ovTitle,
        description: ovDesc,
        description2: ovDesc2,
        highlights: ovHighlights,
        videoUrl: ovVideo
      };

      if (editingOvId) {
        await api.put(`/project-overview/${editingOvId}`, payload, config());
        setMessage('Overview layer updated successfully!');
      } else {
        await api.post('/project-overview', payload, config());
        setMessage('New overview layer added successfully!');
      }

      setOvTitle(''); setOvDesc(''); setOvDesc2(''); setOvHighlights(''); setOvVideo('');
      setEditingOvId(null);
      fetchAllData();
    } catch (err) {
      setMessage(`Failed to ${editingOvId ? 'update' : 'add'} project overview`);
    }
  };

  const startEditingOverview = (ov) => {
    setEditingOvId(ov._id);
    setOvTitle(ov.title);
    setOvDesc(ov.description);
    setOvDesc2(ov.description2 || '');
    setOvHighlights((ov.highlights || []).join(', '));
    setOvVideo(ov.videoUrl || '');
    setMessage('');
    // Scroll to form (optional, but helpful)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (category, id) => {
    try {
      await api.delete(`/${category}/${id}`, config());
      fetchAllData();
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="section animate-fade-in" style={{ paddingTop: '8rem' }}>
        <div className="container">
          <h2 className="text-center text-gradient" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Admin Access</h2>
          <div className="glass-panel" style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="admin-input" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="admin-input" />
              <button className="btn-primary" type="submit">Login</button>
              {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="text-center text-gradient" style={{ fontSize: '3rem', marginBottom: '2rem' }}>Admin Dashboard</h2>

        {message && <p style={{ color: '#00d2ff', textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}

        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>🏠 Project Overview</button>
          <button className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>📄 Documents</button>
          <button className={`tab-btn ${activeTab === 'milestones' ? 'active' : ''}`} onClick={() => setActiveTab('milestones')}>🏁 Milestones</button>
          <button className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>👥 Team Members</button>
        </div>
        {/* PROJECT OVERVIEW TAB — two-column layout */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2">
            {/* LEFT SIDE: CREATION FORM */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{editingOvId ? 'Edit Layer' : 'Add Overview Layer'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {editingOvId ? 'Update this section content.' : 'Create a new section for the Home page.'}
              </p>
              <form onSubmit={handleOverviewSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Layer Title</label>
                  <input
                    type="text"
                    placeholder="e.g. EduSinhala — AI-Powered Sinhala Learning"
                    value={ovTitle}
                    onChange={e => setOvTitle(e.target.value)}
                    required
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Layer Description 1</label>
                  <textarea
                    placeholder="Describe this section in 2–4 sentences..."
                    value={ovDesc}
                    onChange={e => setOvDesc(e.target.value)}
                    required
                    className="admin-input"
                    rows={4}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>Layer Description 2 (Optional)</label>
                  <textarea
                    placeholder="Additional description content..."
                    value={ovDesc2}
                    onChange={e => setOvDesc2(e.target.value)}
                    className="admin-input"
                    rows={4}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
                    Key Highlights <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AI-powered, Gamified, Child-friendly"
                    value={ovHighlights}
                    onChange={e => setOvHighlights(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
                    Video URL <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>(YouTube embed URL)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/embed/VIDEO_ID"
                    value={ovVideo}
                    onChange={e => setOvVideo(e.target.value)}
                    className="admin-input"
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary" type="submit">
                    {editingOvId ? '💾 Update Layer' : '➕ Add Layer'}
                  </button>
                  {editingOvId && (
                    <button
                      type="button"
                      className="btn-outline"
                      onClick={() => {
                        setEditingOvId(null);
                        setOvTitle(''); setOvDesc(''); setOvDesc2(''); setOvHighlights(''); setOvVideo('');
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* RIGHT SIDE: LIST VIEW */}
            <div className="glass-panel" style={{ padding: '2rem', maxHeight: '600px', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Managed Layers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {overviews.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No overview layers yet.</p>
                ) : (
                  overviews.map((ov, idx) => (
                    <div key={ov._id || idx} className="admin-list-item">
                      <div style={{ flex: 1, marginRight: '1rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{ov.title}</h4>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '250px' }}>
                          {ov.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => startEditingOverview(ov)} className="btn-primary" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }}>Edit</button>
                        <button onClick={() => handleDelete('project-overview', ov._id)} className="btn-delete">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS / MILESTONES / TEAM — two-column layout */}
        {activeTab !== 'overview' && (
          <div className="grid grid-cols-2">
            {/* LEFT SIDE: CREATION FORMS */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Create New</h3>

              {activeTab === 'documents' && (
                <form onSubmit={handleDocUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="admin-input" />
                  <input type="text" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="admin-input" />
                  <select value={type} onChange={e => setType(e.target.value)} className="admin-input">
                    <option value="Report">Report</option>
                    <option value="Presentation">Presentation</option>
                    <option value="Charter">Charter</option>
                    <option value="Checklist">Checklist</option>
                  </select>
                  <input type="file" onChange={e => setFile(e.target.files[0])} required className="admin-input" />
                  <button className="btn-primary" type="submit">Upload Database File</button>
                </form>
              )}

              {activeTab === 'milestones' && (
                <form onSubmit={handleMilestoneAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Milestone Title" value={mTitle} onChange={e => setMTitle(e.target.value)} required className="admin-input" />
                  <input type="text" placeholder="Description" value={mDesc} onChange={e => setMDesc(e.target.value)} className="admin-input" />
                  <input type="date" value={mDate} onChange={e => setMDate(e.target.value)} required className="admin-input" />
                  <input type="number" placeholder="Marks %" value={mMarks} onChange={e => setMMarks(e.target.value)} required className="admin-input" />
                  <select value={mStatus} onChange={e => setMStatus(e.target.value)} className="admin-input">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button className="btn-primary" type="submit">Add Milestone</button>
                </form>
              )}

              {activeTab === 'team' && (
                <form onSubmit={handleTeamAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input type="text" placeholder="Full Name" value={tName} onChange={e => setTName(e.target.value)} required className="admin-input" />
                  <input type="text" placeholder="Role (e.g. Frontend Developer)" value={tRole} onChange={e => setTRole(e.target.value)} required className="admin-input" />
                  <input type="email" placeholder="Email" value={tEmail} onChange={e => setTEmail(e.target.value)} required className="admin-input" />
                  <input type="file" onChange={e => setTPhotoFile(e.target.files[0])} accept="image/*" className="admin-input" />
                  <input type="text" placeholder="Achievements (comma separated)" value={tAchieve} onChange={e => setTAchieve(e.target.value)} className="admin-input" />
                  <button className="btn-primary" type="submit">Add Member</button>
                </form>
              )}
            </div>

            {/* RIGHT SIDE: LIST VIEWS & DELETION */}
            <div className="glass-panel" style={{ padding: '2rem', maxHeight: '600px', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Managed Items</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {activeTab === 'documents' && documents.map(d => (
                  <div key={d._id} className="admin-list-item">
                    <div>
                      <h4>{d.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{d.type}</span>
                    </div>
                    <button onClick={() => handleDelete('documents', d._id)} className="btn-delete">Delete</button>
                  </div>
                ))}

                {activeTab === 'milestones' && milestones.map(m => (
                  <div key={m._id} className="admin-list-item">
                    <div>
                      <h4>{m.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{m.status} - {m.marksPercentage}%</span>
                    </div>
                    <button onClick={() => handleDelete('milestones', m._id)} className="btn-delete">Delete</button>
                  </div>
                ))}

                {activeTab === 'team' && team.map(t => (
                  <div key={t._id} className="admin-list-item">
                    <div>
                      <h4>{t.name}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.role}</span>
                    </div>
                    <button onClick={() => handleDelete('team', t._id)} className="btn-delete">Delete</button>
                  </div>
                ))}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenAdmin;
