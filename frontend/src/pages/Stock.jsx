import React, { useEffect, useState } from "react";
import api from "@/api/axios"; // ✅ use alias if configured in vite.config.js

const Stock = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    api.get("/stocks")
      .then((res) => setStocks(res.data))
      .catch((err) => console.error("Axios Error:", err));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Stock List</h2>
      <ul>
        {stocks.map((item) => (
          <li key={item.id}>
            {item.name} - Qty: {item.quantity} - ₹{item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stock;
