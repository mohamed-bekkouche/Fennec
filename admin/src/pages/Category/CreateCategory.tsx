import CreateEntity from "../../components/Entities/CreateEntity";
import { createCategory } from "../../services/categoryService";
import CategoryForm from "../../components/Categories/CategoryForm";

const CreateCategory = () => (
  <CreateEntity
    entityType="category"
    createService={createCategory}
    listRoute="/categories"
    FormComponent={CategoryForm}
  />
);

export default CreateCategory;
