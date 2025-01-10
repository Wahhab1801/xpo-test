import React, { useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSearchParams, useLocation } from "react-router-dom";

function SearchBar({ onSearch }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [formValues, setFormValues] = React.useState({
    name: searchParams.get("name") || "",
    product_tag: searchParams.get("product_tag") || "",
    location: searchParams.get("location") || "",
    hall: searchParams.get("hall") || "",
  });

  console.log("Search params:", searchParams.toString());

  // Update form when URL params change
  useEffect(() => {
    setFormValues({
      name: searchParams.get("name") || "",
      product_tag: searchParams.get("product_tag") || "",
      location: searchParams.get("location") || "",
      hall: searchParams.get("hall") || "",
    });
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Filter out empty values
    const cleanParams = Object.fromEntries(
      Object.entries(formValues).filter(([_, value]) => value.trim() !== "")
    );

    // Update URL with search params
    setSearchParams(cleanParams);

    onSearch(formValues);
  };

  const handleClear = () => {
    setFormValues({
      name: "",
      product_tag: "",
      location: "",
      hall: "",
    });

    // Clear URL params
    setSearchParams({});
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Brand name"
            value={formValues.name}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Product tags"
            value={formValues.product_tag}
            onChange={(e) =>
              setFormValues((prev) => ({
                ...prev,
                product_tag: e.target.value,
              }))
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={formValues.location}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, location: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Hall"
            value={formValues.hall}
            onChange={(e) =>
              setFormValues((prev) => ({ ...prev, hall: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          {searchParams?.toString() && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
