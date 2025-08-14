import { motion, AnimatePresence } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

interface ILuanguagesProps {
  showLanguages: boolean;
  setShowLanguages: Dispatch<SetStateAction<boolean>>;
}

export const Luanguages = ({
  showLanguages,
  setShowLanguages,
}: ILuanguagesProps) => {
  const { i18n, t } = useTranslation();
  return (
    <AnimatePresence>
      {showLanguages && (
        <motion.ul
          variants={{
            hidden: { translateY: "-100%", opacity: 0 },
            visible: {
              translateY: 0,
              opacity: 1,
              transition: {
                opacity: {
                  duration: 0.05,
                },
              },
            },
          }}
          initial="hidden"
          animate={showLanguages ? "visible" : "hidden"}
          exit="hidden"
          className="absolute -bottom-5 translate-y-full w-fit left-1/2 -translate-x-1/2 -z-10 h-fit overflow-hidden bg-off-white rounded-lg shadow-lg border border-gray-200 py-2"
        >
          {["en", "ar", "fr"].map((lang, key) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: key * 0.1, duration: 0.1 }}
              onClick={() => {
                setShowLanguages(false);
                setTimeout(() => i18n.changeLanguage(lang), 300);
              }}
              className="px-4 py-2.5 text-sm font-medium text-off-black hover:bg-off-black/15 hover:text-off-black cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              {t(`layouts.nav.languages.${lang}`)}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  );
};
