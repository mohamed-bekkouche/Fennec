import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../components/Buttons/Button";
import CodeInput, { type CodeFormValues } from "../components/Inputs/CodeInput";

import { confirmEmail } from "../services/authService";
import { setProfile } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

const ConfirmEmail = () => {
  const { t } = useTranslation();
  const { email_token } = useParams();
  const navigate = useNavigate();

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
      const res = await confirmEmail({ activation_number, email_token });
      toast.success(t("confirmEmail.emailConfirmed"));

      const { user } = res.data;
      setProfile(user);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || t("confirmEmail.confirmationFailed")
      );
    }
  };

  return (
    <div className="min-h-[calc(100dvh-277px)] w-full flex items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-10 px-20 rounded-md bg-whiteColor w-fit "
      >
        <h1 className="font-the-seasons text-4xl text-center mb-3 font-bold">
          {t("confirmEmail.title")}
        </h1>
        <p className="font-inter font-light text-center mb-6 leading-5 mx-auto max-w-xs">
          {t("confirmEmail.instruction")}
        </p>

        <CodeInput form={form} />

        {Object.keys(form.formState.errors).length > 0 && (
          <p className="text-red-500 text-sm text-center">
            {t("confirmEmail.enterAllDigits")}
          </p>
        )}

        <Button
          styles="bg-off-black border-off-black hover:text-off-black !py-2.5 mx-auto !rounded-lg !my-6"
          content={t("confirmEmail.verifyEmail")}
          type="submit"
          disabled={form?.formState?.isSubmitting}
        />

        <p className="text-sm text-warm-gray/70 text-center ">
          {t("confirmEmail.didntReceive")}{" "}
          <span className="underline text-off-black/70 font-semibold cursor-pointer">
            {t("confirmEmail.resendCode")}
          </span>
        </p>
      </form>
    </div>
  );
};

export default ConfirmEmail;
