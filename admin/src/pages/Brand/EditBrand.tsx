import EditEntity from "../../components/Entities/EditEntity";
import {
  deleteBrand,
  getBrand,
  updateBrand,
} from "../../services/brandService";

const EditBrand = () => (
  <EditEntity
    entityType="brand"
    getEntity={getBrand}
    deleteEntity={deleteBrand}
    updateEntity={updateBrand}
    listRoute="/brands"
  />
);

export default EditBrand;
