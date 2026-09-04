type SiteHeaderProps = {
  dark?: boolean;
  active?: "gallery";
};

export function SiteHeader({ dark = false, active }: SiteHeaderProps) {
  return (
    <header className={`site-header ${dark ? "site-header-dark" : ""}`}>
      <div className="page-frame site-header-inner">
        <a className="brand" href="/" aria-label="Мастерская Мятый Элемент">
          МАСТЕРСКАЯ
        </a>
        <nav className="site-nav" aria-label="Основная навигация">
          <a className={active === "gallery" ? "is-active" : ""} href="/gallery">
            Галерея
          </a>
          <a href="/#contacts">Контакты</a>
        </nav>
        <a className="header-call" href="tel:+79801560107" aria-label="Позвонить в мастерскую">
          +7 980 156-01-07
        </a>
      </div>
    </header>
  );
}
