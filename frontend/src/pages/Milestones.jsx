import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Milestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const res = await api.get('/milestones');
        setMilestones(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchMilestones();
  }, []);

  return (
    <div className="section animate-fade-in" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="text-center text-gradient" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Project Milestones</h2>
        
        {loading ? <p className="text-center text-secondary">Loading...</p> : (
          <div className="grid grid-cols-2">
            {milestones.length === 0 ? (
               <div className="glass-panel" style={{ padding: '2rem', gridColumn: 'span 2' }}>
                 <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No milestones published yet.</p>
               </div>
            ) : milestones.map((m) => (
              <div key={m._id} className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{m.title}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{m.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--accent-secondary)' }}>
                  <span>Date: {new Date(m.date).toLocaleDateString()}</span>
                  <span>Marks: {m.marksPercentage}%</span>
                </div>
                <span style={{ 
                  display: 'inline-block', marginTop: '1rem', padding: '0.2rem 1rem', 
                  borderRadius: '50px', background: 'rgba(255,255,255,0.1)', fontSize: '0.8rem',
                  color: m.status === 'Completed' ? '#00ffa3' : (m.status === 'Pending' ? '#ffd000' : 'var(--text-secondary)')
                }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Milestones;
