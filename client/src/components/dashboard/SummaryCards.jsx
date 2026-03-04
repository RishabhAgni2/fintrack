export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const totalProfit =
    summary.currentValue - summary.totalInvestment;

  const percentageReturn =
    summary.totalInvestment > 0
      ? (totalProfit / summary.totalInvestment) * 100
      : 0;

  return (
    <div className="grid grid-cols-2 gap-10 mb-14">

      <div className="bg-[#111c2d] rounded-2xl p-10 border border-[#1f2937] shadow-lg">
        <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider">
          Total Investment
        </p>
        <h2 className="text-4xl font-semibold text-white">
          ₹ {summary.totalInvestment.toFixed(2)}
        </h2>
      </div>

      <div className="bg-[#111c2d] rounded-2xl p-10 border border-[#1f2937] shadow-lg">
        <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider">
          Current Value
        </p>
        <h2 className="text-4xl font-semibold text-white">
          ₹ {summary.currentValue.toFixed(2)}
        </h2>
      </div>

      <div className="bg-[#111c2d] rounded-2xl p-10 border border-[#1f2937] shadow-lg">
        <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider">
          Profit / Loss
        </p>
        <h2 className={`text-4xl font-semibold ${
          totalProfit >= 0 ? "text-green-400" : "text-red-400"
        }`}>
          ₹ {totalProfit.toFixed(2)}
        </h2>
      </div>

      <div className="bg-[#111c2d] rounded-2xl p-10 border border-[#1f2937] shadow-lg">
        <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider">
          Return %
        </p>
        <h2 className={`text-4xl font-semibold ${
          percentageReturn >= 0 ? "text-green-400" : "text-red-400"
        }`}>
          {percentageReturn.toFixed(2)}%
        </h2>
      </div>

    </div>
  );
}