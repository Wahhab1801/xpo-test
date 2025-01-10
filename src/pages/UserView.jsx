import React from "react";
import { getBrands, searchBrands } from "../lib/api";
import BrandCard from "../components/BrandCard";
import SearchBar from "../components/SearchBar";

function UserView() {
  const [brands, setBrands] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleSearch = async (params) => {
    setLoading(true);
    try {
      const filteredBrands = await searchBrands(params);
      setBrands(filteredBrands);
    } catch (error) {
      console.error("Failed to search brands:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    console.log("Loading...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  console.log("Loaded:", brands);

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