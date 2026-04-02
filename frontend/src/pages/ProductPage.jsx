



// src/pages/ProductPage.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  // Load all products on first load
  useEffect(() => {
  api.get("/products")   // <- Calls http://localhost:8080/api/products
    .then((res) => {
      setProducts(res.data);
    })
    .catch((err) => {
      console.error("API error:", err);
    });
}, []);

// useEffect(() => {
//   api.get("/products")
//     .then((res) => {
//       console.log("✅ Products received:", res.data); 
//       setProducts(res.data);
//     })
//     .catch((err) => {
//       console.error("❌ API error:", err);
//     });
// }, []);


  // Add product
  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
    };

    api.post("/products", newProduct)
      .then((res) => {
        setProducts([...products, res.data]);
        setName("");
        setPrice("");
        setQuantity("");
      })
      .catch((err) => console.error("Add failed:", err));
  };

  // ✅ Step 7: Delete product
  const handleDelete = (id) => {
    api.delete(`/products/${id}`)
      .then(() => {
        setProducts(products.filter(p => p.id !== id));
      })
      .catch((err) => console.error("Delete failed:", err));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">All Products</h2>

      {/* Add Product Form */}
      <form onSubmit={handleSubmit} className="space-x-2 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border px-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border px-2"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="border px-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Add
        </button>
      </form>

      {/* Products List */}
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="flex items-center justify-between border p-2">
            <span>{p.name} - ₹{p.price} (Qty: {p.quantity})</span>
            <button
              onClick={() => handleDelete(p.id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductPage;
