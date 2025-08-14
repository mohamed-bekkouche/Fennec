// import { motion, AnimatePresence } from "framer-motion";
// import type { Dispatch, SetStateAction } from "react";
// import { useTranslation } from "react-i18next";
// import { FaXmark } from "react-icons/fa6";

// interface ISearchBarProps {
//   showSearchBar: boolean;
//   setShowSearchBar: Dispatch<SetStateAction<boolean>>;
// }

// const MobileSearchBar = ({
//   showSearchBar,
//   setShowSearchBar,
// }: ISearchBarProps) => {
//   const { t } = useTranslation();
//   return (
//     <AnimatePresence>
//       {showSearchBar && (
//         <motion.div
//           variants={{
//             hidden: { translateY: "-100%" },
//             visible: { translateY: 0 },
//           }}
//           initial="hidden"
//           animate={showSearchBar ? "visible" : "hidden"}
//           exit="hidden"
//           className="md:hidden absolute bottom-0 translate-y-full w-[98%] start-[1%] z-0 border-primary border-[1px] flex h-10 overflow-hidden"
//         >
//           <input
//             type="text"
//             placeholder={t("layouts.nav.search")}
//             className="bg-cold-gray flex-1 py-2 px-3 "
//           />
//           <span
//             onClick={() => setShowSearchBar(false)}
//             className="h-10 w-10 flex justify-center items-center text-xl bg-off-black text-off-white"
//           >
//             {" "}
//             <FaXmark />
//           </span>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default MobileSearchBar;

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaXmark } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import type { IProduct } from "../../types/Product";
import { getProducts } from "../../services/productService";
import useDebounce from "../../hooks/useDebounce";
import Image from "../../components/Image";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

// keep this in sync with desktop
const MIN_QUERY_LEN = 2;

interface ISearchBarProps {
  showSearchBar: boolean;
  setShowSearchBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileSearchBar = ({
  showSearchBar,
  setShowSearchBar,
}: ISearchBarProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "layouts.nav.searchToggleInput",
  });

  const { formatCurrency } = useFormatCurrency();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), 400);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setShowSearchBar(false);
    setProducts([]);
    setErr(null);
    setActiveIdx(-1);
    setQuery("");
  }, [setShowSearchBar]);

  // autofocus when opening
  useEffect(() => {
    if (showSearchBar) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showSearchBar]);

  // fetch on mobile
  useEffect(() => {
    setErr(null);
    setActiveIdx(-1);
    setProducts([]);

    if (!showSearchBar) return;

    const run = async () => {
      try {
        setLoading(true);
        const {
          data: { products },
        } = await getProducts({
          name: debouncedQuery,
          limit: 20,
        });
        setProducts(products || []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setErr(t("error_generic"));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedQuery, showSearchBar, t]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSearchBar) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (products.length ? (i + 1) % products.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) =>
        products.length ? (i - 1 + products.length) % products.length : -1
      );
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && products[activeIdx]) {
        navigate(`/products/${products[activeIdx]._id}`);
        close();
      } else if (query.trim().length) {
        navigate(`/products?name=${encodeURIComponent(query.trim())}`);
        close();
      }
    } else if (e.key === "Escape") {
      close();
    }
  };

  return (
    <AnimatePresence>
      {showSearchBar && (
        <motion.div
          key="mobile-search"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.2, ease: easeInOut },
          }}
          exit={{ y: "-100%", opacity: 0, transition: { duration: 0.15 } }}
          className="lg:hidden fixed inset-x-0 top-0 z-[9999] left-0 h-dvh bg-off-black/90"
          aria-modal="true"
          role="dialog"
        >
          {/* Panel */}
          <div
            ref={panelRef}
            className="relative bg-off-white rounded-b-sm shadow-md mx-2 mt-2 overflow-hidden"
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
          >
            {/* Input row */}
            <div className="flex items-center gap-2 p-2 border-b border-off-black/10">
              <input
                ref={inputRef}
                type="text"
                placeholder={t("search")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                className="flex-1 bg-cold-gray rounded-md py-2 px-3 outline-none"
              />
              <button
                aria-label={t("close")}
                onClick={close}
                className="h-10 w-10 flex justify-center items-center text-xl bg-off-black text-off-white rounded-md"
              >
                <FaXmark />
              </button>
            </div>

            {/* Status row */}
            <div className="px-3 py-1 text-xs text-off-black/60">
              {loading
                ? t("loading")
                : debouncedQuery.length < MIN_QUERY_LEN
                ? t("min_length", { min: MIN_QUERY_LEN })
                : err
                ? err
                : products.length
                ? t("results", { count: products.length })
                : t("no_results")}
            </div>

            {/* Results (Lenis-safe scroll container) */}
            <ul
              id="mobile-product-search-listbox"
              role="listbox"
              aria-live="polite"
              className="max-h-[70vh] overflow-y-auto min-h-0 flex flex-col gap-1 p-2"
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
            >
              {!loading &&
                products.map((product, idx) => {
                  const active = idx === activeIdx;
                  return (
                    <li
                      id={`mobile-product-option-${product._id}`}
                      role="option"
                      aria-selected={active}
                      key={product._id}
                      onMouseEnter={() => setActiveIdx(idx)}
                      onMouseLeave={() => setActiveIdx(-1)}
                      onClick={() => {
                        navigate(`/products/${product._id}`);
                        close();
                      }}
                      className={`p-2 rounded-md flex justify-between items-center cursor-pointer transition ${
                        active ? "bg-cold-gray/60" : "hover:bg-cold-gray/40"
                      }`}
                    >
                      <div className="p-2 rounded-sm flex gap-3 items-center min-w-0">
                        <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0">
                          <Image
                            src={product.images?.[0]}
                            alt={product.name}
                            styles="w-full h-full object-cover"
                            fromServer
                          />
                        </div>
                        <p className="text-base truncate">{product.name}</p>
                      </div>
                      <div className="text-sm shrink-0 tabular-nums">
                        {formatCurrency(product.price)}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchBar;
