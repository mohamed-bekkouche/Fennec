import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoutes from "../components/Routes/ProtectedRoutes";
import PublicRoutes from "../components/Routes/PublicRoutes";
import { Toaster } from "react-hot-toast";
import Auth from "../pages/Auth/Auth";
import Login from "../pages/Auth/Login";
import Layout from "../layouts/Layout";
import Dashboard from "../pages/Dashboard";
import Products from "../pages/Product/Products";
import NewProductForm from "../pages/Product/NewProduct";
import EditProduct from "../pages/Product/EditProduct";
import Orders from "../pages/Order/Orders";
import Users from "../pages/User/Users";
import User from "../pages/User/User";
import Categories from "../pages/Category/Categories";
import CreateCategory from "../pages/Category/CreateCategory";
import EditCategory from "../pages/Category/EditCategory";
import Brands from "../pages/Brand/Brands";
import CreateBrand from "../pages/Brand/CreateBrand";
import EditBrand from "../pages/Brand/EditBrand";
import Coupons from "../pages/Coupon/Coupons";
import NewCoupon from "../pages/Coupon/NewCoupon";
import EditCoupon from "../pages/Coupon/EditCoupon";
import Collections from "../pages/Collection/Collections";
import CreateCollection from "../pages/Collection/CreateCollection";
import EditCollection from "../pages/Collection/EditCollection";
import ProductImage from "../pages/Setting/ProductImage";
import Setting from "../pages/Setting/Setting";
import SuitElementManager from "../pages/Setting/CustimizeSuit";

const AppRoutes = () => {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="/products">
              <Route index element={<Products />} />
              <Route path="new-product" element={<NewProductForm />} />
              <Route
                path="edit-product/:productId?"
                element={<EditProduct />}
              />
            </Route>
            <Route path="/users">
              <Route index element={<Users />} />
              <Route path=":id" element={<User />} />
            </Route>
            <Route path="/categories">
              <Route index element={<Categories />} />
              <Route path="new-category" element={<CreateCategory />} />
              <Route path="edit-category/:id" element={<EditCategory />} />
            </Route>
            <Route path="/brands">
              <Route index element={<Brands />} />
              <Route path="new-brand" element={<CreateBrand />} />
              <Route path="edit-brand/:id" element={<EditBrand />} />
            </Route>
            <Route path="/coupons">
              <Route index element={<Coupons />} />
              <Route path="new-coupon" element={<NewCoupon />} />
              <Route path="edit-coupon/:id" element={<EditCoupon />} />
            </Route>
            <Route path="/collections">
              <Route index element={<Collections />} />
              <Route path="new-collection" element={<CreateCollection />} />
              <Route path="edit-collection/:id" element={<EditCollection />} />
            </Route>
            <Route path="/setting" element={<Setting />}>
              <Route index element={<Navigate to="wear-styles" replace />} />
              <Route path="wear-styles" element={<ProductImage />} />
              <Route path="custimize-suit" element={<SuitElementManager />} />
            </Route>
          </Route>
          {/* <Route path="/" element={<Dashboard />}>
            <Route index element={<Navigate to="setting" replace />} />
            <Route path="setting" element={<Settings />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wish-list" element={<WishList />} />
          </Route> */}
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;
