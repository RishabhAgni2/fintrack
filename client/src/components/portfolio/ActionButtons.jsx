import { useState } from "react";
import BuyModal from "./BuyModal";
import SellModal from "./SellModal";

const ActionButtons = ({ refresh }) => {
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);

  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setShowBuy(true)}>+ Buy Stock</button>
      <button onClick={() => setShowSell(true)} style={{ marginLeft: "10px" }}>
        Sell Stock
      </button>

      {showBuy && (
        <BuyModal
          close={() => setShowBuy(false)}
          refresh={refresh}
        />
      )}

      {showSell && (
        <SellModal
          close={() => setShowSell(false)}
          refresh={refresh}
        />
      )}
    </div>
  );
};

export default ActionButtons;