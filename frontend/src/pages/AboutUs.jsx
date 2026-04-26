import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AboutUs = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get('/team');
        setTeam(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="section animate-fade-in" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="text-center text-gradient" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Meet the Team</h2>
        
        {loading ? <p className="text-center text-secondary">Loading...</p> : (
          <div className="grid grid-cols-2">
            {team.length === 0 ? (
               <div className="glass-panel" style={{ padding: '2rem', gridColumn: 'span 2' }}>
                 <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No team members have been added.</p>
               </div>
            ) : team.map((member) => (
              <div key={member._id} className="glass-panel" style={{ padding: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ flexShrink: 0 }}>
                  {/* Photo Profile Circle */}
                  <div style={{ 
                    width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                    backgroundImage: `url(${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/team/photo/${member._id})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    border: '2px solid var(--accent-primary)'
                  }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>{member.name}</h3>
                  <p style={{ color: 'var(--accent-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>{member.role}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{member.email}</p>
                  
                  {member.achievements && member.achievements.length > 0 && member.achievements[0] !== "" && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {member.achievements.map((ach, idx) => (
                        <span key={idx} style={{ padding: '0.2rem 0.8rem', background: 'rgba(112,0,255,0.2)', color: '#d3b8ff', borderRadius: '50px', fontSize: '0.75rem' }}>
                          {ach}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
