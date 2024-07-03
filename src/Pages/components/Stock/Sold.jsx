import React, { useState, useEffect } from "react";
import ItemDetails from "./ItemDetails";
import axios from "axios";

const Sold = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/order/get?status=sold");
        setItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "sold":
        return "Sold";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{getStatusText("sold")}</h1>
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
              <div className="absolute top-0 right-0 bg-red-500 text-white py-1 px-3 rounded-bl-lg font-bold">
                Sold
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{item.product.title}</h2>
              <p className="text-gray-700">Quantity: {item.quantity}</p>
              <p className="text-gray-700">Date Sold: {item.updatedAt}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedItem && (
        <ItemDetails
          selectedItem={selectedItem}
          pageIdentifier={"sold"}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

export default Sold;
