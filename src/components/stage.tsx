import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import {
  ACTS,
  BOEKINGS_EMAIL,
  CHAPTERS,
  daanLeeftijd,
  FILTERS,
  TOPICS,
  VIDEOS,
  type FilterId,
  type Video,
} from "@/daan";
import { Saxophone } from "@/components/saxophone";

const BAKER = VIDEOS[0];
const lenisRef: { current: LenisInstance | null } = { current: null };

type LenisInstance = {
  raf: (time: number) => void;
  on: (event: "scroll", cb: () => void) => void;
  scrollTo: (target: HTMLElement | string, opts?: { offset?: number }) => void;
  destroy: () => void;
};
type LenisCtor = new (options?: { lerp?: number; smoothWheel?: boolean }) => LenisInstance;

function waitForLenis(timeout = 2800) {
  return new Promise<LenisCtor | null>((resolve) => {
    const started = Date.now();
    const check = () => {
      const Ctor = (window as Window & { Lenis?: LenisCtor }).Lenis;
      if (Ctor) resolve(Ctor);
      else if (Date.now() - started > timeout) resolve(null);
      else window.setTimeout(check, 40);
    };
    check();
  });
}

export function Stage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [booted, setBooted] = useState(false);
  const [filter, setFilter] = useState<FilterId>("all");
  const [active, setActive] = useState<Video | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setBooted(true);
      return;
    }

    const bag: {
      timer?: number;
      ctx?: { revert: () => void };
      tl?: { kill: () => void };
      stopLenis?: () => void;
    } = {};
    let dead = false;

    bag.timer = window.setTimeout(() => {
      setBooted(true);
    }, 5600);

    void (async () => {
      const [{ default: gsap }, { ScrollTrigger }, LenisCtor] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        waitForLenis(),
      ]);
      if (dead || !rootRef.current) return;
      gsap.registerPlugin(ScrollTrigger);

      if (LenisCtor) {
        const lenis = new LenisCtor({ lerp: 0.1, smoothWheel: true });
        lenisRef.current = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => {
          lenis.raf(time * 1000);
        };
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);
        const onAnchor = (event: globalThis.MouseEvent) => {
          const link = (event.target as HTMLElement | null)?.closest?.("a[href^='#']");
          if (!(link instanceof HTMLAnchorElement)) return;
          const id = link.getAttribute("href")?.slice(1);
          if (!id) return;
          const el = document.getElementById(id);
          if (!el) return;
          event.preventDefault();
          lenis.scrollTo(el, { offset: id === "top" ? 0 : -12 });
        };
        document.addEventListener("click", onAnchor);
        bag.stopLenis = () => {
          document.removeEventListener("click", onAnchor);
          gsap.ticker.remove(raf);
          lenis.destroy();
          if (lenisRef.current === lenis) lenisRef.current = null;
        };
        if (dead) {
          bag.stopLenis();
          return;
        }
      }

      bag.ctx = gsap.context(() => {
        const root = rootRef.current;
        if (!root) return;
        const paths = root.querySelectorAll<SVGGeometryElement>(".pre-sax .draw");
        const countEl = root.querySelector<HTMLElement>("[data-count]");
        const bar = root.querySelector<HTMLElement>("[data-bar]");
        const preUi = root.querySelector<HTMLElement>("[data-pre-ui]");
        const preSax = root.querySelector<HTMLElement>(".pre-sax");
        const counter = { v: 0 };
        const draw = 0.78;
        const stagger = paths.length > 1 ? 0.012 : 0;
        const total = draw + stagger * Math.max(0, paths.length - 1);

        const tl = gsap.timeline({
          onComplete: () => {
            if (bag.timer) window.clearTimeout(bag.timer);
            setBooted(true);
            ScrollTrigger.refresh();
          },
        });
        bag.tl = tl;

        tl.to(
          paths,
          { strokeDashoffset: 0, duration: draw, stagger, ease: "power1.inOut" },
          0,
        );
        tl.to(
          counter,
          {
            v: 100,
            duration: total,
            ease: "none",
            onUpdate: () => {
              const n = Math.round(counter.v);
              if (countEl) countEl.textContent = n === 100 ? "100%" : `${String(n).padStart(2, "0")}%`;
              if (bar) bar.style.width = `${n}%`;
            },
          },
          0,
        );
        tl.call(() => preSax?.classList.add("is-lit"), undefined, total - 0.05);
        tl.to(preUi, { autoAlpha: 0, duration: 0.32, ease: "power1.out" }, total + 0.28);
        tl.to("[data-curtain='l']", { xPercent: -100, duration: 1.05, ease: "power4.inOut" }, total + 0.38);
        tl.to("[data-curtain='r']", { xPercent: 100, duration: 1.05, ease: "power4.inOut" }, "<");

        gsap.to(".hero-sax", {
          y: 160,
          rotate: 14,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        gsap.utils.toArray<HTMLElement>(".story-p").forEach((p) => {
          gsap.fromTo(
            p,
            { color: "#9e9689" },
            {
              color: "#f4efe6",
              scrollTrigger: {
                trigger: p,
                start: "top 82%",
                end: "top 48%",
                scrub: true,
              },
            },
          );
        });

        gsap.fromTo(
          ".tl-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".tl",
              start: "top 70%",
              end: "bottom 75%",
              scrub: true,
            },
          },
        );
      }, rootRef);
    })();

    return () => {
      dead = true;
      if (bag.timer) window.clearTimeout(bag.timer);
      bag.tl?.kill();
      bag.ctx?.revert();
      bag.stopLenis?.();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeRef.current?.focus(), 20);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      openerRef.current?.focus();
    };
  }, [active]);

  const shown = VIDEOS.filter((v) => filter === "all" || v.tags.includes(filter));
  const [lead, ...rest] = shown;

  function openVideo(video: Video, el: HTMLElement) {
    openerRef.current = el;
    setActive(video);
  }

  function toBook() {
    const target = document.getElementById("boek");
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -12 });
    else target.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div ref={rootRef} id="top">
      <a className="skip" href="#inhoud">
        Naar de inhoud
      </a>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      {booted ? null : (
        <div className="pre" data-preloader aria-hidden="true">
          <div className="curtain curtain-l" data-curtain="l" />
          <div className="curtain curtain-r" data-curtain="r" />
          <div className="pre-ui" data-pre-ui>
            <Saxophone className="pre-sax" />
            <div className="pre-meta">
              <span className="pre-count" data-count>
                00%
              </span>
              <span className="pre-label">Stemmen & opwarmen // Rotterdam</span>
            </div>
            <div className="pre-bar" aria-hidden="true">
              <span data-bar />
            </div>
          </div>
          <noscript>
            <style>{`[data-preloader]{display:none!important}html{overflow:auto!important}`}</style>
          </noscript>
        </div>
      )}

      <header className="nav">
        <a className="brand" href="#top">
          <span className="brand-name">Daan Roosenbrand</span>
          <span className="brand-meta">Saxofoon · Klarinet · Directie</span>
        </a>
        <nav className="nav-links" aria-label="Hoofdnavigatie">
          <a href="#verhaal">Verhaal</a>
          <a href="#podium">Podium</a>
          <a href="#meesterschap">Meesterschap</a>
          <a href="#boek">Contact</a>
        </nav>
        <Magnetic className="book" onClick={toBook}>
          <span className="book-full">Boek Daan / Contact</span>
          <span className="book-short">Boek Daan</span>
        </Magnetic>
      </header>

      <main id="inhoud">
        <section className="hero" aria-labelledby="hero-title">
          <Saxophone className="hero-sax" />
          <div className="hero-copy">
            <p className="eyebrow">01 — Het geluid van Rotterdam</p>
            <h1 id="hero-title" className="hero-title">
              <span className="seo-line">Saxofonist Rotterdam</span>
              <span className="it">Adem.</span>
              <span className="off">Koper.</span>
              <span className="it">Ziel.</span>
            </h1>
            <p className="hero-name">
              Daan
              <br />
              Roosenbrand
            </p>
            <p className="hero-sub">
              Saxofonist, klarinettist, docent en dirigent. Geboren, getogen en gevormd in Rotterdam — van Sax
              & DJ tot bigband.
            </p>
            <p className="scroll-hint">
              <i />
              Scroll
            </p>
          </div>
          <div className="hero-figure">
            <div className="hero-shot">
              <img
                src="/photos/blue.jpg"
                alt="Daan Roosenbrand speelt saxofoon in blauw podiumlicht."
                width={960}
                height={960}
                fetchPriority="high"
                decoding="async"
              />
              <span className="vignette" />
            </div>
            <div className="inset-shot">
              <img
                src="/photos/orange.jpg"
                alt="Daan Roosenbrand met saxofoon op een warm verlicht podium."
                width={1356}
                height={1370}
                loading="lazy"
                decoding="async"
              />
              <span className="vignette" />
            </div>
            <button
              type="button"
              className="listen"
              data-cursor="luister"
              aria-label="Speel Baker Street af, saxofoonsolo van Daan Roosenbrand"
              onClick={(e) => openVideo(BAKER, e.currentTarget)}
            >
              <span className="meter" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </span>
              <span className="listen-kicker">Quick listen</span>
              <span className="listen-title">Baker Street</span>
              <span className="listen-go">Luister</span>
            </button>
          </div>
        </section>

        <section className="story" id="verhaal" aria-labelledby="story-title">
          <div className="story-grid">
            <div className="story-sticky">
              <p className="eyebrow">02 — Biografie</p>
              <h2 id="story-title" className="story-kicker">
                <span className="seo-line">Codarts-saxofonist</span>
                Een Rotterdammer aan het mondstuk.
              </h2>
              <div className="story-shot">
                <img
                  src="/photos/portrait.jpg"
                  alt="Portret van saxofonist Daan Roosenbrand."
                  width={400}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <div className="story-copy">
              <article className="chapter">
                <h3>De rasmuzikant</h3>
                <p className="story-p">
                  Daan Roosenbrand <AgeBadge /> is een échte Rotterdammer en een getalenteerde{" "}
                  <em>saxofonist én klarinettist</em>. Als Codarts-saxofonist, met een diepe voorliefde voor
                  lichte muziek en een diploma van het conservatorium Codarts in Rotterdam, schakelt hij
                  moeiteloos tussen genres.
                </p>
              </article>
              <article className="chapter">
                <h3>Bands, orkesten & dj's</h3>
                <p className="story-p">
                  Van bigbands en symfonische poporkesten tot dampende feesttenten en een uitverkocht
                  Rotterdam Ahoy. Daan was een gewaardeerd lid van de Dave Warmerdam Band, speelt de sterren
                  van de hemel bij Night at the Jukebox én maakt momenteel deel uit van de energieke coverband
                  IMPAKT uit Roosendaal. Daarnaast staat hij regelmatig als Sax & DJ naast verschillende
                  DJ's, met de saxofoon in een club- en eventcontext.
                </p>
              </article>
              <blockquote className="pull">
                <span>Lespraktijk</span>
                Plezier aan muziek staat altijd centraal.
              </blockquote>
              <article className="chapter">
                <h3>Inspirator voor de toekomst</h3>
                <p className="story-p">
                  Zijn toewijding stopt niet bij het podium. Als bigband-dirigent in Delft geeft hij leiding
                  aan Let's Swing Delft. Daarnaast geeft hij saxofoonles in Papendrecht bij Excelsior en
                  saxofoonles in Oud Gastel bij Gastels Fanfare. Spelplezier staat voorop, voor jong en oud.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="diptych" aria-label="Beelden van het podium">
          <figure>
            <div className="shot">
              <img
                src="/photos/club.jpg"
                alt="Daan Roosenbrand tijdens een cluboptreden, groen en rood licht."
                width={1110}
                height={1109}
                loading="lazy"
                decoding="async"
              />
              <span className="vignette" />
            </div>
            <figcaption>Clublicht</figcaption>
          </figure>
          <figure>
            <div className="shot">
              <img
                src="/photos/purple.jpg"
                alt="Daan Roosenbrand met saxofoon op een paars verlicht podium."
                width={1066}
                height={1066}
                loading="lazy"
                decoding="async"
              />
              <span className="vignette" />
            </div>
            <figcaption>Podium</figcaption>
          </figure>
        </section>

        <section className="vault" id="podium" aria-labelledby="vault-title">
          <div className="sec-head">
            <p className="eyebrow">03 — Virtual listening room</p>
            <h2 id="vault-title" className="sec-title">
              <span className="seo-line">Saxofonist boeken</span>
              Live on Stage <em>& In Session</em>
            </h2>
            <p className="sec-lead">
              Negen producties van een saxofonist uit Rotterdam. Sax & DJ, solo of met band — je opent de
              zaal pas als je wilt luisteren.
            </p>
          </div>
          <div className="filters" role="tablist" aria-label="Filter optredens">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                aria-label={`Filter optredens: ${f.label}`}
                className={filter === f.id ? "filter is-on" : "filter"}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {lead ? (
            <article className="feature">
              <button
                type="button"
                className="feature-hit"
                data-cursor="luister"
                aria-label={`Speel af: ${lead.title}`}
                onClick={(e) => openVideo(lead, e.currentTarget)}
              >
                <span className="thumb">
                  <Thumb id={lead.id} alt={lead.alt} />
                  <span className="vignette" />
                  <span className="play" data-cursor="speel" aria-hidden="true">
                    <PlayIcon />
                  </span>
                </span>
                <span className="copy">
                  <span className="idx">{indexOf(lead.id)}</span>
                  <span className="vtitle">{lead.title}</span>
                  <span className="vlabel">{lead.label}</span>
                </span>
              </button>
            </article>
          ) : null}

          <div className="rows">
            {rest.map((video) => (
              <article className="row" key={video.id}>
                <button
                  type="button"
                  className="row-hit"
                  data-cursor="luister"
                  aria-label={`Speel af: ${video.title}`}
                  onClick={(e) => openVideo(video, e.currentTarget)}
                >
                  <span className="thumb">
                    <Thumb id={video.id} alt={video.alt} />
                    <span className="vignette" />
                    <span className="play" data-cursor="speel" aria-hidden="true">
                      <PlayIcon />
                    </span>
                  </span>
                  <span className="copy">
                    <span className="idx">{indexOf(video.id)}</span>
                    <span className="vtitle">{video.title}</span>
                    <span className="vlabel">{video.label}</span>
                  </span>
                </button>
                {video.external ? (
                  <a
                    className="ext"
                    href={video.external}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Website van ${video.title}`}
                  >
                    Naar de site
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          <div className="bento-wrap">
            <p className="bento-label">Actieve projecten & samenwerkingen</p>
            <div className="bento">
              {ACTS.map((act) => (
                <article key={act.id} className={`act act-${act.id}`}>
                  <span className="act-kicker">{act.kicker}</span>
                  <h3>{act.title}</h3>
                  <span className="act-place">{act.place}</span>
                  <p>{act.text}</p>
                  {"href" in act && act.href ? (
                    <a href={act.href} target="_blank" rel="noreferrer">
                      {act.hrefLabel}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="master" id="meesterschap" aria-labelledby="master-title">
          <div className="sec-head">
            <p className="eyebrow">04 — Directie, educatie & meesterschap</p>
            <h2 id="master-title" className="sec-title">
              <span className="seo-line">Bigband-dirigent Delft</span>
              De stok, de les, <em>het vak.</em>
            </h2>
            <p className="sec-lead">
              Naast het solo-werk: bigband-dirigent in Delft, saxofoonles in Papendrecht, saxofoonles in Oud
              Gastel, en de lijn van Codarts naar de repetitiezaal.
            </p>
          </div>
          <div className="tl">
            <div className="tl-track" aria-hidden="true">
              <div className="tl-fill" />
            </div>
            {CHAPTERS.map((chapter) => (
              <div className="tl-group" key={chapter.id}>
                <h3>{chapter.label}</h3>
                {chapter.items.map((item) => (
                  <article className="tl-item" key={item.title}>
                    <p className="when">{item.when}</p>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>

        <Booking />
      </main>

      <footer className="colophon">
        <span>© {new Date().getFullYear()} Daan Roosenbrand</span>
        <span>Rotterdam</span>
        <span>Saxofoon · Klarinet · Directie</span>
        <span className="credit">
          Ontworpen door{" "}
          <a href="https://jjjoshua3.netlify.app/" target="_blank" rel="noreferrer">
            Joshua
          </a>
        </span>
        <a href="#top">Naar boven</a>
      </footer>

      {active ? (
        <div className="cinema" data-cinema role="dialog" aria-modal="true" aria-label={active.title}>
          <button
            ref={closeRef}
            type="button"
            className="cinema-close"
            onClick={() => setActive(null)}
          >
            Sluiten
          </button>
          <div className="cinema-frame">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0&modestbranding=1`}
              title={active.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="cinema-meta">
            <strong>{active.title}</strong>
            <span>{active.label}</span>
          </p>
        </div>
      ) : null}
    </div>
  );
}

function AgeBadge() {
  const leeftijd = daanLeeftijd();
  return (
    <span className="age-badge" data-age={leeftijd}>
      <span className="age-num">{leeftijd}</span>
      <span className="age-unit">jaar</span>
    </span>
  );
}

function indexOf(id: string) {
  const i = VIDEOS.findIndex((v) => v.id === id);
  return String(i + 1).padStart(2, "0");
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 12 14" width="14" height="16" aria-hidden="true">
      <path d="M1 1.1v11.8L11 7z" fill="currentColor" />
    </svg>
  );
}

