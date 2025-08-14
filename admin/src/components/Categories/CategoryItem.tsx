// components/Categories/CategoryItem.tsx
import EntityItem from "../Entities/EntityItem";
import { deteleCategory } from "../../services/categoryService";
import type { IEntity } from "../../types/Entity";

const CategoryItem = ({
  entity,
  onDelete,
}: {
  entity: IEntity;
  onDelete: (id: string) => void;
}) => (
  <EntityItem
    entity={entity}
    onDelete={onDelete}
    editRoute="edit-category"
    deleteService={deteleCategory}
    entityType="category"
  />
);

export default CategoryItem;
