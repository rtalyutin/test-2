import type { Metadata } from "next";
import { GalleryGrid } from "../components/gallery-grid";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "Галерея работ — Мастерская Мятый Элемент",
};

const works = [
  { src: "/images/gallery/gallery-repair-01.png", alt: "Повреждённая арка автомобиля", label: "Кузов" },
  { src: "/images/gallery/gallery-repair-02.png", alt: "Арка автомобиля после восстановления", label: "Геометрия" },
  { src: "/images/gallery/gallery-repair-03.png", alt: "Повреждение боковой части автомобиля", label: "Детали" },
  { src: "/images/gallery/gallery-repair-04.png", alt: "Боковая панель автомобиля", label: "Кузов" },
  { src: "/images/gallery/gallery-repair-05.png", alt: "Повреждённый нижний порог автомобиля", label: "Ремонт" },
  { src: "/images/gallery/gallery-repair-06.png", alt: "Восстановленная боковая часть автомобиля", label: "Покраска" },
];

export default function GalleryPage() {
  return (
    <main className="gallery-page">
      <div className="gallery-surface">
        <SiteHeader dark active="gallery" />

        <section className="gallery-stage page-frame" aria-labelledby="gallery-title">
          {/* The decorative local asset keeps its intrinsic proportions. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="gallery-spraygun"
            src="/images/gallery/gallery-spraygun.png"
            alt=""
            aria-hidden="true"
          />
          <div className="gallery-heading">
            <h1 id="gallery-title">
              <span>ГАЛЕРЕЯ</span>
              <span>РАБОТ</span>
            </h1>
            <p>КУЗОВНОЙ РЕМОНТ</p>
          </div>

          <GalleryGrid items={works} />

          <div className="gallery-legend" aria-label="Особенности мастерской">
            <span>ФОТО РАБОТ</span>
            <span>РЕМОНТ ГЕОМЕТРИИ</span>
            <span>ГАРАНТИЯ 1 ГОД</span>
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}
