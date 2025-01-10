import React from "react";
import { BrandsService } from "../lib/api";
import BrandCard from "../components/BrandCard";
import SearchBar from "../components/SearchBar";
import { toast } from "react-hot-toast";

function UserView() {
  const [brands, setBrands] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchBrands = async () => {
    try {
      const data = await BrandsService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      toast.error(error.message || "Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBrands();
  }, []);

  const handleSearch = async (params) => {
    try {
      setLoading(true);
      const filteredBrands = await BrandsService.searchBrands(params);
      setBrands(filteredBrands);
    } catch (error) {
      console.error("Failed to search brands:", error);
      toast.error(error.message || "Search failed");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Featured Brands
        </h1>

        <SearchBar onSearch={handleSearch} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <BrandCard key={brand.BrandID} brand={brand} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserView;
