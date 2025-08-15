import type { HTMLAttributeReferrerPolicy } from "react";

interface IImage {
  src: string;
  alt: string;
  styles?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  fromServer?: boolean;
  style?: React.CSSProperties;
}

const Image = ({
  src,
  alt,
  styles = "",
  loading = "lazy",
  fetchPriority = "auto",
  referrerPolicy,
  fromServer = false,
  style,
}: IImage) => {
  return (
    <img
      src={fromServer ? `${import.meta.env.VITE_API_URL}${src}` : src}
      alt={alt}
      className={styles}
      loading={loading}
      fetchPriority={fetchPriority}
      referrerPolicy={referrerPolicy}
      style={style}
    />
  );
};

export default Image;
