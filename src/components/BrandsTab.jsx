import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { BrandsService } from "../lib/api";
import BrandCard from "./BrandCard";
import SearchBar from "./SearchBar";
import { AddBrandModal, EditBrandModal } from "./AddBrandModal";
import { useLocation, useSearchParams } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";

function BrandsTab() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "brand_name",
    direction: "asc",
  });

  // Sorting options
  const sortOptions = [
    { key: "brand_name", label: "Name" },
    { key: "location", label: "Location" },
    { key: "hall", label: "Hall" },
    { key: "stand_number", label: "Stand Number" },
    { key: "product_tag", label: "Product Tags" },
  ];

  useEffect(() => {
    const params = {
      name: searchParams.get("name"),
      location: searchParams.get("location"),
      hall: searchParams.get("hall"),
      product_tag: searchParams.get("product_tag"),
    };

    const hasSearchParams = Object.values(params).some(
      (value) => value != null && value !== ""
    );

    if (hasSearchParams) {
      handleSearch(params);
    } else {
      fetchBrands();
    }
  }, [location.search]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await BrandsService.getBrands();
      setBrands(data);
    } catch (error) {
      toast.error(error.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const getSortedBrands = () => {
    if (!sortConfig.key) return brands;

    return [...brands].sort((a, b) => {
      let aValue = a[sortConfig.key] || "";
      let bValue = b[sortConfig.key] || "";

      // Handle numeric values
      if (sortConfig.key === "stand_number") {
        aValue = aValue ? parseInt(aValue.replace(/[^0-9]/g, ""), 10) || 0 : 0;
        bValue = bValue ? parseInt(bValue.replace(/[^0-9]/g, ""), 10) || 0 : 0;
      } else {
        // Convert to lowercase strings for text comparison
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (sortConfig.direction === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSearch = async (params) => {
    try {
      setLoading(true);
      const filteredBrands = await BrandsService.searchBrands(params);
      setBrands(filteredBrands || []);
    } catch (error) {
      toast.error(error.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async (formData) => {
    try {
      await BrandsService.addBrand(formData);
      await fetchBrands();
      toast.success("Brand added successfully");
      setShowAddModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to add brand");
      throw error;
    }
  };

  const handleEditBrand = async (formData) => {
    try {
      if (!selectedBrand?.BrandID) {
        throw new Error("No brand selected for editing");
      }

      await BrandsService.editBrand(selectedBrand.BrandID, formData);
      await fetchBrands();
      toast.success("Brand updated successfully");
      setShowEditModal(false);
      setSelectedBrand(null);
    } catch (error) {
      toast.error(error.message || "Failed to update brand");
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const sortedBrands = getSortedBrands();

  return (
    <>
      <AddBrandModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddBrand}
      />

      <EditBrandModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBrand(null);
        }}
        onSubmit={handleEditBrand}
        brand={selectedBrand}
      />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Brand Management</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add New Brand
          </button>
        </div>

        <div className="mb-6">
          <SearchBar onSearch={handleSearch} />

          <div className="mt-4 flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleSort(option.key)}
                className={`flex items-center gap-1 px-4 py-2 rounded-md border transition-colors ${
                  sortConfig.key === option.key
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.label}
                {sortConfig.key === option.key &&
                  (sortConfig.direction === "asc" ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  ))}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedBrands.map((brand) => (
            <BrandCard
              key={brand.BrandID}
              brand={brand}
              isAdmin
              onEdit={() => {
                setSelectedBrand(brand);
                setShowEditModal(true);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default BrandsTab;
