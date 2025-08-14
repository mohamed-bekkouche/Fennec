import { useForm } from "react-hook-form";
import Button from "../../components/Buttons/Button";
import InputField from "../../components/Inputs/InputField";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginAdmin } from "../../services/authService";
import { login } from "../../hooks/useAuth";
import GoogleSignIn from "../../components/Auth/GoogleSignIn";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data: any) => {
    try {
      const res = await loginAdmin(data);
      const { user, access_token } = res.data;
      if (!user.isAdmin) {
        toast.error("User is not Autorized To This Page");
        return;
      }
      toast.success("Login Success");
      setTimeout(() => {
        login(user, access_token);
      }, 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="w-[400px] p-10">
      <h1 className="font-the-seasons text-3xl text-center mb-3 font-bold">
        {" "}
        Welcome Back{" "}
      </h1>
      <p className="font-inter font-light text-center text  mb-6">
        {" "}
        Login and explore our latest collections{" "}
      </p>
      <GoogleSignIn />
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="block flex-1 h-[1px] bg-gray-400 w-32" />
        <span className=" uppercase text-gray-500 font-light">OR </span>
        <span className="block flex-1 h-[1px] bg-gray-400 w-32" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="email"
          type="email"
          placeholder="Enter your email"
          register={register}
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          }}
          error={errors.email}
        />
        <InputField
          name="password"
          type="password"
          placeholder="Enter your password"
          register={register}
          validation={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          error={errors.password}
        />
        <Button
          styles="bg-off-black border-off-black hover:text-off-black !py-2.5 mx-auto !rounded-full !my-6"
          content="Continue"
          type="submit"
          disabled={isSubmitting}
        />
        <p className="text-sm text-warm-gray/70 text-center">
          {" "}
          Don't have an account?
          <Link
            className="underline text-off-black/70 font-semibold"
            to="/auth/register"
          >
            {" "}
            Sign in{" "}
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Login;
