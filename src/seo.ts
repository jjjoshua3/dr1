import { VIDEOS } from "@/daan";

export const SITE_URL = "https://www.daanroosenbrand.nl/";
export const PAGE_TITLE =
  "Daan Roosenbrand | Professioneel Saxofonist, Klarinettist, Docent & Dirigent (Rotterdam)";
export const PAGE_DESCRIPTION =
  "Op zoek naar een energieke saxofonist (solo of met DJ), klarinettist, bigband-dirigent of saxofoondocent in regio Rotterdam, Papendrecht, Delft en Roosendaal? Ontdek het portfolio van Codarts-alumnus Daan Roosenbrand.";
export const OG_IMAGE = "https://img.youtube.com/vi/kKDFos-CEd8/maxresdefault.jpg";

const AREA = [
  "Rotterdam",
  "Papendrecht",
  "Oud Gastel",
  "Roosendaal",
  "Delft",
  "Zuid-Holland",
  "Noord-Brabant",
];

const ORGANISATIONS = [
  { "@type": "MusicGroup", name: "Muziekvereniging Excelsior Papendrecht" },
  { "@type": "MusicGroup", name: "Gastels Fanfare" },
  { "@type": "MusicGroup", name: "Let's Swing Delft" },
  { "@type": "MusicGroup", name: "JD's Big Band" },
  { "@type": "MusicGroup", name: "Coverband IMPAKT" },
  {
    "@type": "MusicGroup",
    name: "Night at the Jukebox",
    url: "https://www.nightatthejukebox.nl/",
  },
];

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#daan`,
      name: "Daan Roosenbrand",
      url: SITE_URL,
      image: OG_IMAGE,
      jobTitle: "Saxofonist, Klarinettist, Muziekdocent & Dirigent",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Codarts Rotterdam",
        address: { "@type": "PostalAddress", addressLocality: "Rotterdam", addressCountry: "NL" },
      },
      areaServed: AREA,
      memberOf: ORGANISATIONS,
      worksFor: ORGANISATIONS,
    },
    {
      "@type": ["PerformingGroup", "MusicGroup"],
      "@id": `${SITE_URL}#ensemble`,
      name: "Daan Roosenbrand",
      url: SITE_URL,
      genre: ["Saxofoon", "Klarinet", "Lichte muziek", "Sax & DJ"],
      member: { "@id": `${SITE_URL}#daan` },
      areaServed: AREA,
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#praktijk`,
      name: "Daan Roosenbrand",
      description: PAGE_DESCRIPTION,
      url: SITE_URL,
      image: OG_IMAGE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Rotterdam",
        addressRegion: "Zuid-Holland",
        addressCountry: "NL",
      },
      areaServed: AREA,
      founder: { "@id": `${SITE_URL}#daan` },
    },
    ...VIDEOS.map((video) => ({
      "@type": "VideoObject",
      name: video.title,
      description: video.alt,
      thumbnailUrl: [
        `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
        `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`,
      ],
      embedUrl: `https://www.youtube-nocookie.com/embed/${video.id}`,
      contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
      ...(video.id === "22HLcpeJl3k" ? { uploadDate: "2015-01-01" } : {}),
    })),
  ],
};
