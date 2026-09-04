import Link from "next/link";

type SiteHeaderProps = {
  dark?: boolean;
  active?: "gallery";
};

export function SiteHeader({ dark = false, active }: SiteHeaderProps) {
  return (
    <header role="banner" className={`site-header ${dark ? "site-header-dark" : ""}`}>
      <div className="page-frame site-header-inner">
        <Link className="brand" href="/" aria-label="Мастерская Мятый Элемент">
          МАСТЕРСКАЯ
        </Link>
        <nav className="site-nav" aria-label="Основная навигация">
          <Link className={active === "gallery" ? "is-active" : ""} href="/gallery" aria-current={active === "gallery" ? "page" : undefined}>
            Галерея
          </Link>
          <Link href="/#contacts">Контакты</Link>
        </nav>
        <a className="header-call" href="tel:+79801560107" aria-label="Позвонить в мастерскую">
          +7 980 156-01-07
        </a>
      </div>
    </header>
  );
}
