import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#388bfd", "#34d399", "#f87171", "#a78bfa", "#fbbf24", "#38bdf8"];

const CustomTooltip = ({ active, payload }) => {
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
        <div style={{ fontWeight: 700, marginBottom: '4px' }}>{payload[0].name}</div>
        <div style={{ color: '#388bfd' }}>₹ {Number(payload[0].value).toFixed(2)}</div>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const AllocationChart = ({ data }) => {
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
          Portfolio Allocation
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#4a5a75' }}>
          Distribution by stock symbol
        </p>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="symbol"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={3}
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: '#8b9ab3', fontSize: '13px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllocationChart;
