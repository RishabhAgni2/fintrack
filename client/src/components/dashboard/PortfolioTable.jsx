const PortfolioTable = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800">
        <h2 className="text-lg font-semibold text-slate-200">
          Portfolio Holdings
        </h2>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          
          {/* Table Head */}
          <thead className="bg-slate-800 text-slate-400 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Avg Price</th>
              <th className="px-6 py-4">Current Price</th>
              <th className="px-6 py-4">Investment</th>
              <th className="px-6 py-4">Current Value</th>
              <th className="px-6 py-4 text-right">P / L</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800">
            {holdings.map((stock, index) => {
              const profit = stock.currentValue - stock.investment;
              const isProfit = profit >= 0;

              return (
                <tr
                  key={index}
                  className="hover:bg-slate-800/60 transition duration-200"
                >
                  <td className="px-6 py-4 font-semibold text-slate-200">
                    {stock.symbol}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    {stock.quantity}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    ₹ {stock.avgPrice?.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    ₹ {stock.currentPrice?.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    ₹ {stock.investment?.toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-slate-300">
                    ₹ {stock.currentValue?.toFixed(2)}
                  </td>

                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      isProfit ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    ₹ {profit.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default PortfolioTable;