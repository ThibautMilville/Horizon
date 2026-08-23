import {useState} from "react";

import {PlaceholderIcon} from "@/shared/ui/actions/action-icons";

import styles from "./CoverImage.module.scss";

type CoverImageProps = {
  src?: string | null;
  alt?: string;
  className?: string;
};

export function CoverImage({src, alt = "", className}: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = typeof src === "string" ? src.trim() : "";
  const showImage = Boolean(resolved) && !failed;

  return (
    <div className={`${styles.root} ${className ?? ""}`.trim()}>
      {showImage ? (
        <img alt={alt} className={styles.image} onError={() => setFailed(true)} src={resolved} />
      ) : (
        <div aria-hidden="true" className={styles.placeholder}>
          <PlaceholderIcon size={42} />
        </div>
      )}
    </div>
  );
}
