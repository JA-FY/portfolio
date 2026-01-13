
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-text">
          © 2026 <span className="footer-brand">Jorge Ferguson</span>
        </p>

        <p className="footer-sub">
          Designed &amp; Built in Guatemala City
          <span className="flag" aria-hidden>
            🇬🇹
          </span>
        </p>
      </div>

      <style jsx>{`
        .footer {
          padding: 0.75rem 1.5rem;
          background: transparent;
        }

        .footer-inner {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .footer-text {
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .footer-brand {
          color: #e5e7eb;
        }

        .footer-sub {
          font-size: 0.85rem;
          color: #9ca3af;
        }

        .flag {
          display: inline-block;
          font-size: 1.5em;          
          line-height: 1;
          margin-left: 0.35em;
          vertical-align: -0.15em;   
          opacity: 0.85;             
        }
      `}</style>
    </footer>
  );
}

