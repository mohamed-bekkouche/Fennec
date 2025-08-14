import EntityForm from "../Entities/EntityForm";
import type { IEntity } from "../../types/Entity";

const BrandForm = ({
  brand,
  onSubmit,
  action = "create",
}: {
  brand?: IEntity;
  onSubmit: (data: any, resetForm: () => void) => void;
  action?: "create" | "edit";
}) => (
  <EntityForm
    entity={brand}
    onSubmit={onSubmit}
    action={action}
    entityType="brand"
  />
);

export default BrandForm;
