import EditEntity from "../../components/Entities/EditEntity";
import {
  deleteCollection,
  getCollection,
  updateCollection,
} from "../../services/collectionService";

const EditCollection = () => (
  <EditEntity
    entityType="collection"
    getEntity={getCollection}
    deleteEntity={deleteCollection}
    updateEntity={updateCollection}
    listRoute="/collections"
  />
);

export default EditCollection;