function Thumb({ id, alt }: { id: string; alt: string }) {
  return (
    <img
      src={`/thumbs/${id}.jpg`}
      alt={alt}
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
    />
  );
}

function Magnetic({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  function move(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.28}px, ${y * 0.42}px)`;
  }
  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
      }}
    >
      {children}
    </button>
  );
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const wordRef = useRef<string | null>(null);
  const [word, setWord] = useState<string | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let frame = 0;
    let visible = false;

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    const onMove = (e: globalThis.MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      const target = e.target as HTMLElement | null;
      const field = target?.closest("input, textarea, select");
      const mode = field ? null : target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      const next = mode === "luister" ? "Luister" : mode === "speel" ? "Speel af" : null;
      if (next !== wordRef.current) {
        wordRef.current = next;
        setWord(next);
      }
      if (!visible && dot.current && ring.current) {
        visible = true;
        document.documentElement.classList.add("has-cursor");
        dot.current.style.opacity = field ? "0" : "1";
        ring.current.style.opacity = field ? "0" : "1";
      } else if (dot.current && ring.current) {
        const hide = Boolean(field);
        dot.current.style.opacity = hide ? "0" : "1";
        ring.current.style.opacity = hide ? "0" : "1";
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div
        ref={ring}
        className={word ? "cursor-ring is-hot is-word" : "cursor-ring"}
        aria-hidden="true"
      >
        <div className="cursor-ring-inner">
          <span className="cursor-label">{word}</span>
        </div>
      </div>
    </>
  );
}

function Booking() {
  const [topics, setTopics] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"edit" | "sending" | "sent">("edit");

  function toggle(id: string) {
    setTopics((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (topics.length === 0) next.topics = "Kies minstens één onderwerp.";
    if (name.trim().length < 2) next.name = "Vul je naam in.";
    if (contact.trim().length < 5) next.contact = "Laat een e-mailadres of telefoonnummer achter.";
    if (message.trim().length < 8) next.message = "Schrijf kort wat je zoekt.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setPhase("sending");
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    if (BOEKINGS_EMAIL) {
      const labels = TOPICS.filter((t) => topics.includes(t.id)).map((t) => t.label);
      const subject = encodeURIComponent(`Boeking — ${labels.join(", ")}`);
      const body = encodeURIComponent(
        `Naam: ${name}\nContact: ${contact}\nDatum: ${date || "n.n.b."}\nOnderwerp: ${labels.join(", ")}\n\n${message}`,
      );
      window.location.href = `mailto:${BOEKINGS_EMAIL}?subject=${subject}&body=${body}`;
    }
    setPhase("sent");
  }

  const chosen = TOPICS.filter((t) => topics.includes(t.id)).map((t) => t.label);

  return (
    <section className="booking" id="boek" aria-labelledby="book-title">
      <div className="booking-grid">
        <div>
          <p className="eyebrow">05 — Bericht mij</p>
          <h2 id="book-title" className="sec-title">
            Zullen we samen <em>muziek maken?</em>
          </h2>
          <p className="sec-lead">
            Saxofonist boeken voor solo, Sax & DJ, band, klarinet of directie. Kies wat je zoekt — Daan
            antwoordt persoonlijk.
          </p>
        </div>

        {phase === "sent" ? (
          <div className="receipt" role="status">
            <p className="eyebrow">Aanvraag</p>
            <h3>Genoteerd.</h3>
            <p>We stemmen af. Tot op het podium, in de les of voor de band.</p>
            <dl>
              <div>
                <dt>Voor</dt>
                <dd>{name}</dd>
              </div>
              <div>
                <dt>Via</dt>
                <dd>{contact}</dd>
              </div>
              <div>
                <dt>Over</dt>
                <dd>{chosen.join(" · ")}</dd>
              </div>
              {date ? (
                <div>
                  <dt>Datum</dt>
                  <dd>{date}</dd>
                </div>
              ) : null}
            </dl>
            <button
              type="button"
              className="ghost"
              onClick={() => {
                setPhase("edit");
                setTopics([]);
                setName("");
                setContact("");
                setDate("");
                setMessage("");
              }}
            >
              Nog een bericht
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <div className="topics" role="group" aria-label="Onderwerp">
              {TOPICS.map((topic) => {
                const on = topics.includes(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    className={on ? "topic is-on" : "topic"}
                    aria-pressed={on}
                    onClick={() => toggle(topic.id)}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
            {errors.topics ? <p className="err">{errors.topics}</p> : null}

            <div className="fields">
              <label className="float">
                <input
                  name="naam"
                  placeholder=" "
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={Boolean(errors.name)}
                />
                <span>Naam</span>
              </label>
              <label className="float">
                <input
                  name="contact"
                  placeholder=" "
                  autoComplete="email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  aria-invalid={Boolean(errors.contact)}
                />
                <span>E-mail of telefoon</span>
              </label>
              {errors.name || errors.contact ? (
                <>
                  <p className="err">{errors.name ?? ""}</p>
                  <p className="err">{errors.contact ?? ""}</p>
                </>
              ) : null}

              <label className="date-field field-wide">
                <span>Datum, optioneel</span>
                <input type="date" name="datum" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>

              <label className="float field-wide">
                <textarea
                  name="bericht"
                  placeholder=" "
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  aria-invalid={Boolean(errors.message)}
                />
                <span>Bericht</span>
              </label>
            </div>
            {errors.message ? <p className="err">{errors.message}</p> : null}

            <div className="send-row">
              <button className="send" type="submit" disabled={phase === "sending"}>
                {phase === "sending" ? "Wordt gezet…" : "Verstuur"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
