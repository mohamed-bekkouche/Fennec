import EditEntity from "../../components/Entities/EditEntity";
import {
  deteleCategory,
  getCategory,
  updateCategory,
} from "../../services/categoryService";

const EditCategory = () => (
  <EditEntity
    entityType="category"
    getEntity={getCategory}
    deleteEntity={deteleCategory}
    updateEntity={updateCategory}
    listRoute="/categories"
  />
);

export default EditCategory;
