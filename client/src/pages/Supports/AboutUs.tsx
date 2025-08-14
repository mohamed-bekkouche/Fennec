import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaShippingFast, FaMedal, FaMapMarkerAlt } from "react-icons/fa";

import SectionHeader from "../../components/SectionHeader";
import Image from "../../components/Image";
import ButtonColored from "../../components/Buttons/ButtonColored";

type WhyItem = {
  title: string;
  description: string;
};

type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

const AboutUs = () => {
  const { t } = useTranslation();

  // Pull arrays directly from i18n
  const whyItems = t("AboutUs.whyChooseUs.items", {
    returnObjects: true,
  }) as WhyItem[];

  const steps = t("AboutUs.process.steps", {
    returnObjects: true,
  }) as ProcessStep[];

  // Map images (assets stay local, text comes from i18n in the same order)
  const whyItemsWithImages = [
    { image: "/images/supports/fabrics.png", ...whyItems[0] },
    { image: "/images/supports/del.png", ...whyItems[1] },
    { image: "/images/supports/fashion.webp", ...whyItems[2] },
  ];

  return (
    <div className="bg-cold-gray">
      {/* Hero */}
      <div className="pt-10">
        <SectionHeader
          title={t("AboutUs.hero.title")}
          subTitle={t("AboutUs.hero.subTitle")}
        />
      </div>

      {/* Page container */}
      <div className="container py-10 space-y-14 md:space-y-20">
        {/* Brand Intro */}
        <section className="grid items-center gap-8 rounded-xl bg-off-white p-6 shadow-sm md:grid-cols-2 md:p-8">
          <div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              {t("AboutUs.brandIntro.title")}
            </h2>
            <p className="mb-4 text-warm-gray/70">
              {t("AboutUs.brandIntro.paragraph1")}
            </p>
            <p className="mb-4 text-warm-gray/70">
              {t("AboutUs.brandIntro.paragraph2")}
            </p>
            <p className="text-warm-gray/70">
              {t("AboutUs.brandIntro.paragraph3")}
            </p>
          </div>

          <div className="relative h-80 overflow-hidden rounded-xl ring-1 ring-black/5">
            <Image
              alt="Elevated menswear background"
              src="/images/suits/background1.png"
              styles="w-full h-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-black/10" />
          </div>
        </section>

        {/* Quick stats strip */}
        <section className="grid gap-3 rounded-xl bg-off-black px-6 py-5 text-off-white shadow-sm sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <FaMedal className="h-6 w-6 opacity-90" />
            <p className="text-sm opacity-90">
              <span className="font-semibold">
                {t("AboutUs.stats.clients").split(" ")[0]}
              </span>{" "}
              {t("AboutUs.stats.clients").split(" ").slice(1).join(" ")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <FaShippingFast className="h-6 w-6 opacity-90" />
            <p className="text-sm opacity-90">{t("AboutUs.stats.delivery")}</p>
          </div>
          <div className="flex items-center gap-3">
            <FaMapMarkerAlt className="h-6 w-6 opacity-90" />
            <p className="text-sm opacity-90">{t("AboutUs.stats.coverage")}</p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="rounded-xl bg-off-white p-6 shadow-sm md:p-8">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
            {t("AboutUs.whyChooseUs.title")}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {whyItemsWithImages.map((item, idx) => (
              <article
                key={idx}
                className="
                  group relative h-80 overflow-hidden rounded-xl
                  border border-white/50 bg-cold-gray/20
                  shadow-sm ring-1 ring-black/5 transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-lg hover:ring-black/10
                "
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    styles="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Overlay for legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="mb-1 text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm/6 text-white/90 line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="rounded-xl bg-off-white p-6 shadow-sm md:p-8">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight">
            {t("AboutUs.process.title")}
          </h2>

          <ol className="relative grid gap-8 md:grid-cols-2">
            <span className="pointer-events-none absolute left-4 top-0 h-full w-px bg-cold-gray/60 md:left-1/2 md:-translate-x-1/2" />
            {steps.map((item, i) => (
              <li
                key={i}
                className={`relative ${i % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}
              >
                <div className="absolute left-3 top-1.5 h-4 w-4 rounded-full border-2 border-off-black bg-off-white md:left-1/2 md:-translate-x-1/2" />
                <div className="flex gap-4 rounded-lg border border-cold-gray/50 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-off-black text-off-white">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                    <p className="text-warm-gray/70">{item.description}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden rounded-xl">
          <div className="absolute inset-0">
            <Image
              alt="Fine tailoring background"
              src="/images/suits/background1.png"
              styles="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
          </div>

          <div className="relative z-10 px-6 py-10 text-center text-off-white md:px-10 md:py-14">
            <h2 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl">
              {t("AboutUs.cta.title")}
            </h2>
            <p className="mx-auto mb-6 max-w-3xl text-cold-gray/85">
              {t("AboutUs.cta.description")}
            </p>

            <ButtonColored
              styles="!py-0 !px-0 mx-auto"
              content={
                <Link className="px-10 py-3" to="/products">
                  {t("AboutUs.cta.button")}
                </Link>
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
