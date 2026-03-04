import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PortfolioChart = ({ data }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
      
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-200">
          Portfolio Performance
        </h2>
        <p className="text-sm text-slate-400">
          Investment vs Current Value
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;