import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documents');
        setDocuments(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="section animate-fade-in" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="text-center text-gradient" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Documents</h2>
        <div className="grid grid-cols-2">
          {loading ? <p className="text-center text-secondary">Loading...</p> : documents.map((doc) => (
            <div key={doc._id} className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{doc.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{doc.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', fontSize: '0.8rem' }}>
                  {doc.type}
                </span>
                {doc.link && (
                  <a 
                    href={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${doc.link}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-primary" 
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                  >
                    Download
                  </a>
                )}
              </div>
            </div>
          ))}
          {!loading && documents.length === 0 && (
            <div className="glass-panel" style={{ padding: '2rem', gridColumn: 'span 2' }}>
              <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No documents uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;
