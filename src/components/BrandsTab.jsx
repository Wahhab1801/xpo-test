import React, { useState, useEffect } from "react";
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
import { BrandsService } from "../lib/api";
import BrandCard from "./BrandCard";
import SearchBar from "./SearchBar";
import { AddBrandModal, EditBrandModal } from "./AddBrandModal";
import { useLocation, useSearchParams } from "react-router-dom";

function BrandsTab() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
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
                  onEdit={() => {
                    setSelectedBrand(brand);
                    setShowEditModal(true);
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default BrandsTab;
