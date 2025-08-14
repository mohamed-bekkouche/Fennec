import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import SectionHeader from "../../components/SectionHeader";
import InputField from "../../components/Inputs/InputField";
import ButtonColored from "../../components/Buttons/ButtonColored";

import { FiMail, FiSend, FiInstagram } from "react-icons/fi";
import { FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

type ContactForm = {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  company?: string; // honeypot
};

type Channel = {
  key: "email" | "whatsapp" | string;
  title: string;
  content: string;
  link: string;
  badge?: string;
};

type Social = {
  name: "Facebook" | "Instagram" | "TikTok" | string;
  link: string;
};

const iconForChannel = (key: string) => {
  if (key === "email") return <FiMail className="h-5 w-5" />;
  if (key === "whatsapp") return <FaWhatsapp className="h-5 w-5" />;
  return <FiMail className="h-5 w-5" />;
};

const iconForSocial = (name: string) => {
  if (name === "Facebook") return <FaFacebook className="h-6 w-6" />;
  if (name === "Instagram") return <FiInstagram className="h-6 w-6" />;
  if (name === "TikTok") return <FaTiktok className="h-6 w-6" />;
  return <FiInstagram className="h-6 w-6" />;
};

const Contact = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const channels = t("Contact.info.channels", {
    returnObjects: true,
  }) as Channel[];

  const socials = t("Contact.info.socials", {
    returnObjects: true,
  }) as Social[];

  const onSubmit = async (data: ContactForm) => {
    try {
      if (data.company) return; // honeypot
      // TODO: replace with your API call
      await new Promise((r) => setTimeout(r, 1200));
      setStatus("success");
      reset();
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <div className="bg-cold-gray">
      {/* Hero */}
      <div className="pt-10">
        <SectionHeader
          title={t("Contact.hero.title")}
          subTitle={t("Contact.hero.subTitle")}
        />
      </div>

      <div className="container grid gap-8 py-8 lg:grid-cols-2">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="rounded-xl bg-off-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("Contact.form.title")}
            </h2>
            <p className="text-warm-gray/70">{t("Contact.form.description")}</p>

            {status === "success" && (
              <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700">
                {t("Contact.form.status.success")}
              </div>
            )}
            {status === "error" && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700">
                {t("Contact.form.status.error")}
              </div>
            )}

            <div className="mt-6 grid gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <InputField
                    register={register}
                    error={errors.name}
                    name="name"
                    placeholder={t("Contact.form.placeholders.name")}
                    label={t("Contact.form.labels.name")}
                    validation={{
                      required: t("Contact.form.validation.nameRequired"),
                    }}
                  />
                  {errors.name?.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.name.message)}
                    </p>
                  )}
                </div>

                <div>
                  <InputField
                    register={register}
                    error={errors.email}
                    name="email"
                    type="email"
                    placeholder={t("Contact.form.placeholders.email")}
                    label={t("Contact.form.labels.email")}
                    validation={{
                      required: t("Contact.form.validation.emailRequired"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: t("Contact.form.validation.emailInvalid"),
                      },
                    }}
                  />
                  {errors.email?.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {String(errors.email.message)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <InputField
                  register={register}
                  error={errors.phoneNumber}
                  name="phoneNumber"
                  placeholder={t("Contact.form.placeholders.phoneNumber")}
                  label={t("Contact.form.labels.phoneNumber")}
                  validation={{
                    required: t("Contact.form.validation.phoneRequired"),
                    minLength: {
                      value: 8,
                      message: t("Contact.form.validation.phoneTooShort"),
                    },
                  }}
                />
                {errors.phoneNumber?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(errors.phoneNumber.message)}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 text-sm font-medium">
                  {t("Contact.form.labels.message")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("message", {
                    required: t("Contact.form.validation.messageRequired"),
                    minLength: {
                      value: 20,
                      message: t("Contact.form.validation.messageMin"),
                    },
                  })}
                  rows={7}
                  className={`w-full resize-none rounded-md border px-3 py-2.5 placeholder:text-warm-gray/40 focus:outline-none ${
                    errors.message
                      ? "border-red-500 focus:border-red-500"
                      : "border-warm-gray/40 focus:border-warm-gray"
                  }`}
                  placeholder={t("Contact.form.placeholders.message")}
                />
                {errors.message?.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {String(errors.message.message)}
                  </p>
                )}
              </div>

              {/* Honeypot */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                {...register("company")}
              />

              <ButtonColored
                content={
                  <span className="inline-flex items-center gap-2">
                    {isSubmitting ? (
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          opacity="0.2"
                        />
                        <path
                          d="M22 12a10 10 0 0 1-10 10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                      </svg>
                    ) : (
                      <FiSend className="h-5 w-5" />
                    )}
                    <span>
                      {t(
                        isSubmitting
                          ? "Contact.form.submit.loading"
                          : "Contact.form.submit.idle"
                      )}
                    </span>
                  </span>
                }
                type="submit"
                disabled={isSubmitting}
                styles="w-full"
              />
            </div>
          </section>
        </form>

        {/* Info */}
        <section className="space-y-8">
          <div className="rounded-xl bg-off-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <h2 className="text-2xl font-bold tracking-tight">
              {t("Contact.info.title")}
            </h2>
            <p className="text-warm-gray/70">{t("Contact.info.description")}</p>

            {/* Channels */}
            <div className="mt-6 grid gap-4">
              {channels.map((item, idx) => (
                <a
                  key={idx}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    group flex items-center gap-4 rounded-xl border border-white/60
                    bg-cold-gray/40 p-4 ring-1 ring-black/5 transition-all
                    duration-300 hover:-translate-y-0.5 hover:bg-cold-gray/60 hover:shadow
                  "
                >
                  <div
                    className={`rounded-full p-3 ring-1 ${
                      item.key === "email"
                        ? "bg-red-100 text-red-700 ring-red-200"
                        : item.key === "whatsapp"
                        ? "bg-green-100 text-green-700 ring-green-200"
                        : "bg-warm-gray/20 text-off-black ring-black/10"
                    }`}
                  >
                    {iconForChannel(item.key)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {item.badge && (
                        <span className="rounded-full bg-off-black/5 px-2 py-0.5 text-xs text-off-black/80">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-warm-gray/70">{item.content}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Socials */}
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-semibold">Follow Us</h3>
              <div className="flex flex-wrap gap-3">
                {socials.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`rounded-full p-4 transition-colors duration-300 ${
                      s.name === "Facebook"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : s.name === "Instagram"
                        ? "bg-pink-600 hover:bg-pink-500 text-white"
                        : s.name === "TikTok"
                        ? "bg-black text-white hover:bg-warm-gray"
                        : "bg-off-black text-off-white hover:opacity-90"
                    }`}
                    aria-label={s.name}
                    title={s.name}
                  >
                    {iconForSocial(s.name)}
                  </a>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="mt-8 rounded-lg bg-cold-gray/40 p-4 ring-1 ring-black/5">
              <h3 className="mb-2 text-lg font-semibold">
                {t("Contact.info.hours.title")}
              </h3>
              <p className="text-warm-gray/70">
                {t("Contact.info.hours.lines.0")}
                <br />
                {t("Contact.info.hours.lines.1")}
                <br />
                {t("Contact.info.hours.lines.2")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
