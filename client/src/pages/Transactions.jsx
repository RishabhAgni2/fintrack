import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../api/axios";
import { TrendingUp, TrendingDown, RefreshCw, Calendar, Filter } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | BUY | SELL

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/portfolio/transactions");
      setTransactions(res.data || []);
      setError("");
    } catch {
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = filter === "ALL"
    ? transactions
    : transactions.filter(t => t.type === filter);

  const totalBought = transactions
    .filter(t => t.type === "BUY")
    .reduce((sum, t) => sum + t.quantity * t.price, 0);

  const totalSold = transactions
    .filter(t => t.type === "SELL")
    .reduce((sum, t) => sum + t.quantity * t.price, 0);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    }) + " · " + d.toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              margin: 0, fontSize: '24px', fontWeight: 800,
              color: 'white', fontFamily: "'Syne', sans-serif", letterSpacing: '-0.5px',
            }}>
              Transaction History
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#4a5a75' }}>
              All your buy & sell activity
            </p>
          </div>
          <button
            onClick={fetchTransactions}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '10px',
              border: '1px solid rgba(56,139,253,0.2)',
              background: 'rgba(56,139,253,0.08)',
              color: '#388bfd', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,139,253,0.15)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(56,139,253,0.08)'}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total Transactions', value: transactions.length, color: '#388bfd', bg: 'rgba(56,139,253,0.08)', border: 'rgba(56,139,253,0.15)' },
            { label: 'Total Bought', value: `₹ ${totalBought.toFixed(2)}`, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.15)' },
            { label: 'Total Sold', value: `₹ ${totalSold.toFixed(2)}`, color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.15)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#0a1628', borderRadius: '16px', padding: '20px 22px',
              border: `1px solid ${s.border}`,
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 600, color: '#4a5a75', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {s.label}
              </p>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: s.color, fontFamily: "'Syne', sans-serif" }}>
                {s.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={14} color="#4a5a75" />
          {['ALL', 'BUY', 'SELL'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '7px 18px', borderRadius: '8px', 
                background: filter === f
                  ? f === 'BUY' ? 'rgba(52,211,153,0.15)'
                    : f === 'SELL' ? 'rgba(248,113,113,0.15)'
                    : 'rgba(56,139,253,0.15)'
                  : 'rgba(255,255,255,0.03)',
                color: filter === f
                  ? f === 'BUY' ? '#34d399'
                    : f === 'SELL' ? '#f87171'
                    : '#388bfd'
                  : '#6b7a99',
                fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.15s',
                border: `1px solid ${filter === f
                  ? f === 'BUY' ? 'rgba(52,211,153,0.3)'
                    : f === 'SELL' ? 'rgba(248,113,113,0.3)'
                    : 'rgba(56,139,253,0.3)'
                  : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              {f}
            </button>
          ))}
          <span style={{ fontSize: '12px', color: '#4a5a75', marginLeft: '4px' }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <div style={{
          background: '#0a1628', borderRadius: '20px',
          border: '1px solid rgba(56, 139, 253, 0.1)', overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', gap: '12px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                border: '2px solid rgba(56,139,253,0.15)', borderTopColor: '#388bfd',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ color: '#4a5a75', fontSize: '14px' }}>Loading transactions...</span>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#f87171', fontSize: '14px' }}>
              {error}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📋</div>
              <p style={{ color: '#4a5a75', fontSize: '14px', margin: 0 }}>
                {filter === 'ALL' ? 'No transactions yet. Buy your first stock!' : `No ${filter} transactions found.`}
              </p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    {['Type', 'Symbol', 'Quantity', 'Price', 'Total Value', 'Date & Time'].map((col, i) => (
                      <th key={col} style={{
                        padding: '12px 20px', fontSize: '11px', fontWeight: 600,
                        color: '#4a5a75', textTransform: 'uppercase', letterSpacing: '0.8px',
                        textAlign: 'left', whiteSpace: 'nowrap',
                        borderBottom: '1px solid rgba(56,139,253,0.06)',
                      }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx, index) => {
                    const isBuy = tx.type === "BUY";
                    const total = (tx.quantity * tx.price).toFixed(2);
                    return (
                      <tr
                        key={tx._id || index}
                        style={{ borderBottom: index < filtered.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,139,253,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700,
                            background: isBuy ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                            color: isBuy ? '#34d399' : '#f87171',
                            border: `1px solid ${isBuy ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
                          }}>
                            {isBuy ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                            {tx.type}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '6px',
                              background: 'rgba(56,139,253,0.1)', border: '1px solid rgba(56,139,253,0.15)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px', fontWeight: 800, color: '#388bfd',
                            }}>
                              {tx.symbol.slice(0, 2)}
                            </div>
                            <span style={{ fontWeight: 700, color: 'white', fontSize: '14px', fontFamily: "'Syne', sans-serif" }}>
                              {tx.symbol}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#8b9ab3', fontSize: '14px' }}>
                          {tx.quantity} shares
                        </td>
                        <td style={{ padding: '14px 20px', color: '#8b9ab3', fontSize: '14px' }}>
                          ₹ {tx.price.toFixed(2)}
                        </td>
                        <td style={{ padding: '14px 20px', fontWeight: 600, fontSize: '14px', color: isBuy ? '#34d399' : '#f87171' }}>
                          {isBuy ? '-' : '+'}₹ {total}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7a99', fontSize: '12px' }}>
                            <Calendar size={11} />
                            {formatDate(tx.createdAt)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
};

export default Transactions;
