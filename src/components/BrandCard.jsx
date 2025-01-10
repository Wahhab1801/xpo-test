import React from "react";
import { Edit, MapPin, Building2, Tag } from "lucide-react";
import { cn } from "../lib/utils";

function BrandCard({ brand, isAdmin, onEdit, className }) {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={brand.image_url}
          alt={brand.brand_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {isAdmin && onEdit && (
        <button
          onClick={() => onEdit(brand)}
          className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <Edit className="w-4 h-4 text-gray-700" />
        </button>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {brand.brand_name}
            </h3>
            <p className="text-gray-600 line-clamp-2">{brand.description}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            <span>
              {brand.location} - Hall {brand.hall}, Stand {brand.stand_number}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Building2 className="w-4 h-4 mr-2" />
            <span>{brand?.exhibitor?.company}</span>
          </div>

          {brand.product_tag && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-500" />
              {brand.product_tag.split(",").map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrandCard;
