import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  getBrands,
  editBrand,
  addBrand,
  addExhibitor,
  searchBrands,
} from "../lib/api";
import BrandCard from "../components/BrandCard";
import SearchBar from "../components/SearchBar";
import { AddBrandModal, EditBrandModal } from "../components/AddBrandModal";
import { useLocation, useSearchParams } from "react-router-dom";

function AdminView() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBrand, setEditingBrand] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    const params = {
      name: searchParams.get("name"),
      location: searchParams.get("location"),
      hall: searchParams.get("hall"),
      product_tag: searchParams.get("product_tag"),
    };

    // Check if we have any search params
    const hasSearchParams = Object.values(params).some(
      (value) => value != null && value !== ""
    );

    if (hasSearchParams) {
      console.log("Searching with params:", params);
      handleSearch(params);
    } else {
      console.log("No search params, fetching all brands");
      fetchBrands();
    }
  }, [location.search]);

  const fetchBrands = async () => {
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBrands((items) => {
        const oldIndex = items.findIndex((item) => item.BrandID === active.id);
        const newIndex = items.findIndex((item) => item.BrandID === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleEdit = (brand) => {
    // setEditingBrand(brand);
    setSelectedBrand(brand);
    setShowEditModal(true);
  };

  const handleSave = async (brandData) => {
    try {
      if (editingBrand) {
        await editBrand(editingBrand.BrandID, brandData);
        toast.success("Brand updated successfully");
        fetchBrands();
      }
    } catch (error) {
      console.error("Failed to update brand:", error);
      toast.error("Failed to update brand");
    } finally {
      setEditingBrand(null);
    }
  };

  const handleSearch = async (params) => {
    setLoading(true);

    try {
      const filteredBrands = await searchBrands(params);
      console.log("Filtered brands:", filteredBrands);
      setBrands(filteredBrands || []);
    } catch (error) {
      console.error("Failed to search brands:", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = async (formData) => {
    console.log("formData", formData);
    try {
      const response = await fetch(
        "https://admin.thetoyfair.eu/api/brands/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add brand");
      }

      // Refresh brands list
      fetchBrands();
    } catch (error) {
      throw error;
    }
  };

  const handleEditBrand = async (formData) => {
    try {
      const response = await fetch(
        `https://admin.thetoyfair.eu/api/brands/edit/${selectedBrand.BrandID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update brand");
      }

      // Refresh brands list
      fetchBrands();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
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

        <SearchBar onSearch={handleSearch} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={brands.map((b) => b.BrandID)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {brands.map((brand) => (
                <BrandCard
                  key={brand.BrandID}
                  brand={brand}
                  isAdmin
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {editingBrand && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <h2 className="text-2xl font-bold mb-4">
                {editingBrand.BrandID ? "Edit Brand" : "Add New Brand"}
              </h2>
              {/* Add form fields for editing/adding brands */}
              <button
                onClick={() => setEditingBrand(null)}
                className="mt-4 px-4 py-2 bg-gray-200 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingBrand)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminView;
