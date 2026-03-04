import { useState } from "react";
import API from "../../api/axios";

const BuyModal = ({ close, refresh }) => {
  const [form, setForm] = useState({
    symbol: "",
    quantity: "",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/portfolio/buy", {
      symbol: form.symbol,
      quantity: Number(form.quantity),
      price: Number(form.price),
    });

    refresh();
    close();
  };

  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h3>Buy Stock</h3>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Symbol (e.g. AAPL)"
            onChange={(e) =>
              setForm({ ...form, symbol: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
          />

          <button type="submit">Buy</button>
          <button type="button" onClick={close} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const boxStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
};

export default BuyModal;