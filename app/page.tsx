import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

const craft = [
  {
    title: "КУЗОВ",
    text: "Выправляем детали, восстанавливаем зазоры и готовим поверхность к точной окраске.",
  },
  {
    title: "РАМА",
    text: "Проверяем контрольные точки и возвращаем геометрию автомобиля.",
  },
  {
    title: "ПОКРАСКА",
    text: "Подбираем оттенок и собираем покрытие в единый чистый тон.",
  },
];

export default function Home() {
  return (
    <main className="site-home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" aria-hidden="true" />
        <SiteHeader dark />

        <div className="hero-content page-frame">
          <div className="hero-title-stack">
            <h1 id="hero-title">
              <span className="hero-title-top">МАСТЕРСКАЯ</span>
              <span>МЯТЫЙ</span>
              <span>ЭЛЕМЕНТ</span>
            </h1>
            <p className="hero-subtitle">КУЗОВНОЙ РЕМОНТ</p>
          </div>

          <div className="hero-copy">
            <p className="hero-lead">От царапины до серьёзного кузовного ремонта.</p>
            <div className="hero-actions">
              <a className="button button-metal" href="tel:+79801560107">
                Позвонить
              </a>
              <a className="button button-metal" href="/gallery">
                Смотреть галерею
              </a>
            </div>
          </div>
        </div>

        <div className="hero-bottom page-frame" aria-label="Направления мастерской">
          <span>РЕМОНТ ГЕОМЕТРИИ</span>
          <span>ГАРАНТИЯ 1 ГОД</span>
          <a href="#about">Листать вниз</a>
        </div>
      </section>

      <section className="craft-section section page-frame" id="about">
        <p className="section-kicker">МАСТЕРСКАЯ МЯТЫЙ ЭЛЕМЕНТ</p>
        <div className="section-heading">
          <h2>Точность в каждой линии кузова.</h2>
          <p>
            Собираем автомобиль обратно в его форму: без лишней спешки и с контролем на каждом этапе.
          </p>
        </div>

        <div className="craft-grid">
          {craft.map((item, index) => (
            <article className="craft-card" key={item.title}>
              <span className="craft-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="work-invite">
        <div className="page-frame work-invite-inner">
          <p className="section-kicker">ФОТО РАБОТ</p>
          <h2>Ремонт, который можно рассмотреть в деталях.</h2>
          <a className="metal-link" href="/gallery">
            Открыть галерею работ
          </a>
        </div>
      </section>

      <section className="contacts section page-frame" id="contacts">
        <div>
          <p className="section-kicker">КОНТАКТЫ</p>
          <h2>Связаться с мастерской</h2>
        </div>
        <div className="contact-panel">
          <p>Телефон для связи</p>
          <a className="phone-link" href="tel:+79801560107">
            +7 980 156-01-07
          </a>
          <p className="contact-note">Позвоните, чтобы обсудить автомобиль и удобное время осмотра.</p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
