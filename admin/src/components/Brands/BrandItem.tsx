// components/Brands/BrandItem.tsx
import EntityItem from "../Entities/EntityItem";
import type { IEntity } from "../../types/Entity";
import { deleteBrand } from "../../services/brandService";

const BrandItem = ({
  entity,
  onDelete,
}: {
  entity: IEntity;
  onDelete: (id: string) => void;
}) => (
  <EntityItem
    entity={entity}
    onDelete={onDelete}
    editRoute="edit-brand"
    deleteService={deleteBrand}
    entityType="brand"
  />
);

export default BrandItem;
