import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#0d1f38',
        border: '1px solid rgba(56,139,253,0.2)',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
        color: 'white',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}>
        <div style={{ color: '#6b7a99', marginBottom: '4px', fontSize: '11px' }}>{label}</div>
        <div style={{ fontWeight: 700, color: '#388bfd' }}>₹ {Number(payload[0].value).toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

const PortfolioChart = ({ data }) => {
  return (
    <div style={{
      background: '#0a1628',
      padding: '24px',
      borderRadius: '20px',
      border: '1px solid rgba(56, 139, 253, 0.1)',
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 700,
          color: 'white',
          fontFamily: "'Syne', sans-serif",
        }}>
          Portfolio Performance
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#4a5a75' }}>
          Investment vs Current Value
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#388bfd" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#388bfd" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(56,139,253,0.06)" vertical={false} />
          <XAxis
            dataKey="name"
            stroke="#334155"
            tick={{ fill: '#4a5a75', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke="#334155"
            tick={{ fill: '#4a5a75', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
            width={65}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(56,139,253,0.2)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#388bfd"
            strokeWidth={2.5}
            fill="url(#colorValue)"
            dot={{ fill: '#388bfd', strokeWidth: 2, r: 5, stroke: '#0a1628' }}
            activeDot={{ r: 7, fill: '#388bfd', stroke: '#0a1628', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;
