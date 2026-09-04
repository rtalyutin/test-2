"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  src: string;
  alt: string;
  label: string;
};

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <>
      <div className="gallery-grid" aria-label="Работы мастерской">
        {items.map((item, index) => (
          <button
            className="gallery-card"
            type="button"
            key={item.src}
            onClick={() => setActiveIndex(index)}
            aria-label={`Открыть: ${item.label}`}
          >
            <img src={item.src} alt={item.alt} />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.label}
          onClick={(event) => {
            if (event.currentTarget === event.target) setActiveIndex(null);
          }}
        >
          <div className="gallery-lightbox-content">
            <button className="gallery-close" type="button" onClick={() => setActiveIndex(null)}>
              Закрыть
            </button>
            <img src={active.src} alt={active.alt} />
            <p>{active.label}</p>
          </div>
        </div>
      )}
    </>
  );
}
