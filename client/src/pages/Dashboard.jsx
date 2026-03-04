import Layout from "../components/layout/Layout";
import usePortfolio from "../hooks/usePortfolio";
import SummaryCards from "../components/dashboard/SummaryCards";
import PortfolioTable from "../components/dashboard/PortfolioTable";
import ActionButtons from "../components/portfolio/ActionButtons";
import PortfolioChart from "../components/dashboard/PortfolioChart";
import AllocationChart from "../components/dashboard/AllocationChart";

const Dashboard = () => {
  const { data, loading, error, refresh } = usePortfolio();

  if (loading)
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-lg font-semibold animate-pulse">
            Loading portfolio...
          </p>
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="text-center text-red-500 mt-10">
          {error}
        </div>
      </Layout>
    );

  const hasHoldings = data?.holdings?.length > 0;

  // Prepare chart data safely
  const allocationData =
    data?.holdings?.map((stock) => ({
      symbol: stock.symbol,
      value: stock.currentValue,
    })) || [];

  const performanceData = [
    { name: "Investment", value: data?.totalInvestment || 0 },
    { name: "Current", value: data?.currentValue || 0 },
  ];

  return (
    <Layout>
      <div className="space-y-8">

        {/* Action Buttons */}
        <ActionButtons refresh={refresh} />

        {/* Summary Cards */}
        <SummaryCards summary={data} />

        {!hasHoldings ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-xl font-semibold mb-2">
              No Investments Yet
            </h2>
            <p className="text-gray-500">
              Buy your first stock to start tracking performance.
            </p>
          </div>
        ) : (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
               <PortfolioChart data={performanceData} />
                <AllocationChart data={allocationData} />
             </div>

            {/* Portfolio Table */}
            <PortfolioTable holdings={data.holdings} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;