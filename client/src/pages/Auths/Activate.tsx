import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/Buttons/Button";
import CodeInput, {
  type CodeFormValues,
} from "../../components/Inputs/CodeInput";

import { activateUser } from "../../services/authService";
import { login } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

const Activate = () => {
  const { activation_token } = useParams();
  const { t } = useTranslation();

  const form = useForm<CodeFormValues>({
    mode: "all",
    defaultValues: {
      code1: "",
      code2: "",
      code3: "",
      code4: "",
    },
  });

  const onSubmit = async (data: CodeFormValues) => {
    try {
      const activation_number = Object.values(data).join("");
      const res = await activateUser({ activation_number, activation_token });
      toast.success(t("activate.success"));

      const { user, access_token } = res.data;
      login(user, access_token);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t("activate.error"));
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="w-full max-w-[400px] p-10"
    >
      <h1 className="font-the-seasons text-3xl text-center mb-3 font-bold">
        {t("activate.title")}{" "}
      </h1>
      <p className="font-inter font-light text-center text mb-6">
        {t("activate.subTitle")}{" "}
      </p>

      <CodeInput form={form} />

      {Object.keys(form.formState.errors).length > 0 && (
        <p className="text-red-500 text-sm text-center">
          {t("activate.paragraph")}
        </p>
      )}

      <Button
        styles="bg-off-black border-off-black hover:text-off-black !py-2.5 mx-auto !rounded-lg !my-6"
        content="Verify Email"
        type="submit"
      />

      <p className="text-sm text-warm-gray/70 text-center">
        {t("activate.note")}
        <span className="underline text-off-black/70 font-semibold cursor-pointer">
          {t("activate.ctaResend")}
        </span>
      </p>
    </form>
  );
};

export default Activate;
