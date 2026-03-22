import { TrendingUp, TrendingDown, DollarSign, BarChart2 } from "lucide-react";

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const totalProfit = summary.currentValue - summary.totalInvestment;
  const percentageReturn =
    summary.totalInvestment > 0
      ? (totalProfit / summary.totalInvestment) * 100
      : 0;

  const isProfit = totalProfit >= 0;

  const cards = [
    {
      label: "Total Investment",
      value: `₹ ${summary.totalInvestment.toFixed(2)}`,
      icon: <DollarSign size={18} />,
      color: "#388bfd",
      bg: "rgba(56, 139, 253, 0.08)",
      border: "rgba(56, 139, 253, 0.15)",
      sub: "Your total capital deployed",
    },
    {
      label: "Current Value",
      value: `₹ ${summary.currentValue.toFixed(2)}`,
      icon: <BarChart2 size={18} />,
      color: "#a78bfa",
      bg: "rgba(167, 139, 250, 0.08)",
      border: "rgba(167, 139, 250, 0.15)",
      sub: "Live market valuation",
    },
    {
      label: "Profit / Loss",
      value: `${isProfit ? "+" : ""}₹ ${totalProfit.toFixed(2)}`,
      icon: isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
      color: isProfit ? "#34d399" : "#f87171",
      bg: isProfit ? "rgba(52, 211, 153, 0.08)" : "rgba(248, 113, 113, 0.08)",
      border: isProfit ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
      sub: isProfit ? "You're in profit 🎉" : "Unrealized loss",
    },
    {
      label: "Return %",
      value: `${isProfit ? "+" : ""}${percentageReturn.toFixed(2)}%`,
      icon: isProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />,
      color: isProfit ? "#34d399" : "#f87171",
      bg: isProfit ? "rgba(52, 211, 153, 0.08)" : "rgba(248, 113, 113, 0.08)",
      border: isProfit ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
      sub: "Overall portfolio return",
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '28px',
    }}>
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            background: '#0a1628',
            borderRadius: '18px',
            padding: '22px 24px',
            border: `1px solid ${card.border}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            cursor: 'default',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Subtle bg glow */}
          <div style={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: card.bg,
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }} />

          {/* Icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: card.bg,
            border: `1px solid ${card.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: card.color,
            marginBottom: '14px',
          }}>
            {card.icon}
          </div>

          <p style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#4a5a75',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            margin: '0 0 8px',
          }}>
            {card.label}
          </p>

          <h2 style={{
            fontSize: '26px',
            fontWeight: 700,
            color: i <= 1 ? 'white' : card.color,
            margin: '0 0 6px',
            fontFamily: "'Syne', sans-serif",
            letterSpacing: '-0.5px',
          }}>
            {card.value}
          </h2>

          <p style={{ fontSize: '12px', color: '#4a5a75', margin: 0 }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
