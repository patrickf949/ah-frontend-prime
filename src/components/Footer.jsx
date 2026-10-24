import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.scss";

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            Authors Haven
          </Link>
          <p className="footer-tagline">
            A social platform for the creative at heart to foster inspiration and innovation.
          </p>
        </div>
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/about" className="footer-link">About</Link>
          <a
            href="https://andela.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Andela
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Authors Haven. Built with passion.</p>
      </div>
    </footer>
  );
};

export default Footer;
