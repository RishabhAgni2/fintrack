import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"];

const AllocationChart = ({ data }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-800">
      
      {/* Title */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-200">
          Portfolio Allocation
        </h2>
        <p className="text-sm text-slate-400">
          Distribution by stock symbol
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="symbol"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AllocationChart;