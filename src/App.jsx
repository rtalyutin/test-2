import { useEffect, useMemo, useRef, useState } from "react";
import { archiveStats, STORY_ARCHIVE } from "./storyArchive.js";

const STATES = {
  release: { label: "Не можете отпустить", groupId: "bear-stories", chapterId: "closed-path" },
  late: { label: "Всё поняли слишком поздно", groupId: "bear-stories", chapterId: "understood-everything" },
  forward: { label: "Пора идти дальше", groupId: "bear-stories", chapterId: "page-ahead" },
};

function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function finalVersion(chapter) {
  return chapter.versions.find((version) => version.status === "final") ?? chapter.versions[0];
}

function panelExcerpt(paragraph, maxLength = 190) {
  const clean = paragraph.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/[\s,;:]+$/, "")}…`;
}

function panelQuote(paragraph) {
  const quoted = paragraph.match(/«([^»]{8,110})»/);
  if (quoted) return `«${quoted[1]}»`;
  const spoken = paragraph.match(/(?:^|\s)—\s*([^.!?]{8,90}[.!?])/);
  return spoken ? spoken[1].trim() : null;
}

function ComicReader({ version }) {
  const panelCount = Math.min(6, Math.max(4, version.paragraphs.length));
  const step = (version.paragraphs.length - 1) / (panelCount - 1);
  const panels = Array.from({ length: panelCount }, (_, index) => {
    const paragraph = version.paragraphs[Math.round(index * step)];
    return { paragraph, quote: panelQuote(paragraph) };
  });

  return (
    <div className="comic-reader" aria-label={`Комикс-раскадровка: ${version.title}`}>
      <div className="comic-reader__intro">
        <span className="comic-reader__mark">Формат · комикс</span>
        <p>Та же редакция, разложенная на шесть кадров. Текст не переписан — меняется только способ просмотра.</p>
      </div>
      <div className="comic-grid">
        {panels.map(({ paragraph, quote }, index) => (
          <section className={`comic-panel comic-panel--${(index % 4) + 1}`} key={`${version.id}-${index}`}>
            <div className="comic-panel__topline">
              <span>Кадр {String(index + 1).padStart(2, "0")}</span>
              <span>{index === panels.length - 1 ? "финал" : "архив"}</span>
            </div>
            <p className="comic-panel__caption">{panelExcerpt(paragraph)}</p>
            {quote ? <p className="comic-panel__bubble">{quote}</p> : <p className="comic-panel__aside">Закадровый текст</p>}
            <span className="comic-panel__corner" aria-hidden="true">{index % 2 === 0 ? "✦" : "×"}</span>
          </section>
        ))}
      </div>
    </div>
  );
}

export function App() {
  const [stateKey, setStateKey] = useState("late");
  const [selection, setSelection] = useState({ groupId: "bear-stories", chapterId: "understood-everything" });
  const [activeVersionId, setActiveVersionId] = useState(null);
  const [viewMode, setViewMode] = useState("text");
  const [readerOpen, setReaderOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef(null);

  const selectedGroup = STORY_ARCHIVE.find((group) => group.id === selection.groupId) ?? STORY_ARCHIVE[0];
  const selectedChapter = selectedGroup.chapters.find((chapter) => chapter.id === selection.chapterId) ?? selectedGroup.chapters[0];
  const selectedFinal = finalVersion(selectedChapter);
  const activeVersion = selectedChapter.versions.find((version) => version.id === activeVersionId) ?? selectedFinal;

  const stateStory = useMemo(() => {
    const state = STATES[stateKey];
    const group = STORY_ARCHIVE.find((item) => item.id === state.groupId);
    const chapter = group?.chapters.find((item) => item.id === state.chapterId);
    return { group, chapter, version: chapter ? finalVersion(chapter) : null };
  }, [stateKey]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setRequestOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (requestOpen) dialogRef.current?.focus();
  }, [requestOpen]);

  const openChapter = (groupId, chapterId, versionId = null) => {
    setSelection({ groupId, chapterId });
    setActiveVersionId(versionId);
    setViewMode("text");
    setReaderOpen(true);
    window.requestAnimationFrame(() => scrollToId("reader"));
  };

  const chooseState = (key) => {
    const state = STATES[key];
    setStateKey(key);
    setSelection({ groupId: state.groupId, chapterId: state.chapterId });
    setActiveVersionId(null);
    setReaderOpen(false);
    window.requestAnimationFrame(() => scrollToId("story"));
  };

  const submitRequest = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero__image" src="/assets/hero-station.png" alt="Медведь на ночной железнодорожной платформе смотрит на уходящий поезд" />

        <header className="site-header" aria-label="Основная навигация">
          <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            НЕДЕТСКИЕ СКАЗКИ
          </button>
          <nav className="site-nav">
            <button type="button" onClick={() => scrollToId("states")}>Что с вами сейчас</button>
            <button type="button" onClick={() => scrollToId("library")}>Все сказки</button>
            <button type="button" onClick={() => scrollToId("about")}>О проекте</button>
          </nav>
          <button className="personal-link" type="button" onClick={() => setRequestOpen(true)}>Сказка про вас</button>
        </header>

        <div className="hero__content">
          <p className="hero__kicker">Истории, в которых звери ведут себя<br />слишком по-человечески.</p>
          <h1 id="hero-title">Иногда сказка<br />нужна не ребёнку.</h1>
          <p className="hero__lead">Чтобы назвать то, что взрослый человек обычно прячет за шуткой, злостью или молчанием.</p>
          <div className="hero__actions">
            <button className="primary-button" type="button" onClick={() => openChapter(selection.groupId, selection.chapterId)}>Прочитать сказку бесплатно</button>
            <button className="text-button" type="button" onClick={() => scrollToId("library")}>Открыть весь архив</button>
          </div>
          <p className="hero__meta">Без регистрации · {archiveStats.finalCount} сказок · альтернативы рядом с финалом</p>
        </div>
      </section>

      <section className="state-strip" id="states" aria-labelledby="states-title">
        <h2 id="states-title">Что с вами сейчас?</h2>
        {Object.entries(STATES).map(([key, item]) => (
          <button key={key} type="button" className={stateKey === key ? "state-link is-active" : "state-link"} aria-pressed={stateKey === key} onClick={() => chooseState(key)}>
            {item.label}
          </button>
        ))}
      </section>

      <section className="story-preview" id="story" aria-labelledby="story-title">
        <div className="story-preview__title">
          <p className="eyebrow">Ваша сказка на сегодня</p>
          <h2 id="story-title">{stateStory.version?.title}</h2>
          <p>{stateStory.version?.description}</p>
          <button className="inline-action" type="button" onClick={() => openChapter(stateStory.group.id, stateStory.chapter.id)}>Начать читать</button>
        </div>
        <blockquote>{stateStory.version?.paragraphs[0]}</blockquote>
        <figure>
          <img src="/assets/story-still.png" alt="Пустая ночная станция после дождя" />
          <figcaption>Кадр из сказки · ночь, когда всё стало понятно</figcaption>
        </figure>
      </section>

      <section className="library" id="library" aria-labelledby="library-title">
        <header className="library__header">
          <div>
            <p className="eyebrow">Архив проекта</p>
            <h2 id="library-title">Все текущие сказки</h2>
          </div>
          <p>{archiveStats.finalCount} финальных историй и {archiveStats.alternativeCount} альтернативные редакции. Альтернативы не лежат отдельно — они прикреплены к соответствующей финальной версии.</p>
        </header>

        <div className="collection-grid">
          {STORY_ARCHIVE.map((group) => (
            <article className="collection-card" key={group.id}>
              <div className="collection-card__heading">
                <p className="eyebrow">{group.category}</p>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
              <ol className="chapter-list">
                {group.chapters.map((chapter) => {
                  const primary = finalVersion(chapter);
                  const alternatives = chapter.versions.filter((version) => version.status === "alternative").length;
                  return (
                    <li key={chapter.id}>
                      <button type="button" onClick={() => openChapter(group.id, chapter.id)}>
                        <span className="chapter-number">{chapter.number}</span>
                        <span>
                          <strong>{primary.title}</strong>
                          {alternatives > 0 && <small>{alternatives === 1 ? "+ альтернативная версия" : `+ ${alternatives} альтернативы`}</small>}
                        </span>
                        <span aria-hidden="true">→</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <button className="inline-action" type="button" onClick={() => openChapter(group.id, group.chapters[0].id)}>
                Открыть {group.chapters.length > 1 ? "сборник с начала" : "сказку"}
              </button>
            </article>
          ))}
        </div>
      </section>

      {readerOpen && (
        <article className="reader" id="reader" aria-labelledby="reader-title">
          <div className="reader__topline">
            <span>{selectedGroup.category} · {selectedGroup.title}</span>
            <button type="button" onClick={() => scrollToId("library")}>Ко всем сказкам ↑</button>
          </div>

          <div className="reader__layout">
            <aside className="reader__chapters" aria-label="Оглавление сборника">
              <p className="eyebrow">Оглавление</p>
              {selectedGroup.chapters.map((chapter) => (
                <button key={chapter.id} type="button" className={chapter.id === selectedChapter.id ? "is-active" : ""} onClick={() => openChapter(selectedGroup.id, chapter.id)}>
                  <span>{chapter.number}</span>
                  {finalVersion(chapter).title}
                </button>
              ))}
            </aside>

            <div className="reader__content">
              <header className="reader__header">
                <p className="eyebrow">{activeVersion.status === "final" ? "Финальная версия" : "Альтернативная версия"}</p>
                <h2 id="reader-title">{activeVersion.title}</h2>
                <p>{activeVersion.description}</p>
              </header>

              {selectedChapter.versions.length > 1 ? (
                <section className="version-panel" aria-labelledby="versions-title">
                  <div className="version-panel__intro">
                    <p className="eyebrow" id="versions-title">Все редакции вместе</p>
                    <p>Финальная и альтернативная версии собраны в одной сказке. Переключение не меняет вашего места в архиве.</p>
                  </div>
                  <div className="version-tabs" role="tablist" aria-label="Редакции сказки">
                    {selectedChapter.versions.map((version) => (
                      <button key={version.id} type="button" role="tab" aria-selected={version.id === activeVersion.id} className={version.id === activeVersion.id ? "is-active" : ""} onClick={() => setActiveVersionId(version.id)}>
                        <small>{version.status === "final" ? "Финал" : "Альтернатива"}</small>
                        <strong>{version.title}</strong>
                      </button>
                    ))}
                  </div>
                </section>
              ) : (
                <p className="final-label">Финальная редакция</p>
              )}

              <div className="view-switch" role="group" aria-label="Формат просмотра сказки">
                <span>Смотреть как</span>
                <button type="button" aria-pressed={viewMode === "text"} className={viewMode === "text" ? "is-active" : ""} onClick={() => setViewMode("text")}>Текст</button>
                <button type="button" aria-pressed={viewMode === "comic"} className={viewMode === "comic" ? "is-active" : ""} onClick={() => setViewMode("comic")}>Комикс</button>
              </div>

              {viewMode === "comic" ? (
                <ComicReader version={activeVersion} />
              ) : (
                <div className="reader__body">
                  {activeVersion.paragraphs.map((paragraph, index) => <p key={`${activeVersion.id}-${index}`}>{paragraph}</p>)}
                  <p className="reader__end">Конец.</p>
                </div>
              )}

              <footer className="source-note">
                <span>Об источнике</span>
                <p>{activeVersion.sourceNote}</p>
              </footer>

              <div className="afterword" aria-label="Следующий шаг">
                <div>
                  <p className="eyebrow">Продолжить чтение</p>
                  <h3>Ещё истории без готовой морали</h3>
                  <p>Все найденные в истории чатов финалы и ответвления уже разложены по своим циклам.</p>
                  <button className="inline-action" type="button" onClick={() => scrollToId("library")}>Посмотреть весь архив</button>
                </div>
                <div>
                  <p className="eyebrow">Если это про вас</p>
                  <h3>Сказка из вашей истории</h3>
                  <p>Без имён, диагнозов и обязательного «всё будет хорошо».</p>
                  <button className="inline-action" type="button" onClick={() => setRequestOpen(true)}>Рассказать, что случилось</button>
                </div>
              </div>
            </div>
          </div>
        </article>
      )}

      <section className="manifesto" id="about">
        <p>Это сказки для взрослых.</p>
        <h2>Здесь любовь не всегда всё исправляет, хорошие не всегда побеждают, а мораль иногда приходится находить самому.</h2>
      </section>

      <footer className="site-footer">
        <span>НЕДЕТСКИЕ СКАЗКИ</span>
        <span>Истории, в которых слишком легко узнать себя.</span>
      </footer>

      {requestOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setRequestOpen(false);
        }}>
          <section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title" tabIndex="-1" ref={dialogRef}>
            <button className="modal-close" type="button" onClick={() => setRequestOpen(false)}>Закрыть</button>
            {submitted ? (
              <div className="request-success" aria-live="polite">
                <p className="eyebrow">История принята</p>
                <h2>Теперь ей можно стать сказкой.</h2>
                <p>В рабочей версии здесь будет подтверждение и следующий шаг. В прототипе путь уже проверяем.</p>
                <button className="primary-button" type="button" onClick={() => { setRequestOpen(false); setSubmitted(false); }}>Вернуться на сайт</button>
              </div>
            ) : (
              <form onSubmit={submitRequest}>
                <p className="eyebrow">Сказка про вас</p>
                <h2 id="request-title">Что произошло?</h2>
                <p>Расскажите своими словами. Имена можно не указывать.</p>
                <label>Ваша история<textarea name="story" required rows="6" placeholder="Всё началось с того, что…" /></label>
                <label>
                  Какой нужен тон
                  <select name="tone" defaultValue="bittersweet">
                    <option value="bittersweet">Горько и нежно</option>
                    <option value="sharp">Саркастично и жёстко</option>
                    <option value="quiet">Тихо, без утешения</option>
                  </select>
                </label>
                <label>Куда прислать ответ<input name="contact" type="email" required placeholder="name@example.com" /></label>
                <button className="primary-button" type="submit">Отправить историю</button>
              </form>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
