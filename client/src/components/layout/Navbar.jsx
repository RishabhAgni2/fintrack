import { useAuth } from "../../context/AuthContext";
import { Bell } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={{
      height: '64px',
      borderBottom: '1px solid rgba(56, 139, 253, 0.08)',
      background: 'rgba(6, 14, 28, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 5,
    }}>

      <div>
        <h1 style={{
          fontSize: '17px',
          fontWeight: 700,
          color: 'white',
          margin: 0,
          fontFamily: "'Syne', sans-serif",
          letterSpacing: '-0.3px',
        }}>
          Portfolio Dashboard
        </h1>
        <p style={{ fontSize: '12px', color: '#4a5a75', margin: 0, marginTop: '1px' }}>
          {dateStr} · Live prices via Finnhub
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(56, 139, 253, 0.08)',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          fontSize: '12px',
          color: '#388bfd',
          fontWeight: 500,
        }}>
          🟢 Market Open
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#8b9ab3',
          fontSize: '13px',
        }}>
          <span>Welcome,</span>
          <span style={{ color: 'white', fontWeight: 600 }}>{user?.name}</span>
        </div>
      </div>

    </div>
  );
}
