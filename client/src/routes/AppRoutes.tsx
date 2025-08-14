import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ProtectedRoutes from "../components/Routes/ProtectedRoutes";
import { Dashboard } from "../pages/Dashboard";
import PublicRoutes from "../components/Routes/PublicRoutes";
import Layout from "../layouts/Layout";
import { Toaster } from "react-hot-toast";
import Settings from "../pages/Settings";
import WishList from "../pages/WishList";
import ConfirmEmail from "../pages/ConfirmEmail";
import Auth from "../pages/Auths/Auth";
import Login from "../pages/Auths/Login";
import Register from "../pages/Auths/Register";
import Activate from "../pages/Auths/Activate";
import Product from "../pages/Products/Product";
import Cart from "../pages/Orders/Cart";
import Checkout from "../pages/Orders/Checkout";
import Orders from "../pages/Orders/Orders";
import OrderSuccess from "../pages/Orders/OrderSuccess";
import Products from "../pages/Products/Products";
import Contact from "../pages/Supports/Contact";
import AboutUs from "../pages/Supports/AboutUs";
import CustomizeSuit from "../pages/Suits/CustomizeSuit";
import Personalize from "../pages/Suits/Personalize";
import Customize from "../pages/Suits/Customize";
import Accessories from "../pages/Suits/Accessories";
import OverView from "../pages/Suits/OverView";

const AppRoutes = () => {
  return (
    <Layout>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirm-email/:email_token?" element={<ConfirmEmail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<Product />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />

        <Route path="/customize" element={<CustomizeSuit />}>
          <Route index element={<Navigate to="personalize" replace />} />
          <Route path="personalize" element={<Personalize />} />
          <Route path="customize" element={<Customize />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="overview" element={<OverView />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="activate/:activation_token?" element={<Activate />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Navigate to="setting" replace />} />
            <Route path="setting" element={<Settings />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wish-list" element={<WishList />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
