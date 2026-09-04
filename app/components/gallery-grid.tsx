"use client";

import { Dialog } from "radix-ui";

type GalleryItem = {
  src: string;
  alt: string;
  label: string;
};

type GalleryGridProps = {
  items: GalleryItem[];
};

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="gallery-grid" aria-label="Работы мастерской">
      {items.map((item, index) => (
        <Dialog.Root key={item.src}>
          <Dialog.Trigger asChild>
            <button className="gallery-card" type="button" aria-label={`Открыть: ${item.alt}`}>
              {/* Local photos retain their original crop without an image service. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} loading={index < 3 ? "eager" : "lazy"} decoding="async" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="gallery-lightbox" />
            <Dialog.Content className="gallery-lightbox-content" aria-describedby={undefined}>
              <Dialog.Close asChild>
                <button className="gallery-close" type="button">Закрыть</button>
              </Dialog.Close>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt={item.alt} />
              <Dialog.Title asChild><p>{item.label}</p></Dialog.Title>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      ))}
    </div>
  );
}
