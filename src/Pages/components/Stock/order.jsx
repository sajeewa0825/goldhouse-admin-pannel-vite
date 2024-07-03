import React, { useState, useEffect } from "react";
import ItemDetails from "./ItemDetails";
import axios from "axios";

const Orders = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [soldItemCount, setSoldItemCount] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/order/get?status=pending");
        setItems(response.data); // Set fetched data into state
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs only once

  const handleConform = (itemId) => {
     const ConfromOrder = async () => {
        try {
            await axios.put(`http://localhost:3000/api/order/update/${itemId}`);
            setItems(items.filter(item => item.id !== itemId));
            setSoldItemCount({ ...soldItemCount, [itemId]: (soldItemCount[itemId] || 0) + 1 });
        } catch (error) {
            console.error("Error conforming order:", error);
        }
     }

     ConfromOrder();
        
    setSelectedItem(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "orders":
        return "Orders";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{getStatusText("orders")}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            <div className="relative">
              <img
                src={`http://localhost:3000${item.product.images[0].url}`}
                alt={item.product.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-0 right-0 bg-green-500 text-white py-1 px-3 rounded-bl-lg font-bold">
                Orders
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{item.product.title}</h2>
              <p className="text-gray-700">Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <ItemDetails
          selectedItem={selectedItem}
          pageIdentifier={"orders"}
          onClose={() => setSelectedItem(null)}
          onConform={() => handleConform(selectedItem.id)}
          soldCount={soldItemCount[selectedItem.id] || 0}
        />
      )}
    </div>
  );
};

export default Orders;
