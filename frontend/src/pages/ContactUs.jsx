import React from 'react';

const ContactUs = () => {
  return (
    <div className="section animate-fade-in" style={{ paddingTop: '8rem' }}>
      <div className="container">
        <h2 className="text-center text-gradient" style={{ fontSize: '3rem', marginBottom: '3rem' }}>Contact Us</h2>
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Name" style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
            <input type="email" placeholder="Email" style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white' }} />
            <textarea placeholder="Message" rows="5" style={{ padding: '1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white' }}></textarea>
            <button className="btn-primary" type="button">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
