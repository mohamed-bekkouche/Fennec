import type { HTMLAttributeReferrerPolicy } from "react";

interface IImage {
  src: string;
  alt: string;
  styles?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  referrerPolicy?: HTMLAttributeReferrerPolicy | undefined;
  fromServer?: boolean;
}

const Image = ({
  src,
  alt,
  styles = "",
  loading = "lazy",
  fetchPriority = "auto",
  referrerPolicy,
  fromServer = false,
}: IImage) => {
  return (
    <img
      src={fromServer ? `${import.meta.env.VITE_SERVER_URL}${src}` : src}
      alt={alt}
      className={styles}
      loading={loading}
      fetchPriority={fetchPriority}
      referrerPolicy={referrerPolicy}
    />
  );
};

export default Image;
