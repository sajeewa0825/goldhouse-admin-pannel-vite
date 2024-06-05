import React, { useState } from "react";
import UnsoldItem from "./components/Stock/UnsoldItem";
import SoldItems from "./components/Stock/SoldItem";
import InStock from "./components/Stock/InStock";
import Orders from "./components/Stock/Orders";

function Order() {
  const [currentView, setCurrentView] = useState("Orders");

  const renderContent = () => {
    switch (currentView) {
      case "Unsold Items":
        return (
          <div>
            <UnsoldItem />
          </div>
        );
      case "Sold Items":
        return (
          <div>
            <SoldItems />
          </div>
        );
      case "In Stock":
        return (
          <div>
            <InStock />
          </div>
        );
      default:
        return (
          <div>
            <Orders />
          </div>
        );
    }
  };

  return (
    <div>
      <div>
        <div className="my-4">
          <div className="flex gap-3">
            <button onClick={() => setCurrentView("Orders")}>
              <h2 className="font-bold">Orders</h2>
            </button>
            <button onClick={() => setCurrentView("Unsold Items")}>
              <h2 className="font-bold">UnSold Items</h2>
            </button>
            <button onClick={() => setCurrentView("Sold Items")}>
              <h2 className="font-bold">Sold Items</h2>
            </button>
            <button onClick={() => setCurrentView("In Stock")}>
              <h2 className="font-bold">In Stock</h2>
            </button>
          </div>
        </div>
      </div>
      <div className="update-state bg-white min-h-screen rounded-lg">
        <div className="bg-white p-8 rounded-lg">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Order;
