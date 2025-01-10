// ExhibitorsTab.jsx
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ExhibitorsService } from "../lib/api";

function ExhibitorsTab() {
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchExhibitors();
  }, []);

  const fetchExhibitors = async () => {
    try {
      setLoading(true);
      const data = await ExhibitorsService.getExhibitors();
      setExhibitors(data?.data || []);
    } catch (error) {
      console.error("Failed to fetch exhibitors:", error);
      toast.error(error.message || "Failed to load exhibitors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExhibitor = async (formData) => {
    try {
      await ExhibitorsService.addExhibitor(formData);
      toast.success("Exhibitor added successfully");
      await fetchExhibitors();
      setShowAddModal(false);
    } catch (error) {
      console.error("Failed to add exhibitor:", error);
      toast.error(error.message || "Failed to add exhibitor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Exhibitor Management
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add New Exhibitor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exhibitors.map((exhibitor) => (
          <div
            key={exhibitor.ExhibitorID}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={exhibitor.profile_picture || "/api/placeholder/400/300"}
                alt={exhibitor.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = "/api/placeholder/400/300";
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {exhibitor.name}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium text-gray-700 w-20">
                    Position:
                  </span>
                  <span>{exhibitor.position || "Not specified"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium text-gray-700 w-20">
                    Company:
                  </span>
                  <span>{exhibitor.company || "Not specified"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Exhibitor
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Implementation of form submission
                const formData = new FormData(e.target);
                handleAddExhibitor({
                  name: formData.get("name"),
                  position: formData.get("position"),
                  company: formData.get("company"),
                  profile_picture: formData.get("profile_picture"),
                });
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    name="position"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    name="company"
                    type="text"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Picture URL
                  </label>
                  <input
                    name="profile_picture"
                    type="url"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Exhibitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExhibitorsTab;
