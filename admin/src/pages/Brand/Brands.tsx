import { IoPricetags } from "react-icons/io5";
import BrandItem from "../../components/Brands/BrandItem";
import EntityList from "../../components/Entities/EntityList";
const Brands = () => (
  <EntityList
    type="brand"
    icon={<IoPricetags size={48} className="mb-4 text-cold-gray/30" />}
    emptyMessage="No brands found"
    createRoute="new-brand"
    itemComponent={BrandItem}
  />
);

export default Brands;
