import EntityForm from "../Entities/EntityForm";
import type { IEntity } from "../../types/Entity";

const CategoryForm = ({
  category,
  onSubmit,
  action = "create",
}: {
  category?: IEntity;
  onSubmit: (data: any, resetForm: () => void) => void;
  action?: "create" | "edit";
}) => (
  <EntityForm
    entity={category}
    onSubmit={onSubmit}
    action={action}
    entityType="category"
  />
);

export default CategoryForm;
