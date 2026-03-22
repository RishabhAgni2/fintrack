import { useState } from "react";
import BuyModal from "./BuyModal";
import SellModal from "./SellModal";
import { Plus, Minus } from "lucide-react";

const ActionButtons = ({ refresh }) => {
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);

  return (
    <>
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={() => setShowBuy(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 20px', borderRadius: '12px',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            background: 'rgba(52, 211, 153, 0.1)', color: '#34d399',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(52,211,153,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={15} /> Buy Stock
        </button>

        <button
          onClick={() => setShowSell(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 20px', borderRadius: '12px',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            background: 'rgba(248, 113, 113, 0.08)', color: '#f87171',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Minus size={15} /> Sell Stock
        </button>
      </div>

      {showBuy && <BuyModal close={() => setShowBuy(false)} refresh={refresh} />}
      {showSell && <SellModal close={() => setShowSell(false)} refresh={refresh} />}
    </>
  );
};

export default ActionButtons;
