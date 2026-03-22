import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, LogOut, TrendingUp, ClipboardList } from "lucide-react";

export default function Sidebar() {
  const { logout, user } = useAuth();

  const navItems = [
    { to: "/dashboard", icon: <LayoutDashboard size={16} />, label: "Dashboard" },
    { to: "/transactions", icon: <ClipboardList size={16} />, label: "Transactions" },
  ];

  return (
    <div style={{
      width: '240px', minWidth: '240px',
      background: '#060e1c',
      borderRight: '1px solid rgba(56, 139, 253, 0.1)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '28px 24px 24px',
        borderBottom: '1px solid rgba(56, 139, 253, 0.08)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(135deg, #388bfd, #1f6feb)',
          borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(56, 139, 253, 0.35)', flexShrink: 0,
        }}>
          <TrendingUp size={17} color="white" />
        </div>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: '20px', letterSpacing: '-0.5px',
          background: 'linear-gradient(135deg, #fff, #a0b4d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>FinTrack</span>
      </div>

      <div style={{ padding: '24px 24px 10px' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: '#334155', letterSpacing: '1px', textTransform: 'uppercase' }}>
          Navigation
        </span>
      </div>

      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '11px 14px', borderRadius: '12px',
            textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            transition: 'all 0.2s', marginBottom: '4px',
            color: isActive ? 'white' : '#6b7a99',
            background: isActive ? 'rgba(56, 139, 253, 0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(56, 139, 253, 0.2)' : '1px solid transparent',
          })}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 12px 20px', borderTop: '1px solid rgba(56, 139, 253, 0.08)' }}>
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 14px', marginBottom: '8px',
            borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
          }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #388bfd, #1f6feb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: 'white', flexShrink: 0,
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#c9d5e8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '11px', color: '#4a5a75', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={logout} style={{
          width: '100%', padding: '10px 14px', borderRadius: '12px',
          border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)',
          color: '#f87171', fontSize: '14px', fontWeight: 500,
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );
}
