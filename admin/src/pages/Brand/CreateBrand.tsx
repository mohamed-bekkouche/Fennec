import CreateEntity from "../../components/Entities/CreateEntity";
import { createBrand } from "../../services/brandService";
import BrandForm from "../../components/Brands/BrandForm";

const CreateBrand = () => (
  <CreateEntity
    entityType="brand"
    createService={createBrand}
    listRoute="/brands"
    FormComponent={BrandForm}
  />
);

export default CreateBrand;
