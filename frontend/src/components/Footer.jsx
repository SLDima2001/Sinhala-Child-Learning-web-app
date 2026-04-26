import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} EduSinhala Project. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
