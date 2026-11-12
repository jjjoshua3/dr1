/**
 * LEEFTIJD — vervang "[XX]" door het getal, bijvoorbeeld "28".
 * De badge in de biografie leest alleen deze constante.
 */
export const DAAN_LEEFTIJD = "[XX]";

/**
 * Optioneel boekingsadres. Ingevuld: verzenden opent ook de mailclient.
 * Leeg: de pagina toont alleen de bevestiging.
 */
export const BOEKINGS_EMAIL = "";

export type Tag = "solo" | "bands" | "codarts" | "excelsior";

export type Video = {
  id: string;
  title: string;
  label: string;
  tags: Tag[];
  external?: string;
};

export const VIDEOS: Video[] = [
  {
    id: "kKDFos-CEd8",
    title: "Excelsior & Daan Roosenbrand — Baker Street (Live)",
    label: "Iconische Saxofoon Solo",
    tags: ["excelsior", "solo"],
  },
  {
    id: "WLPDBI1BV6g",
    title: "Excelsior & Daan Roosenbrand — Against All Odds (Live)",
    label: "Live Ballad Solo",
    tags: ["excelsior", "solo"],
  },
  {
    id: "WjrbjayKkLQ",
    title: "Nick Nicolai — It's A Man's World (Ranking The Talent)",
    label: "TV Optreden / Sessie Saxofonist",
    tags: ["solo"],
  },
  {
    id: "Mf3JzKaa7D8",
    title: "Feest- en Cantusband Bracchus — Live in Rotterdam Ahoy (Eurekaweek 2019)",
    label: "Groot Podium / Ahoy",
    tags: ["bands"],
  },
  {
    id: "JUqgIJMsIZc",
    title: "Night at the Jukebox — Band Showcase (Short)",
    label: "Huidige Band",
    tags: ["bands"],
    external: "https://www.nightatthejukebox.nl/",
  },
  {
    id: "rpkXoRAOxDU",
    title: "Codarts Pop Orchestra — Licht en Donker (Froukje)",
    label: "Codarts Rotterdam",
    tags: ["codarts"],
  },
  {
    id: "gVm_NMxlTmU",
    title: "Codarts Pop Orchestra — Hold Back (Margi Sinniah)",
    label: "Codarts Rotterdam",
    tags: ["codarts"],
  },
  {
    id: "bGFwhE3EVrA",
    title: "Daan Roosenbrand — Have Yourself A Merry Little Christmas",
    label: "Intieme Sessie",
    tags: ["solo"],
  },
  {
    id: "22HLcpeJl3k",
    title: "Excelsior Papendrecht — Crooner's Serenade",
    label: "Uit het Archief (9 jaar geleden)",
    tags: ["excelsior"],
  },
];

export const FILTERS = [
  { id: "all", label: "Alles" },
  { id: "solo", label: "Solo & TV" },
  { id: "bands", label: "Bands & Ahoy" },
  { id: "codarts", label: "Codarts Pop Orchestra" },
  { id: "excelsior", label: "Excelsior Live" },
] as const;

export type FilterId = (typeof FILTERS)[number]["id"];

export const ACTS = [
  {
    id: "impakt",
    kicker: "Huidig · Coverband",
    title: "IMPAKT",
    place: "Roosendaal",
    text: "Energieke coverband waar Daan momenteel deel van uitmaakt. Saxofoon in de voorlinie, tussen feesttent en podium.",
  },
  {
    id: "jukebox",
    kicker: "Huidig · Band",
    title: "Night at the Jukebox",
    place: "Live",
    text: "Hier speelt hij de sterren van de hemel. Soul, pop en het repertoire dat een zaal stil krijgt — of juist niet.",
    href: "https://www.nightatthejukebox.nl/",
    hrefLabel: "nightatthejukebox.nl",
  },
  {
    id: "dj",
    kicker: "Act · Club & event",
    title: "Live Sax & DJ",
    place: "Op aanvraag",
    text: "Regelmatig naast verschillende DJ's. De saxofoon in een dynamische club- en eventcontext: adem boven de beat.",
  },
  {
    id: "dave",
    kicker: "Archief · Band",
    title: "Dave Warmerdam Band",
    place: "Voormalig lid",
    text: "Een gewaardeerde plek in de band. Bigband-bloed, strakke sectie, en het soort samenspel dat je niet vergeet.",
  },
] as const;

export const CHAPTERS = [
  {
    id: "directie",
    label: "Directie",
    items: [
      {
        when: "Dirigent",
        title: "Let's Swing Delft",
        text: "Muzikale leiding en directie. Swing die blijft staan, en een orkest dat weet waar de frase heen moet.",
      },
      {
        when: "Dirigent",
        title: "JD's Big Band",
        text: "Muzikale leiding en bigband-directie. Secties, cues, en het plezier van een volle blazersklank.",
      },
    ],
  },
  {
    id: "docent",
    label: "Docentschap",
    items: [
      {
        when: "Heden",
        title: "Muziekvereniging Excelsior Papendrecht",
        text: "Saxofoondocent en regelmatig solist. Van repetitiezaal naar de solo vooraan.",
      },
      {
        when: "Sinds 2023 — heden",
        title: "Gastels Fanfare",
        text: "Saxofoondocent. Adem, toon en het lef om een frase af te maken.",
      },
      {
        when: "Heden",
        title: "Individuele lessen & basisscholen",
        text: "Privé saxofoon- en klarinetlessen, en energieke muzieklessen op basisscholen. Spelplezier staat voorop.",
      },
    ],
  },
  {
    id: "opleiding",
    label: "Opleiding & ervaring",
    items: [
      {
        when: "Opleiding",
        title: "Codarts Rotterdam",
        text: "Conservatorium, specialisatie lichte muziek. Het diploma dat de veelzijdigheid scherp zette.",
      },
      {
        when: "Ervaring",
        title: "De Ambachtse Muziekschool & Muziekschool de Rover",
        text: "Voormalig saxofoondocent. De lespraktijk waarin het vak werd doorgegeven.",
      },
    ],
  },
] as const;

export const TOPICS = [
  { id: "solo", label: "Live Solo / DJ + Sax Act" },
  { id: "band", label: "Band Boeking (IMPAKT / Night at the Jukebox)" },
  { id: "les", label: "Saxofoon- of Klarinetles / Basisschool" },
  { id: "directie", label: "Dirigent / Bigband & Orkest Workshop" },
  { id: "studio", label: "Studio & Sessiewerk" },
] as const;
