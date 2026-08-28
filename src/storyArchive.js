import jackalArchive from "./data/jackal-archive.json" with { type: "json" };
import bearArchive from "./data/bear-archive.json" with { type: "json" };
import noirArchive from "./data/noir-archive.json" with { type: "json" };
import otherArchive from "./data/other-archive.json" with { type: "json" };
import neighborJackalArchive from "./data/neighbor-jackal-archive.json" with { type: "json" };
import neighborResolutionArchive from "./data/neighbor-resolution-archive.json" with { type: "json" };

function findStory(stories, id) {
  const story = stories.find((item) => item.id === id);
  if (!story) throw new Error(`Archive story not found: ${id}`);
  return story;
}

const jackal = jackalArchive.stories;
const bear = bearArchive.stories;
const other = otherArchive.stories;
const neighborJackal = neighborJackalArchive;
const neighborResolution = neighborResolutionArchive;

export const STORY_ARCHIVE = [
  {
    id: "jackal-and-hyena",
    category: "Сага · отношения, которых не было",
    title: "Шакал и гиена",
    description: "Четыре части основной линии и две развилки, в которых тот же разрыв ведёт героев к разным жизням.",
    chapters: [
      {
        id: "contract-that-wasnt",
        number: "I",
        versions: [findStory(jackal, "mainline-i-contract-that-wasnt")],
      },
      {
        id: "independence-or-appeal",
        number: "II",
        versions: [
          findStory(jackal, "mainline-ii-independence-with-notifications"),
          findStory(jackal, "alternative-ii-life-without-appeal"),
        ],
      },
      {
        id: "healing-or-all-roads",
        number: "III",
        versions: [
          findStory(jackal, "mainline-iii-healing-by-subscription"),
          findStory(jackal, "alternative-iii-all-roads-at-once"),
        ],
      },
      {
        id: "unarranged-meeting",
        number: "IV",
        versions: [
          findStory(jackal, "mainline-iv-unarranged-meeting"),
          findStory(neighborResolution, "last-conversation-two-truths"),
        ],
      },
    ],
  },
  {
    id: "noir-cycle",
    category: "Нуарная ветка · 18+",
    title: "Красный конверт",
    description: "Погони, архивы, Серый Волк, исчезнувшее будущее и несколько разных способов впервые встретиться.",
    chapters: [
      {
        id: "origins-before-noir",
        number: "Пролог",
        versions: [
          findStory(noirArchive, "before-the-red-envelope"),
          findStory(neighborJackal, "city-on-sale"),
          findStory(neighborJackal, "city-without-back-exit"),
          findStory(neighborJackal, "corpse-on-encore"),
        ],
      },
      {
        id: "envelope-and-boar",
        number: "I",
        versions: [
          findStory(noirArchive, "boar-in-the-trunk"),
          findStory(noirArchive, "red-envelope"),
        ],
      },
      {
        id: "bad-thursday",
        number: "II",
        versions: [findStory(noirArchive, "very-bad-thursday")],
      },
      {
        id: "missing-future",
        number: "III",
        versions: [findStory(neighborJackal, "missing-future-case")],
      },
    ],
  },
  {
    id: "bear-stories",
    category: "Сборник · тихие и сатирические",
    title: "Сказки о медведе",
    description: "Семь отдельных историй: о закрытых тропинках, непройденных мостах, выдуманных лесах и странице вперёд.",
    chapters: [
      {
        id: "closed-path",
        number: "I",
        versions: [
          findStory(bear, "kind-bear-closed-path"),
          findStory(bear, "roman-sonya-friendship-bridge"),
        ],
      },
      {
        id: "two-reflections",
        number: "II",
        versions: [findStory(bear, "bear-lake-two-reflections")],
      },
      {
        id: "invented-forest",
        number: "III",
        versions: [findStory(bear, "bear-invented-forest")],
      },
      {
        id: "uncrossed-bridge",
        number: "IV",
        versions: [findStory(bear, "bear-uncrossed-bridge")],
      },
      {
        id: "understood-everything",
        number: "V",
        versions: [findStory(bear, "bear-understood-everything")],
      },
      {
        id: "page-ahead",
        number: "VI",
        versions: [findStory(bear, "bear-page-ahead")],
      },
      {
        id: "station",
        number: "VII",
        versions: [findStory(bear, "bear-and-fox-station")],
      },
    ],
  },
  {
    id: "forest-school",
    category: "Отдельная сказка · для семейного чтения",
    title: "Лесная школа",
    description: "Одна история о ремесле, внимании к основанию и праве ученика сначала сделать криво.",
    chapters: [
      {
        id: "grandpa-beaver",
        number: "I",
        versions: [findStory(other, "grandpa-beavers-forest-school")],
      },
    ],
  },
];

const allVersions = STORY_ARCHIVE.flatMap((group) => group.chapters.flatMap((chapter) => chapter.versions));

export const archiveStats = {
  collectionCount: STORY_ARCHIVE.length,
  finalCount: allVersions.filter((version) => version.status === "final").length,
  alternativeCount: allVersions.filter((version) => version.status === "alternative").length,
};
