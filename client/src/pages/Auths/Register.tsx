import { useForm } from "react-hook-form";
import Button from "../../components/Buttons/Button";
import InputField from "../../components/Inputs/InputField";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import { toast } from "react-hot-toast";
import GoogleSignIn from "../../components/Auth/GoogleSignIn";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      toast.success(t("register.success"));
      setTimeout(() => navigate("/auth/activate"), 1000);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || t("register.error"));
    }
  };

  return (
    <div className="w-full max-w-[400px] p-10">
      <h1 className="font-the-seasons text-3xl text-center mb-3 font-bold">
        {" "}
        {t("register.title")}
      </h1>
      <p className="font-inter font-light text-center text  mb-6">
        {t("register.subTitle")}
      </p>
      <GoogleSignIn />
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="block flex-1 h-[1px] bg-gray-400 w-32" />
        <span className=" uppercase text-gray-500 font-light">
          {t("login.or")}{" "}
        </span>
        <span className="block flex-1 h-[1px] bg-gray-400 w-32" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="username"
          type="text"
          placeholder={t("register.usernamePlaceholder")}
          register={register}
          validation={{
            required: t("register.usernameRequired"),
            minLength: {
              value: 3,
              message: t("register.usernameInvalid"),
            },
          }}
          error={errors.username}
        />

        <InputField
          name="email"
          type="email"
          placeholder={t("login.emailPlaceholder")}
          register={register}
          validation={{
            required: t("login.emailRequired"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("login.emailInvalid"),
            },
          }}
          error={errors.email}
        />
        <InputField
          name="password"
          type="password"
          placeholder={t("login.passwordPlaceholder")}
          register={register}
          validation={{
            required: t("login.passwordRequired"),
            minLength: {
              value: 6,
              message: t("login.passwordInvalid"),
            },
          }}
          error={errors.password}
        />
        <Button
          styles="bg-off-black border-off-black hover:text-off-black !py-2.5 mx-auto !rounded-full !my-6"
          content={t("login.cta")}
          type="submit"
          disabled={isSubmitting}
        />
        <p className="text-sm text-warm-gray/70 text-center">
          {" "}
          {t("register.note")}
          <Link
            className="underline text-off-black/70 font-semibold"
            to="/auth/login"
          >
            {t("register.redirectCTA")}
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Register;
