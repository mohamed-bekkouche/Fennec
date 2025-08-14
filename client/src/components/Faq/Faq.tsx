import { useTranslation, Trans } from "react-i18next";
import Button from "../Buttons/Button";
import SectionHeader from "../SectionHeader";
import FaqCard from "./FaqCard";

const Faq = () => {
  const { t } = useTranslation();
  return (
    <div className="h-fit py-10 bg-cold-gray">
      <SectionHeader
        subTitle={t("home.faq.subTitle")}
        title={t("home.faq.title")}
      />
      <div className="px-3 pt-5 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <FaqCard key={i} question={t(`home.faq.questions.${i}.q`)}>
            <p className="whitespace-pre-line">
              <Trans
                i18nKey={`home.faq.questions.${i}.a`}
                components={{ b: <span className="font-bold" /> }}
              />
            </p>
          </FaqCard>
        ))}{" "}
      </div>
      <p className="text-center max-md:text-sm mb-5 px-3">
        {t("home.faq.paragraph")}
      </p>
      <Button
        styles="bg-off-black text-off-black hover:text-off-black rounded-none mx-auto font-light px-7 !w-fit"
        content={t("home.faq.cta")}
      />
    </div>
  );
};

export default Faq;
