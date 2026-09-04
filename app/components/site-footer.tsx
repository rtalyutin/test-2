import Link from "next/link";

export function SiteFooter() {
  return (
    <footer role="contentinfo" className="site-footer">
      <div className="page-frame site-footer-inner">
        <Link className="footer-brand" href="/">
          МАСТЕРСКАЯ МЯТЫЙ ЭЛЕМЕНТ
        </Link>
        <div className="footer-links">
          <Link href="/gallery">Галерея</Link>
          <Link href="/#contacts">Контакты</Link>
          <a href="tel:+79801560107">+7 980 156-01-07</a>
        </div>
      </div>
    </footer>
  );
}
