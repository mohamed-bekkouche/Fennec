import CreateEntity from "../../components/Entities/CreateEntity";
import { createCollection } from "../../services/collectionService";
import CollectionForm from "../../components/Collections/CollectionForm";

const CreateCollection = () => (
  <CreateEntity
    entityType="collection"
    createService={createCollection}
    listRoute="/collections"
    FormComponent={CollectionForm}
  />
);

export default CreateCollection;
