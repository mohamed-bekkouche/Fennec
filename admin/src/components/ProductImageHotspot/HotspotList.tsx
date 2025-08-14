import type { IHotspot } from "../../types/ProductImage";

interface HotspotListProps {
  hotspots: IHotspot[];
  onRemove: (index: number) => void;
}

const HotspotList = ({ hotspots, onRemove }: HotspotListProps) => {
  return (
    <div className="mb-4">
      <h3 className="font-medium mb-2">Hotspots ({hotspots.length})</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {hotspots.map((hotspot, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <div>
              <span className="font-medium">{hotspot.product}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({hotspot.positionX.toFixed(1)}%, {hotspot.positionY.toFixed(1)}
                %)
              </span>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotspotList;
