import React from 'react';

const Home = () => {
  return (
    <div className="section animate-fade-in" style={{ paddingTop: '8rem' }}>
      <div className="container text-center">
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          Discover <span className="text-gradient">EduSinhala</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          A gamified, AI-powered interactive learning platform designed to help children learn the Sinhala language intuitively.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary">Learn More</button>
          <button className="btn-outline">View Milestones</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
