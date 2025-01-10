// AdminView.jsx
import React, { useState } from "react";
import BrandsTab from "../components/BrandsTab";
import ExhibitorsTab from "../components/ExhibitorsTab";

function AdminView() {
  const [activeTab, setActiveTab] = useState("brands");

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Tabs and Heading Wrapper */}
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex mb-8 space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "brands"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("brands")}
          >
            Brands
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              activeTab === "exhibitors"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("exhibitors")}
          >
            Exhibitors
          </button>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-center">Brand Management</h1>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "brands" && <BrandsTab />}
        {activeTab === "exhibitors" && <ExhibitorsTab />}
      </div>
    </div>
  );
}

export default AdminView;
