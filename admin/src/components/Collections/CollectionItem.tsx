import EntityItem from "../Entities/EntityItem";
import type { IEntity } from "../../types/Entity";
import { deleteCollection } from "../../services/collectionService";

const CollectionItem = ({
  entity,
  onDelete,
}: {
  entity: IEntity;
  onDelete: (id: string) => void;
}) => (
  <EntityItem
    entity={entity}
    onDelete={onDelete}
    editRoute="edit-collection"
    deleteService={deleteCollection}
    entityType="collection"
  />
);

export default CollectionItem;
