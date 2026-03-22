const PortfolioTable = ({ holdings }) => {
  if (!holdings || holdings.length === 0) return null;

  return (
    <div style={{
      background: '#0a1628',
      borderRadius: '20px',
      border: '1px solid rgba(56, 139, 253, 0.1)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(56, 139, 253, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: 700,
            color: 'white',
            fontFamily: "'Syne', sans-serif",
          }}>
            Portfolio Holdings
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#4a5a75' }}>
            {holdings.length} active position{holdings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{
          padding: '5px 12px',
          borderRadius: '20px',
          background: 'rgba(56, 139, 253, 0.08)',
          border: '1px solid rgba(56, 139, 253, 0.15)',
          fontSize: '12px',
          color: '#388bfd',
          fontWeight: 500,
        }}>
          Live Prices
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
              {['Symbol', 'Quantity', 'Avg Price', 'Current Price', 'Investment', 'Current Value', 'P / L'].map((col, i) => (
                <th key={col} style={{
                  padding: '12px 20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#4a5a75',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  textAlign: i === 6 ? 'right' : 'left',
                  whiteSpace: 'nowrap',
                  borderBottom: '1px solid rgba(56, 139, 253, 0.06)',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {holdings.map((stock, index) => {
              const profit = stock.currentValue - stock.investment;
              const profitPct = stock.investment > 0 ? (profit / stock.investment) * 100 : 0;
              const isProfit = profit >= 0;

              return (
                <tr
                  key={index}
                  style={{
                    borderBottom: index < holdings.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(56,139,253,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(56, 139, 253, 0.1)',
                        border: '1px solid rgba(56, 139, 253, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#388bfd',
                        flexShrink: 0,
                      }}>
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <span style={{ fontWeight: 700, color: 'white', fontSize: '14px', fontFamily: "'Syne', sans-serif" }}>
                        {stock.symbol}
                      </span>
                    </div>
                  </td>

                  <td style={{ padding: '16px 20px', color: '#8b9ab3', fontSize: '14px' }}>
                    {stock.quantity}
                  </td>

                  <td style={{ padding: '16px 20px', color: '#8b9ab3', fontSize: '14px' }}>
                    ₹ {stock.averagePrice?.toFixed(2)}
                  </td>

                  <td style={{ padding: '16px 20px', color: 'white', fontWeight: 600, fontSize: '14px' }}>
                    ₹ {stock.currentPrice?.toFixed(2)}
                  </td>

                  <td style={{ padding: '16px 20px', color: '#8b9ab3', fontSize: '14px' }}>
                    ₹ {stock.investment?.toFixed(2)}
                  </td>

                  <td style={{ padding: '16px 20px', color: '#8b9ab3', fontSize: '14px' }}>
                    ₹ {stock.currentValue?.toFixed(2)}
                  </td>

                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: isProfit ? '#34d399' : '#f87171',
                      }}>
                        {isProfit ? '+' : ''}₹ {profit.toFixed(2)}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: isProfit ? 'rgba(52,211,153,0.6)' : 'rgba(248,113,113,0.6)',
                        marginTop: '2px',
                      }}>
                        {isProfit ? '+' : ''}{profitPct.toFixed(2)}%
                      </div>
                    </div>
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
