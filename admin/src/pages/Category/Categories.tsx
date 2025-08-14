import { IoPricetags } from "react-icons/io5";
import CategoryItem from "../../components/Categories/CategoryItem";
import EntityList from "../../components/Entities/EntityList";

const Categories = () => (
  <EntityList
    type="category"
    icon={<IoPricetags size={48} className="mb-4 text-cold-gray/30" />}
    emptyMessage="No categories found"
    createRoute="new-category"
    itemComponent={CategoryItem}
  />
);

export default Categories;
