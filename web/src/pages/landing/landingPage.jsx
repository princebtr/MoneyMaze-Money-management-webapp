import React from 'react';
import './LandingPage.css';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <main>
        <section id="home" className="hero">
          <h1>Navigate Your Financial Labyrinth</h1>
          <p>Unravel the complexities of personal finance with Money Maze</p>
          <button className="cta-button">Get Started →</button>
        </section>

        <section id="features" className="features">
          <h2>Our Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <span className="feature-icon">💲</span>
              <h3>Budget Tracking</h3>
              <p>Keep tabs on your income and expenses with ease</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📈</span>
              <h3>Investment Insights</h3>
              <p>Make informed decisions with our market analysis tools</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🧭</span>
              <h3>Financial Planning</h3>
              <p>Chart your path to financial freedom with personalized advice</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>User Registration & Secure Authentication</h3>
              <p>Protect your data with top-notch security</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Financial Reports Dashboard</h3>
              <p>Get a clear view of your financial progress</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📅</span>
              <h3>Recurring Transactions Management</h3>
              <p>Automate your recurring expenses for convenience</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Money Maze. All rights reserved.</p>
      </footer>
    </div>
  );
}
