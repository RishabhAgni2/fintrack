import Layout from "../components/layout/Layout";
import usePortfolio from "../hooks/usePortfolio";
import SummaryCards from "../components/dashboard/SummaryCards";
import PortfolioTable from "../components/dashboard/PortfolioTable";
import ActionButtons from "../components/portfolio/ActionButtons";
import AllocationChart from "../components/dashboard/AllocationChart";

const Dashboard = () => {
  const { data, loading, error, refresh } = usePortfolio();

  if (loading)
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '3px solid rgba(56,139,253,0.15)',
            borderTopColor: '#388bfd',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#4a5a75', fontSize: '14px' }}>Loading portfolio...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div style={{ textAlign: 'center', color: '#f87171', marginTop: '60px', fontSize: '15px' }}>
          {error}
        </div>
      </Layout>
    );

  const hasHoldings = data?.holdings?.length > 0;

  const allocationData =
    data?.holdings?.map((stock) => ({
      symbol: stock.symbol,
      value: stock.currentValue,
    })) || [];

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        <ActionButtons refresh={refresh} />
        <SummaryCards summary={data} />

        {!hasHoldings ? (
          <div style={{
            background: '#0a1628', borderRadius: '20px',
            border: '1px solid rgba(56,139,253,0.1)',
            padding: '60px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ color: 'white', fontFamily: "'Syne', sans-serif", margin: '0 0 8px', fontSize: '20px' }}>
              No Investments Yet
            </h2>
            <p style={{ color: '#4a5a75', margin: 0, fontSize: '14px' }}>
              Buy your first stock to start tracking performance.
            </p>
          </div>
        ) : (
          <>
            <AllocationChart data={allocationData} />
            <PortfolioTable holdings={data.holdings} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
