import { useState, useRef, useEffect } from "react";
import API from "../../api/axios";
import { X, TrendingDown, Search, Loader, AlertCircle, CheckCircle } from "lucide-react";

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(248, 113, 113, 0.2)',
  background: 'rgba(255,255,255,0.03)',
  color: 'white',
  outline: 'none',
  fontSize: '14px',
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle = {
  display: 'block',
  marginBottom: '7px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#6b7a99',
  letterSpacing: '0.3px',
  textTransform: 'uppercase',
};

const SellModal = ({ close, refresh }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [priceFound, setPriceFound] = useState(false);
  const [ownedShares, setOwnedShares] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const debounceRef = useRef(null);

  // Load current holdings on mount so user can see what they own
  useEffect(() => {
    const loadHoldings = async () => {
      try {
        const res = await API.get("/portfolio");
        setHoldings(res.data?.holdings || []);
      } catch {}
    };
    loadHoldings();
  }, []);

  const fetchPrice = async (sym) => {
    setFetchingPrice(true);
    setPriceError("");
    setPriceFound(false);
    setPrice("");

    // Check owned shares
    const holding = holdings.find(h => h.symbol === sym);
    setOwnedShares(holding ? holding.quantity : 0);

    try {
      const res = await API.get(`/portfolio/price/${sym}`);
      if (res.data && res.data.price) {
        setPrice(res.data.price.toString());
        setPriceFound(true);
      } else {
        setPriceError("Symbol not found");
      }
    } catch {
      setPriceError("Could not fetch price");
    } finally {
      setFetchingPrice(false);
    }
  };

  const handleSymbolChange = (val) => {
    const upper = val.toUpperCase().trim();
    setSymbol(upper);
    setPrice("");
    setPriceFound(false);
    setPriceError("");
    setOwnedShares(null);
    setErrors({});

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (upper.length >= 1) {
      debounceRef.current = setTimeout(() => fetchPrice(upper), 700);
    }
  };

  const handleHoldingSelect = (sym) => {
    setSymbol(sym);
    setErrors({});
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchPrice(sym);
  };

  const validate = () => {
    const e = {};
    if (!symbol.trim()) e.symbol = "Stock symbol is required";
    else if (priceError) e.symbol = "Invalid stock symbol";
    else if (ownedShares === 0) e.symbol = "You don't own any shares of " + symbol;

    if (!quantity || Number(quantity) <= 0 || !Number.isInteger(Number(quantity)))
      e.quantity = "Enter a valid whole number quantity";
    else if (ownedShares !== null && Number(quantity) > ownedShares)
      e.quantity = `You only own ${ownedShares} share${ownedShares !== 1 ? 's' : ''} of ${symbol}`;

    if (!price || Number(price) <= 0) e.price = "Wait for price to load";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      await API.post("/portfolio/sell", {
        symbol,
        quantity: Number(quantity),
        price: Number(price),
      });
      refresh();
      close();
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Failed to sell. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const proceeds = quantity && price ? (Number(quantity) * Number(price)).toFixed(2) : null;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#0a1628', padding: '32px', borderRadius: '20px',
        width: '440px', maxHeight: '92vh', overflowY: 'auto',
        border: '1px solid rgba(248, 113, 113, 0.2)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
        animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f87171',
            }}>
              <TrendingDown size={17} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'white', fontFamily: "'Syne', sans-serif" }}>
                Sell Stock
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#4a5a75' }}>Sell from your holdings</p>
            </div>
          </div>
          <button onClick={close} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#6b7a99', borderRadius: '8px', width: '30px', height: '30px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Your holdings as quick select */}
        {holdings.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Your Holdings</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {holdings.map(h => (
                <button key={h.symbol} type="button" onClick={() => handleHoldingSelect(h.symbol)} style={{
                  padding: '5px 12px', borderRadius: '8px',
                  border: `1px solid ${symbol === h.symbol ? 'rgba(248,113,113,0.5)' : 'rgba(56,139,253,0.15)'}`,
                  background: symbol === h.symbol ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.03)',
                  color: symbol === h.symbol ? '#f87171' : '#6b7a99',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  {h.symbol}
                  <span style={{
                    background: 'rgba(255,255,255,0.08)', borderRadius: '4px',
                    padding: '1px 5px', fontSize: '10px', color: '#8b9ab3',
                  }}>
                    {h.quantity}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Symbol */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Stock Symbol</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{
                  ...inputStyle, paddingRight: '40px',
                  borderColor: errors.symbol ? 'rgba(248,113,113,0.5)'
                    : priceFound ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.2)',
                }}
                placeholder="Type symbol or pick above"
                value={symbol}
                onChange={(e) => handleSymbolChange(e.target.value)}
              />
              <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                {fetchingPrice
                  ? <Loader size={15} color="#388bfd" style={{ animation: 'spin 0.8s linear infinite' }} />
                  : priceFound ? <CheckCircle size={15} color="#34d399" />
                  : <Search size={15} color="#4a5a75" />}
              </div>
            </div>
            {errors.symbol && (
              <p style={{ color: '#f87171', fontSize: '12px', margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.symbol}
              </p>
            )}
            {/* Owned shares info badge */}
            {ownedShares !== null && !errors.symbol && (
              <p style={{
                fontSize: '12px', margin: '5px 0 0',
                color: ownedShares > 0 ? '#34d399' : '#f87171',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {ownedShares > 0
                  ? <><CheckCircle size={11} /> You own {ownedShares} share{ownedShares !== 1 ? 's' : ''} of {symbol}</>
                  : <><AlertCircle size={11} /> You don't own any {symbol} shares</>
                }
              </p>
            )}
          </div>

          {/* Current price — read only */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Current Market Price — Auto Fetched</label>
            <input
              style={{
                ...inputStyle,
                borderColor: priceFound ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.1)',
                background: 'rgba(248,113,113,0.03)',
                color: priceFound ? '#34d399' : '#3d4f6e',
                fontWeight: priceFound ? 700 : 400,
                cursor: 'default',
              }}
              value={
                fetchingPrice ? "Fetching live price..."
                  : priceError ? "⚠ " + priceError
                  : price ? `₹ ${Number(price).toFixed(2)}`
                  : "Select a stock above"
              }
              readOnly
            />
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>
              Quantity to Sell
              {ownedShares !== null && ownedShares > 0 && (
                <span style={{ color: '#4a5a75', fontWeight: 400, marginLeft: '6px', textTransform: 'none', letterSpacing: 0 }}>
                  (max: {ownedShares})
                </span>
              )}
            </label>
            <input
              style={{
                ...inputStyle,
                borderColor: errors.quantity ? 'rgba(248,113,113,0.5)' : 'rgba(248,113,113,0.2)',
              }}
              type="number"
              placeholder="How many shares to sell?"
              min="1"
              step="1"
              max={ownedShares || undefined}
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors(prev => ({ ...prev, quantity: '' }));
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(248,113,113,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = errors.quantity ? 'rgba(248,113,113,0.5)' : 'rgba(248,113,113,0.2)'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.quantity && (
              <p style={{ color: '#f87171', fontSize: '12px', margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.quantity}
              </p>
            )}
          </div>

          {/* Proceeds preview */}
          {proceeds && priceFound && (
            <div style={{
              background: 'rgba(248, 113, 113, 0.06)', border: '1px solid rgba(248, 113, 113, 0.15)',
              borderRadius: '12px', padding: '14px 16px', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7a99' }}>Sell price</span>
                <span style={{ fontSize: '13px', color: '#8b9ab3' }}>₹ {Number(price).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7a99' }}>Shares selling</span>
                <span style={{ fontSize: '13px', color: '#8b9ab3' }}>× {quantity}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(248,113,113,0.1)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7a99' }}>Total Proceeds</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#f87171' }}>₹ {proceeds}</span>
              </div>
            </div>
          )}

          {errors.submit && (
            <div style={{
              background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
              borderRadius: '10px', padding: '10px 14px', marginBottom: '16px',
              color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <AlertCircle size={14} /> {errors.submit}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={close} style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
              color: '#6b7a99', fontSize: '14px', fontWeight: 500,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }}>
              Cancel
            </button>
            <button type="submit" disabled={loading || fetchingPrice || !priceFound} style={{
              flex: 2, padding: '12px', borderRadius: '10px', border: 'none',
              background: (loading || fetchingPrice || !priceFound)
                ? 'rgba(248,113,113,0.15)' : 'linear-gradient(135deg, #f87171, #ef4444)',
              color: (loading || fetchingPrice || !priceFound) ? '#f87171' : 'white',
              fontSize: '14px', fontWeight: 600,
              cursor: (loading || fetchingPrice || !priceFound) ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {loading ? "Processing..." : fetchingPrice ? "Fetching price..." : "Confirm Sell ✓"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SellModal;
