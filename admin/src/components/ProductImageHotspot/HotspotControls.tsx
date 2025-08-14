import { useState } from "react";
import type { IProduct } from "../../types/Product";

interface HotspotControlsProps {
  products: IProduct[];
  selectedProduct: string;
  isAddingHotspot: boolean;
  onProductSelect: (productId: string) => void;
  onToggleAddHotspot: () => void;
  onSave: () => void;
  onSearch: (term: string) => void;
}

const HotspotControls = ({
  products,
  selectedProduct,
  isAddingHotspot,
  onProductSelect,
  onToggleAddHotspot,
  onSave,
  onSearch,
}: HotspotControlsProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">
          Search Products
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded mb-2"
          placeholder="Search products..."
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Add New Hotspot
        </label>
        <div className="flex space-x-2">
          <select
            value={selectedProduct}
            onChange={(e) => onProductSelect(e.target.value)}
            className="flex-1 p-2 border rounded"
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <button
            onClick={onToggleAddHotspot}
            disabled={!selectedProduct}
            className={`px-4 py-2 rounded ${
              isAddingHotspot
                ? "bg-red-500 hover:bg-red-600 text-white"
                : selectedProduct
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAddingHotspot ? "Cancel" : "Add"}
          </button>
        </div>
      </div>

      <button
        onClick={onSave}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
      >
        Save Hotspots
      </button>
    </div>
  );
};

export default HotspotControls;
