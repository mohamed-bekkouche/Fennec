import { useEffect, useRef, useState, useCallback } from "react";
import useDimension from "../../hooks/useDimensions";
import { useTranslation } from "react-i18next";
import useDirection from "../../hooks/useDirection";
import { easeInOut, motion, AnimatePresence } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import type { IProduct } from "../../types/Product";
import { getProducts } from "../../services/productService";
import Image from "../../components/Image";

import useDebounce from "../../hooks/useDebounce";
import useClickOutside from "../../hooks/useClickOutside";
import { useNavigate } from "react-router-dom";
import { useFormatCurrency } from "../../hooks/useFormatCurrency";

const MIN_QUERY_LEN = 2;

const SearchToggleInput = () => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "layouts.nav.searchToggleInput",
  });
  const { formatCurrency } = useFormatCurrency();
  const navigate = useNavigate();
  const direction = useDirection();
  const { width } = useDimension();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [query, setQuery] = useState("");
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(-1);

  const debouncedQuery = useDebounce(query.trim(), 500);

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setFocus(false);
    setActiveIdx(-1);
  }, []);

  useClickOutside(rootRef as any, close);

  const effectiveWidth = width > 1280 ? 560 : width > 1024 ? 420 : 260;

  useEffect(() => {
    setErr(null);
    setProducts([]);
    setActiveIdx(-1);

    const fetchPorudcts = async () => {
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
        if (e?.name !== "AbortError") {
          setErr(t("error_generic"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPorudcts();
  }, [debouncedQuery, focus]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focus) return;
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
      } else {
        navigate(`/products?name=${encodeURIComponent(query.trim())}`);
        close();
      }
    } else if (e.key === "Escape") {
      close();
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={rootRef} className="z-[9999999] relative">
      <label
        className={`hidden lg:flex w-fit overflow-hidden rounded-full items-center duration-200 ${
          focus ? "bg-cold-gray shadow-sm" : ""
        }`}
      >
        <motion.input
          ref={inputRef}
          role="combobox"
          aria-expanded={focus}
          aria-controls="product-search-listbox"
          aria-autocomplete="list"
          aria-activedescendant={
            activeIdx >= 0 && products[activeIdx]
              ? `product-option-${products[activeIdx]._id}`
              : undefined
          }
          variants={{
            focus: {
              width: `${effectiveWidth}px`,
              [direction === "rtl" ? "paddingRight" : "paddingLeft"]: 12,
            },
            blur: {
              width: 0,
              [direction === "rtl" ? "paddingRight" : "paddingLeft"]: 0,
            },
          }}
          transition={{ duration: 0.2, ease: easeInOut }}
          animate={focus ? "focus" : "blur"}
          type="text"
          placeholder={t("search")}
          className="placeholder:text-off-black/50 py-1.5 focus:outline-none bg-transparent"
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocus(true)}
        />
        <button
          type="button"
          aria-label={focus ? t("close") : t("search")}
          onClick={() => {
            const next = !focus;
            setFocus(next);
            if (next) setTimeout(() => inputRef.current?.focus(), 0);
          }}
          className={`text-xl cursor-pointer duration-300 ${
            focus
              ? "text-off-white rounded-full bg-off-black p-1.5"
              : "text-off-black hover:scale-110"
          }`}
        >
          <FiSearch />
        </button>
      </label>

      <AnimatePresence>
        {focus && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, y: -4, transition: { duration: 0.1 } }}
            className="absolute z-50 w-full max-h-96 overflow-y-auto shadow-sm bg-off-white -bottom-3 left-0 translate-y-full flex flex-col p-2 gap-2 rounded-md border border-off-black/5"
          >
            <div className="px-2 py-1 text-xs text-off-black/60">
              {loading
                ? t("loading")
                : debouncedQuery.length < MIN_QUERY_LEN
                ? t("min_length", {
                    min: MIN_QUERY_LEN,
                  })
                : err
                ? err
                : products.length
                ? t("results", {
                    count: products.length,
                  })
                : t("no_results")}
            </div>

            <ul
              id="product-search-listbox"
              role="listbox"
              data-lenis-prevent
              data-lenis-prevent-wheel
              data-lenis-prevent-touch
              className="flex flex-col gap-1 max-h-96 overflow-y-auto min-h-0"
            >
              {!loading &&
                products.map((product, idx) => {
                  const active = idx === activeIdx;
                  return (
                    <li
                      id={`product-option-${product._id}`}
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
                        <p className="text-base md:text-lg truncate">
                          {product.name}
                        </p>
                      </div>
                      <div className="text-sm md:text-base shrink-0 tabular-nums">
                        {formatCurrency(product.price)}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchToggleInput;
