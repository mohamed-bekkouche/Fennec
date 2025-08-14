import Image from "../components/Image";
import { setProfile, useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import InputField from "../components/Inputs/InputField";
import { updateProfile } from "../services/authService";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import ButtonColored from "../components/Buttons/ButtonColored";
import { useTranslation } from "react-i18next";

type FormVals = {
  username: string;
  email: string;
  password?: string;
  newPassword?: string;
  confirmNewPassword?: string;
};

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<FormVals>({
    mode: "onBlur",
    defaultValues: { username: user?.username || "", email: user?.email || "" },
  });

  const newPassword = watch("newPassword");

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onSubmit = async (data: FormVals) => {
    if (
      (!data.email || data.email === user?.email) &&
      !data.password &&
      (!data.username || data.username === user?.username) &&
      !image
    ) {
      toast.error(t("settings.makeChange"));
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value as string);
      }
    });
    if (image) formData.append("image", image);

    try {
      const oldEmail = user?.email;
      const res = await updateProfile(formData);

      if (data.username && data.username !== user?.username)
        toast.success(t("settings.usernameUpdated"));
      if (image) toast.success(t("settings.profilePictureUpdated"));
      if (data.email && data.email !== user?.email)
        toast.success(t("settings.emailUpdated"));

      setProfile({ ...res.data.user, email: oldEmail });

      setTimeout(() => {
        if (data.email && data.email !== oldEmail) {
          navigate("/confirm-email");
        }
      }, 1500);
    } catch (error: any) {
      console.error(error);
      toast.error(t("settings.updateFailed"));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-xl mx-auto">
      <SectionHeader
        title={t("settings.title")}
        subTitle={t("settings.subTitle")}
      />

      <div className="flex items-center gap-10 justify-start mb-5 mt-8">
        <div className="h-32 w-32 block relative rounded-full bg-off-black text-white font-normal text-xl content-center text-center uppercase">
          {user?.avatar || preview ? (
            <Image
              src={preview || (user?.avatar as string)}
              alt={user?.username || "user"}
              styles="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
              fromServer={!preview}
            />
          ) : (
            <>{user?.username?.charAt(0)}</>
          )}
        </div>

        <label
          htmlFor="image"
          className="block text-sm px-5 py-2 rounded-full border border-off-black/20 cursor-pointer bg-cold-gray/60"
        >
          {t("settings.uploadNewImage")}
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          name="username"
          placeholder={t("settings.placeholders.username")}
          register={register}
          validation={{
            required: false,
            minLength: {
              value: 3,
              message: t("errors.username.minLength"),
            },
          }}
          error={errors.username}
          label={t("settings.labels.username")}
          optional={false}
        />

        <InputField
          name="email"
          type="email"
          placeholder={t("settings.placeholders.email")}
          register={register}
          validation={{
            required: t("errors.email.required") as unknown as boolean, // react-hook-form accepts string to show as message
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("errors.email.invalid"),
            },
          }}
          error={errors.email}
          label={t("settings.labels.email")}
          optional={false}
        />

        {!user?.googleAccount && (
          <>
            <InputField
              name="password"
              type="password"
              placeholder={t("settings.placeholders.currentPassword")}
              register={register}
              validation={{
                required: false,
                minLength: {
                  value: 6,
                  message: t("errors.password.minLength"),
                },
              }}
              error={errors.password}
              label={t("settings.labels.currentPassword")}
              optional={false}
            />

            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="block ml-auto mr-0 border-none underline cursor-pointer font-medium lowercase text-blue-800 text-xs -mt-2"
            >
              {t("settings.forgotPasswordLink")}
            </button>

            <InputField
              name="newPassword"
              type="password"
              placeholder={t("settings.placeholders.newPassword")}
              register={register}
              validation={{
                required: false,
                minLength: {
                  value: 6,
                  message: t("errors.password.minLength"),
                },
              }}
              error={errors.newPassword}
              label={t("settings.labels.newPassword")}
              optional={false}
            />

            <InputField
              name="confirmNewPassword"
              type="password"
              placeholder={t("settings.placeholders.confirmNewPassword")}
              register={register}
              validation={{
                required: false,
                validate: (value) =>
                  value === newPassword ||
                  (t("errors.password.noMatch") as string),
              }}
              error={errors.confirmNewPassword}
              label={t("settings.labels.confirmNewPassword")}
              optional={false}
            />
          </>
        )}

        <ButtonColored
          variant="success"
          type="submit"
          content={t("settings.updateProfile")}
          disabled={isSubmitting}
          styles="!mr-0 !ml-auto !mt-5"
        />
      </form>
    </div>
  );
};

export default Settings;
