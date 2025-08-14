import CollectionItem from "../../components/Collections/CollectionItem";
import EntityList from "../../components/Entities/EntityList";
import { MdOutlineCollections } from "react-icons/md";
const Collections = () => (
  <EntityList
    type="collection"
    icon={<MdOutlineCollections size={48} className="mb-4 text-cold-gray/30" />}
    emptyMessage="No Collection found"
    createRoute="new-collection"
    itemComponent={CollectionItem}
  />
);

export default Collections;
