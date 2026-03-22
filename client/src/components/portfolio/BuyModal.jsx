import { useState, useRef } from "react";
import API from "../../api/axios";
import { X, TrendingUp, Search, Loader, AlertCircle, CheckCircle } from "lucide-react";

const POPULAR_STOCKS = ["AAPL", "MSFT", "TSLA", "GOOGL", "AMZN", "META", "NVDA", "NFLX"];

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1px solid rgba(56, 139, 253, 0.2)',
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

const BuyModal = ({ close, refresh }) => {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [priceError, setPriceError] = useState("");
  const [priceFound, setPriceFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const debounceRef = useRef(null);

  const fetchPrice = async (sym) => {
    if (!sym) return;
    setFetchingPrice(true);
    setPriceError("");
    setPriceFound(false);
    setPrice("");
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
    setErrors({});

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (upper.length >= 1) {
      debounceRef.current = setTimeout(() => fetchPrice(upper), 700);
    }
  };

  const handleQuickSelect = (s) => {
    setSymbol(s);
    setErrors({});
    if (debounceRef.current) clearTimeout(debounceRef.current);
    fetchPrice(s);
  };

  const validate = () => {
    const e = {};
    if (!symbol.trim()) e.symbol = "Stock symbol is required";
    else if (priceError) e.symbol = "Invalid stock symbol — price not found";
    if (!quantity || Number(quantity) <= 0 || !Number.isInteger(Number(quantity)))
      e.quantity = "Enter a valid whole number quantity";
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
      await API.post("/portfolio/buy", {
        symbol,
        quantity: Number(quantity),
        price: Number(price),
      });
      refresh();
      close();
    } catch (err) {
      setErrors({ submit: err?.response?.data?.message || "Failed to buy. Try again." });
    } finally {
      setLoading(false);
    }
  };

  const total = quantity && price ? (Number(quantity) * Number(price)).toFixed(2) : null;

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
        border: '1px solid rgba(52, 211, 153, 0.2)',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
        animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399',
            }}>
              <TrendingUp size={17} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: 'white', fontFamily: "'Syne', sans-serif" }}>
                Buy Stock
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#4a5a75' }}>Live price auto-fetched</p>
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

        {/* Quick select */}
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Quick Select</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {POPULAR_STOCKS.map(s => (
              <button key={s} type="button" onClick={() => handleQuickSelect(s)} style={{
                padding: '5px 12px', borderRadius: '8px',
                border: `1px solid ${symbol === s ? 'rgba(52,211,153,0.5)' : 'rgba(56,139,253,0.15)'}`,
                background: symbol === s ? 'rgba(52,211,153,0.1)' : 'rgba(255,255,255,0.03)',
                color: symbol === s ? '#34d399' : '#6b7a99',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s', fontFamily: "'DM Sans', sans-serif",
              }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Symbol */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Stock Symbol</label>
            <div style={{ position: 'relative' }}>
              <input
                style={{
                  ...inputStyle, paddingRight: '40px',
                  borderColor: errors.symbol ? 'rgba(248,113,113,0.5)'
                    : priceFound ? 'rgba(52,211,153,0.4)' : 'rgba(56,139,253,0.2)',
                }}
                placeholder="Type e.g. AAPL or pick above"
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
          </div>

          {/* Auto-fetched price — read only */}
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Current Market Price — Auto Fetched</label>
            <input
              style={{
                ...inputStyle,
                borderColor: priceFound ? 'rgba(52,211,153,0.3)' : 'rgba(56,139,253,0.1)',
                background: 'rgba(52,211,153,0.04)',
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
            <label style={labelStyle}>Quantity (Number of Shares)</label>
            <input
              style={{
                ...inputStyle,
                borderColor: errors.quantity ? 'rgba(248,113,113,0.5)' : 'rgba(56,139,253,0.2)',
              }}
              type="number"
              placeholder="How many shares?"
              min="1"
              step="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setErrors(prev => ({ ...prev, quantity: '' }));
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(52,211,153,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = errors.quantity ? 'rgba(248,113,113,0.5)' : 'rgba(56,139,253,0.2)'; e.target.style.boxShadow = 'none'; }}
            />
            {errors.quantity && (
              <p style={{ color: '#f87171', fontSize: '12px', margin: '5px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={11} /> {errors.quantity}
              </p>
            )}
          </div>

          {/* Total preview */}
          {total && priceFound && (
            <div style={{
              background: 'rgba(52, 211, 153, 0.06)', border: '1px solid rgba(52, 211, 153, 0.15)',
              borderRadius: '12px', padding: '14px 16px', marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7a99' }}>Price per share</span>
                <span style={{ fontSize: '13px', color: '#8b9ab3' }}>₹ {Number(price).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7a99' }}>Shares</span>
                <span style={{ fontSize: '13px', color: '#8b9ab3' }}>× {quantity}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(52,211,153,0.1)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7a99' }}>Total Investment</span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: '#34d399' }}>₹ {total}</span>
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
                ? 'rgba(52,211,153,0.15)' : 'linear-gradient(135deg, #34d399, #10b981)',
              color: (loading || fetchingPrice || !priceFound) ? '#34d399' : 'white',
              fontSize: '14px', fontWeight: 600,
              cursor: (loading || fetchingPrice || !priceFound) ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            }}>
              {loading ? "Processing..." : fetchingPrice ? "Fetching price..." : !priceFound && symbol ? "Waiting for price..." : "Confirm Buy ✓"}
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

export default BuyModal;
