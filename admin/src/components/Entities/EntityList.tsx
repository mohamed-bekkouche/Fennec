import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import InputField from "../../components/Inputs/InputField";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/Buttons/Button";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import type { IEntity } from "../../types/Entity";
import { getBrands } from "../../services/brandService";
import { getCollections } from "../../services/collectionService";

interface FilterForm {
  name: string;
  sortBy: "createdAt" | "name";
  order: "asc" | "desc";
}

interface EntityListProps {
  type: "category" | "brand" | "collection";
  icon: React.ReactNode;
  emptyMessage: string;
  createRoute: string;
  itemComponent: React.ComponentType<{
    entity: IEntity;
    onDelete: (id: string) => void;
  }>;
}

const EntityList = ({
  type,
  icon,
  emptyMessage,
  createRoute,
  itemComponent: ItemComponent,
}: EntityListProps) => {
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, watch } = useForm<FilterForm>({
    defaultValues: {
      name: "",
      sortBy: "createdAt",
      order: "desc",
    },
  });

  const { name, sortBy, order } = watch();

  const fetchEntities = async (params: Partial<FilterForm> = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchFunction =
        type === "category"
          ? getCategories
          : type === "brand"
          ? getBrands
          : getCollections;

      const { data } = await fetchFunction(params);
      setEntities(
        type === "category"
          ? data.categories
          : type === "brand"
          ? data.brands
          : data.collections
      );
    } catch (err) {
      console.error(`Failed to fetch ${type}s:`, err);
      setError(`Failed to load ${type}s. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = (entityId: string) => {
    setEntities(entities.filter((entity) => entity._id !== entityId));
  };

  useEffect(() => {
    const isInitialLoad = !name && sortBy === "createdAt" && order === "desc";
    if (isInitialLoad) {
      fetchEntities({
        sortBy,
        order,
      });
    } else {
      const debounceTimer = setTimeout(() => {
        fetchEntities({
          name: name || undefined,
          sortBy,
          order,
        });
      }, 500);

      return () => clearTimeout(debounceTimer);
    }
  }, [name, sortBy, order]);

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="bg-off-black p-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <InputField
            name="name"
            placeholder={`Search ${type}s...`}
            type="search"
            register={register}
            className="focus:!translate-y-0 !py-2 !mb-0 !min-w-xs"
          />

          <select
            {...register("sortBy")}
            className="border py-2 text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-3 rounded-sm outline-none cursor-pointer bg-transparent"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>

          <select
            {...register("order")}
            className="border py-2 text-cold-gray/70 border-cold-gray/70 focus:border-cold-gray px-3 rounded-sm outline-none cursor-pointer bg-transparent"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <Button
          content={
            <Link
              to={createRoute}
              className="flex gap-2 items-center px-4 py-2.5"
            >
              <FaPlus className="text-lg" />
              New {type.charAt(0).toUpperCase() + type.slice(1)}
            </Link>
          }
          styles="rounded-sm w-fit !p-0"
        />
      </div>

      <div className="flex-1 h-full w-full bg-off-black overflow-hidden p-2 flex flex-col">
        <div className="grid grid-cols-11 gap-4 text-cold-gray/70 text-xs uppercase tracking-wide mb-3">
          <div className="col-span-4">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
          <div className="col-span-2 text-center">Products</div>
          <div className="col-span-2 text-center block">Created</div>
          <div className="col-span-3 pe-11 text-end">Actions</div>
        </div>

        <div className="w-full flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : entities.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-cold-gray/70 py-12">
              {icon}
              <p className="text-lg">{emptyMessage}</p>
              <p className="text-sm">
                Try adjusting your search or create a new {type}
              </p>
            </div>
          ) : (
            <div className="">
              {entities.map((entity) => (
                <ItemComponent
                  key={entity._id}
                  entity={entity}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntityList;
