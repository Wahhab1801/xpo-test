import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { ExhibitorsService } from "../lib/api";

// Common Input Component
const FormInput = ({ label, error, className, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      className={cn(
        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
        error ? "border-red-500" : "border-gray-300",
        props.disabled && "bg-gray-100"
      )}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Common Text Area Component
const FormTextArea = ({ label, error, className, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      className={cn(
        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
        error ? "border-red-500" : "border-gray-300",
        props.disabled && "bg-gray-100"
      )}
      rows={4}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Common Select Component
const FormSelect = ({
  label,
  error,
  options,
  className,
  onSelect,
  ...props
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {props.required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <select
      className={cn(
        "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
        error ? "border-red-500" : "border-gray-300",
        props.disabled && "bg-gray-100"
      )}
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

// Add Brand Modal Component
export const AddBrandModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    brand_name: "",
    image_url: "",
    description: "",
    location: "",
    hall: "",
    stand_number: "",
    product_tag: "",
    exhibitor_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [exhibitors, setExhibitors] = useState([]);
  const [loadingExhibitors, setLoadingExhibitors] = useState(false);

  useEffect(() => {
    const fetchExhibitors = async () => {
      // if (isOpen) {
      try {
        setLoadingExhibitors(true);
        const data = await ExhibitorsService.getExhibitors();
        const formattedExhibitors = data?.data?.map((exhibitor) => ({
          value: exhibitor.exhibitor_id,
          label: exhibitor.name || exhibitor.company_name,
        }));
        setExhibitors(formattedExhibitors);
      } catch (error) {
        console.error("Failed to fetch exhibitors:", error);
        setErrors((prev) => ({
          ...prev,
          exhibitor: "Failed to load exhibitors",
        }));
      } finally {
        setLoadingExhibitors(false);
      }
      //
    };

    fetchExhibitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors(error.errors || { general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Add New Brand</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Brand Name"
              required
              value={formData.brand_name}
              onChange={(e) =>
                setFormData({ ...formData, brand_name: e.target.value })
              }
              error={errors.brand_name}
              placeholder="Enter brand name"
            />

            <FormInput
              label="Image URL"
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              error={errors.image_url}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <FormTextArea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            error={errors.description}
            placeholder="Enter brand description"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              error={errors.location}
              placeholder="e.g., London"
            />

            <FormInput
              label="Hall"
              value={formData.hall}
              onChange={(e) =>
                setFormData({ ...formData, hall: e.target.value })
              }
              error={errors.hall}
              placeholder="e.g., A"
            />

            <FormInput
              label="Stand Number"
              value={formData.stand_number}
              onChange={(e) =>
                setFormData({ ...formData, stand_number: e.target.value })
              }
              error={errors.stand_number}
              placeholder="e.g., A1"
            />
          </div>

          <FormInput
            label="Product Tags"
            value={formData.product_tag}
            onChange={(e) =>
              setFormData({ ...formData, product_tag: e.target.value })
            }
            error={errors.product_tag}
            placeholder="Enter tags separated by commas"
          />

          <FormSelect
            label="Exhibitor"
            required
            value={formData.exhibitor_id}
            onChange={(e) => {
              setFormData({ ...formData, exhibitor_id: e.target.value });
            }}
            error={errors.exhibitor_id}
            options={exhibitors}
            // options={["Select Exhibitor", "Exhibitor 1", "Exhibitor 2"]}
            disabled={loadingExhibitors}
          />

          {errors.general && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
              {errors.general}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Adding..." : "Add Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Brand Modal Component
export const EditBrandModal = ({ isOpen, onClose, onSubmit, brand }) => {
  const [formData, setFormData] = useState({
    brand_name: "",
    image_url: "",
    description: "",
    location: "",
    hall: "",
    stand_number: "",
    product_tag: "",
    exhibitor_id: "",
  });

  // const [selectedExhibitor, setSelectedExhibitor] = useState(null);

  // Update formData whenever brand prop changes
  useEffect(() => {
    if (brand) {
      setFormData({
        brand_name: brand.brand_name || "",
        image_url: brand.image_url || "",
        description: brand.description || "",
        location: brand.location || "",
        hall: brand.hall || "",
        stand_number: brand.stand_number || "",
        product_tag: brand.product_tag || "",
        exhibitor_id: brand.exhibitor_id || "",
      });
      // if (exhibitors.length > 0) {
      //   setSelectedExhibitor(
      //     exhibitors.find((exhibitor) => exhibitor.value === brand.exhibitor_id)
      //   );
      // }
    }
  }, [brand]);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [exhibitors, setExhibitors] = useState([]);
  const [loadingExhibitors, setLoadingExhibitors] = useState(false);

  useEffect(() => {
    const fetchExhibitors = async () => {
      // if (isOpen) {
      try {
        setLoadingExhibitors(true);
        const data = await ExhibitorsService.getExhibitors();
        const formattedExhibitors = data?.data?.map((exhibitor) => ({
          value: exhibitor.ExhibitorID,
          label: exhibitor.name || exhibitor.company_name,
        }));
        setExhibitors(formattedExhibitors);
      } catch (error) {
        console.error("Failed to fetch exhibitors:", error);
        setErrors((prev) => ({
          ...prev,
          exhibitor: "Failed to load exhibitors",
        }));
      } finally {
        setLoadingExhibitors(false);
      }
      //
    };

    fetchExhibitors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      setErrors(error.errors || { general: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !brand) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Edit {brand.brand_name}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Brand Name"
              required
              value={formData.brand_name}
              onChange={(e) =>
                setFormData({ ...formData, brand_name: e.target.value })
              }
              error={errors.brand_name}
            />

            <FormInput
              label="Image URL"
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              error={errors.image_url}
            />
          </div>

          <FormTextArea
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            error={errors.description}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              error={errors.location}
            />

            <FormInput
              label="Hall"
              value={formData.hall}
              onChange={(e) =>
                setFormData({ ...formData, hall: e.target.value })
              }
              error={errors.hall}
            />

            <FormInput
              label="Stand Number"
              value={formData.stand_number}
              onChange={(e) =>
                setFormData({ ...formData, stand_number: e.target.value })
              }
              error={errors.stand_number}
            />
          </div>

          <FormInput
            label="Product Tags"
            value={formData.product_tag}
            onChange={(e) =>
              setFormData({ ...formData, product_tag: e.target.value })
            }
            error={errors.product_tag}
            placeholder="Enter tags separated by commas"
          />

          <FormSelect
            label="Exhibitor"
            required
            value={formData.exhibitor_id}
            onChange={(e) => {
              setFormData({ ...formData, exhibitor_id: e.target.value });
              // setSelectedExhibitor();
            }}
            onSelect={(value) => {}}
            error={errors.exhibitor_id}
            options={exhibitors}
            disabled={loadingExhibitors}
          />

          {errors.general && (
            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
              {errors.general}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
