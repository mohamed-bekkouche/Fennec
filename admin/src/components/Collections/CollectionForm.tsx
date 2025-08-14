import EntityForm from "../Entities/EntityForm";
import type { IEntity } from "../../types/Entity";

const CollectionForm = ({
  collection,
  onSubmit,
  action = "create",
}: {
  collection?: IEntity;
  onSubmit: (data: any, resetForm: () => void) => void;
  action?: "create" | "edit";
}) => (
  <EntityForm
    entity={collection}
    onSubmit={onSubmit}
    action={action}
    entityType="collection"
  />
);

export default CollectionForm;
