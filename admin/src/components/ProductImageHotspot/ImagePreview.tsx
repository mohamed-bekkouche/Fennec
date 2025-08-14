import { useRef } from "react";
import type { IHotspot } from "../../types/ProductImage";

interface ImagePreviewProps {
  imageUrl: string;
  hotspots: IHotspot[];
  onAddHotspot: (hotspot: IHotspot) => void;
  onRemoveHotspot: (index: number) => void;
  isAddingHotspot: boolean;
}

const ImagePreview = ({
  imageUrl,
  hotspots,
  onAddHotspot,
  onRemoveHotspot,
  isAddingHotspot,
}: ImagePreviewProps) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isAddingHotspot || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onAddHotspot({
      positionX: parseFloat(x.toFixed(2)),
      positionY: parseFloat(y.toFixed(2)),
      product: "", // Will be set in parent component
    });
  };

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Product preview"
        className="w-full h-auto border rounded"
        onClick={handleImageClick}
      />
      {hotspots.map((hotspot, index) => (
        <div
          key={index}
          className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white transform -translate-x-3 -translate-y-3 cursor-pointer"
          style={{
            left: `${hotspot.positionX}%`,
            top: `${hotspot.positionY}%`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveHotspot(index);
          }}
          title={`Product: ${
            hotspot.product
          }\nPosition: ${hotspot.positionX.toFixed(
            1
          )}%, ${hotspot.positionY.toFixed(1)}%`}
        />
      ))}
      {isAddingHotspot && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <p className="text-white font-medium">Click to add hotspot</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
