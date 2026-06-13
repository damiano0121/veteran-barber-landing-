"use client";

import { useState, useEffect, useCallback } from "react";

/* ════════════════════════════════════════════════════
   DESIGN TOKENS
════════════════════════════════════════════════════ */
const T = {
  bgPrimary:   "#080808",
  bgSecondary: "#0D0D0D",
  bgCard:      "rgba(255,255,255,0.02)",
  gold:        "#C9A84C",
  goldLight:   "#E8C96A",
  goldDark:    "#B8962E",
  goldGrad:    "linear-gradient(135deg, #C9A84C, #E8C96A, #B8962E)",
  textPri:     "#FFFFFF",
  textSec:     "rgba(255,255,255,0.55)",
  border:      "rgba(255,255,255,0.06)",
  borderGold:  "rgba(201,168,76,0.3)",
} as const;

/* ════════════════════════════════════════════════════
   PARTICLES
════════════════════════════════════════════════════ */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id:       i,
  top:      `${6  + ((i * 19 + 13) % 86)}%`,
  left:     `${4  + ((i * 31 +  9) % 90)}%`,
  size:     2 + (i % 3),
  duration: 5 + (i % 6),
  delay:    -((i * 0.7) % 4),
}));

/* ════════════════════════════════════════════════════
   HELPERS
════════════════════════════════════════════════════ */
function smoothScroll(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("");
}

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el    = e.target as HTMLElement;
          const delay = Number(el.dataset.delay ?? 0);
          setTimeout(() => el.classList.add("visible"), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ════════════════════════════════════════════════════
   ICONS
════════════════════════════════════════════════════ */
function IgIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FbIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════
   SHARED
════════════════════════════════════════════════════ */
const sectionLabel: React.CSSProperties = {
  color:         "rgba(255,255,255,0.6)",
  fontSize:      "0.72rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  fontWeight:    600,
  marginBottom:  "0.75rem",
  display:       "block",
};

const sectionTitle: React.CSSProperties = {
  fontSize:      "clamp(1.9rem, 4.5vw, 2.9rem)",
  fontWeight:    900,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  lineHeight:    1.1,
};

function GoldLine({ width = 60 }: { width?: number }) {
  return (
    <div style={{
      width,
      height:     1,
      background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
      margin:     "1.25rem auto 0",
    }} />
  );
}

function CTAGold({
  children, onClick, href, small, style: extra,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  small?: boolean;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    background:     T.goldGrad,
    color:          "#080808",
    fontWeight:     800,
    letterSpacing:  "0.1em",
    textTransform:  "uppercase",
    fontSize:       small ? "0.72rem" : "0.85rem",
    padding:        small ? "0.45rem 1.25rem" : "1rem 2.5rem",
    borderRadius:   2,
    border:         "none",
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    minHeight:      small ? 36 : 52,
    transition:     "transform 0.25s ease, box-shadow 0.25s ease",
    cursor:         "pointer",
    fontFamily:     "inherit",
    ...extra,
  };
  const over = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.transform  = "translateY(-3px)";
    (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(201,168,76,0.3)";
  };
  const out  = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.transform  = "";
    (e.currentTarget as HTMLElement).style.boxShadow = "";
  };
  if (href) return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={base} onMouseEnter={over} onMouseLeave={out}>
      {children}
    </a>
  );
  return (
    <button style={base} onClick={onClick} onMouseEnter={over} onMouseLeave={out}>
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Usługi",  id: "uslugi"  },
  { label: "Salony",  id: "salony"  },
  { label: "Zespół",  id: "zespol"  },
  { label: "Prace",   id: "prace"   },
  { label: "FAQ",     id: "faq"     },
  { label: "Kontakt", id: "kontakt" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:     "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background:   scrolled ? "rgba(8,8,8,0.98)" : "rgba(8,8,8,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: `1px solid ${scrolled ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.15)"}`,
      transition:   "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding:  scrolled ? "0.5rem 1.5rem" : "0.9rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "1rem",
        transition: "padding 0.3s ease",
      }}>
        {/* LEFT: Brand + Instagram */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit", display: "flex", alignItems: "center" }}
          >
            <span style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#FFFFFF" }}>
              Veteran Barber
            </span>
          </button>

        </div>

        {/* RIGHT: Nav links + CTA */}
        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => smoothScroll(l.id)}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", padding: 0, fontFamily: "inherit", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {l.label}
            </button>
          ))}
          <CTAGold small onClick={() => smoothScroll("salony")}>Umów się</CTAGold>
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "none" }}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display: "block", width: 24, height: 2, background: "#fff", borderRadius: 2, marginBottom: i < 2 ? 5 : 0, transition: "all 0.3s",
              transform: open && i === 0 ? "rotate(45deg) translate(5px,5px)" : open && i === 2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
              opacity: open && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: "rgba(8,8,8,0.99)", borderTop: "1px solid rgba(201,168,76,0.1)", padding: "0.75rem 1.5rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.1rem" }}>
          {NAV_LINKS.map((l) => (
            <button key={l.id}
              onClick={() => { setOpen(false); smoothScroll(l.id); }}
              style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "left", padding: "0.7rem 0", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {l.label}
            </button>
          ))}
          <CTAGold style={{ width: "100%", marginTop: "0.75rem" }} onClick={() => { setOpen(false); smoothScroll("salony"); }}>
            Umów się
          </CTAGold>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
        @media (max-width: 600px) {
          .ig-label { display: none; }
        }
      `}</style>
    </nav>
  );
}

/* ════════════════════════════════════════════════════
   HERO — bez logo
════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", background: T.bgPrimary, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
      {/* Spotlight gradients */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 25% 60%, rgba(201,168,76,0.06) 0%, transparent 55%),
                     radial-gradient(ellipse at 75% 30%, rgba(201,168,76,0.04) 0%, transparent 45%)`,
      }} />

      {/* Particles */}
      {PARTICLES.map((p) => (
        <div key={p.id} style={{
          position: "absolute", top: p.top, left: p.left,
          width: p.size, height: p.size, borderRadius: "50%",
          background: T.gold, opacity: 0.3, pointerEvents: "none", zIndex: 2,
          animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}

      {/* Horizontal gold line */}
      <div style={{ position: "absolute", top: "50%", left: "10%", right: "10%", height: 1, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)", pointerEvents: "none", zIndex: 2 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 1.5rem" }}>
        <h1 className="hero-h1" style={{
          fontSize: "clamp(2.8rem, 7vw, 6.5rem)", fontWeight: 900,
          letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.0, margin: 0,
          animation: "slideUp 0.9s ease-out 0.3s both",
          fontFamily: "var(--font-montserrat), Montserrat, sans-serif",
        }}>
          Haircut &amp; Shave
        </h1>

        <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`, margin: "1.75rem auto 0", animation: "slideUp 0.9s ease-out 0.45s both" }} />

        <p style={{ color: T.textSec, fontSize: "1.1rem", fontWeight: 300, letterSpacing: "0.05em", maxWidth: 440, lineHeight: 1.65, margin: "1.5rem 0 0", animation: "slideUp 0.9s ease-out 0.6s both" }}>
          Wychodzisz z fryzurą, która mówi sama za siebie.
        </p>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", marginTop: "2.5rem", animation: "slideUp 0.9s ease-out 0.9s both" }}>
          <CTAGold onClick={() => smoothScroll("salony")}>Umów się — Booksy</CTAGold>
          <button onClick={() => smoothScroll("uslugi")}
            style={{ background: "transparent", border: "1px solid rgba(201,168,76,0.5)", color: "rgba(255,255,255,0.85)", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "1rem 2.5rem", borderRadius: 2, minHeight: 52, cursor: "pointer", transition: "all 0.25s ease", display: "inline-flex", alignItems: "center", fontFamily: "inherit" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = T.gold; e.currentTarget.style.background = "rgba(201,168,76,0.08)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.85)"; e.currentTarget.style.transform = ""; }}
          >
            Sprawdź cennik
          </button>
        </div>

        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginTop: "1.25rem", letterSpacing: "0.06em", animation: "slideUp 0.9s ease-out 1.1s both" }}>
          Bez czekania. Rezerwacja online 24/7.
        </p>
      </div>

    </section>
  );
}

/* ════════════════════════════════════════════════════
   USŁUGI — accordion
════════════════════════════════════════════════════ */
const SERVICES = [
  {
    name:     "Strzyżenie włosów",
    price:    "70 zł",
    short:    "Tył i boki maszynką, góra nożyczkami lub brzytwą",
    full:     "Strzyżenie wykonywane jest tak, że tył i boki cieniowane są maszynką w celu uzyskania mocnego efektu. Góra w zależności od potrzeb, zastosowanej techniki, wymogów włosów i dobranej fryzury, strzyżona jest przy pomocy nożyczek, maszynki lub brzytwy.",
    highlight: false,
  },
  {
    name:     "Strzyżenie długich włosów",
    price:    "90 zł",
    short:    "Powyżej 4 cm, nożyczki + mycie",
    full:     "Strzyżenie długich włosów nożyczkami (+ 4cm), wraz z myciem głowy. Boki w zależności od potrzeb, wygolone maszynką lub nożyczkami.",
    highlight: false,
  },
  {
    name:     "Strzyżenie rekrut / Buzz cut",
    price:    "60 zł",
    short:    "Wojskowe cięcie, maszynka",
    full:     "Surowe, wojskowe cięcie. Całość wykonana maszynką na jedną długość lub krócej po bokach z płynnym przejściem do zera.",
    highlight: false,
  },
  {
    name:     "Broda",
    price:    "65 zł",
    short:    "Krótka (do 6 mm) lub pełna, formowanie i kontur",
    full:     "Zarost, czyli krótka broda do 6 mm skracana trymerem/maszynką po całości na jedną długość z cieniowaniem policzków i konturem. Pełna broda, czyli długi zarost formowany w kształt brody z cieniowaniem całości i konturem.",
    highlight: false,
  },
  {
    name:     "Combo mechaniczne",
    price:    "120 zł",
    short:    "Strzyżenie + broda elektrycznie",
    full:     "Strzyżenie włosów + ogarnięcie brody elektrycznie, w tym skrócenie, cieniowanie, kontur, pielęgnacja.",
    highlight: false,
  },
  {
    name:     "Combo PREMIUM",
    price:    "150 zł",
    short:    "Strzyżenie + broda + gorący ręcznik + brzytwa",
    full:     "Strzyżenie włosów + ogarnięcie brody PREMIUM w tym skrócenie, cieniowanie, kontur, pielęgnacja. Usługa stworzona dla mężczyzn, którzy oczekują czegoś więcej niż standardu. Całość dopełnia pielęgnacja, stylizacja oraz relaksujący rytuał gorącego ręcznika zakończony wykończeniem konturów brzytwą.",
    highlight: true,
  },
  {
    name:     "Wosk",
    price:    "40 zł",
    short:    "Depilacja nosa i uszu",
    full:     "Depilacja woskiem nosa i uszu.",
    highlight: false,
  },
];

function ServiceCard({ s, delay }: { s: typeof SERVICES[0]; delay: number }) {
  const [hovered,  setHovered]  = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="reveal"
      data-delay={delay}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    hovered || expanded ? "rgba(201,168,76,0.05)" : (s.highlight ? "rgba(201,168,76,0.06)" : T.bgCard),
        border:        `1px solid ${hovered || expanded || s.highlight ? "rgba(201,168,76,0.4)" : T.border}`,
        borderRadius:  4,
        padding:       "1.5rem 1.75rem",
        position:      "relative",
        transition:    "all 0.3s ease",
        transform:     hovered ? "translateY(-4px)" : "none",
        boxShadow:     hovered ? "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.15)" : "none",
        cursor:        "pointer",
      }}
    >
      {/* Badge */}
      {s.highlight && (
        <div style={{ position: "absolute", top: -1, right: "1.25rem", background: T.goldGrad, color: "#080808", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.2rem 0.65rem", borderRadius: "0 0 3px 3px" }}>
          Bestseller
        </div>
      )}

      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <p className="gradient-text" style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem", letterSpacing: "0.01em" }}>
            {s.name}
          </p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}>{s.short}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
            <span className="gradient-text">{s.price}</span>
          </span>
          <span style={{
            color:     T.gold,
            fontSize:  "1.1rem",
            fontWeight: 700,
            display:   "inline-block",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition:"transform 0.3s ease",
            lineHeight: 1,
          }}>↓</span>
        </div>
      </div>

      {/* Expandable description */}
      <div style={{
        maxHeight:  expanded ? 300 : 0,
        overflow:   "hidden",
        transition: "max-height 0.4s ease",
      }}>
        <div style={{ paddingTop: "1rem", borderTop: `1px solid ${T.borderGold}`, marginTop: "1rem" }}>
          <p style={{ color: T.textSec, fontSize: "0.875rem", lineHeight: 1.75 }}>
            {s.full}
          </p>
        </div>
      </div>
    </div>
  );
}

function Uslugi() {
  return (
    <section id="uslugi" style={{ position: "relative", zIndex: 1, background: T.bgSecondary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Co oferujemy</span>
          <h2 className="gradient-text" style={{ ...sectionTitle }}>
            Usługi i Ceny
          </h2>
          <GoldLine />
          <p style={{ color: T.textSec, fontSize: "0.82rem", marginTop: "1rem" }}>
            Jednolite ceny we wszystkich salonach · kliknij kartę aby poznać szczegóły
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {SERVICES.map((s, i) => <ServiceCard key={s.name} s={s} delay={i * 60} />)}
        </div>

        <div className="reveal" data-delay={300} style={{ textAlign: "center", marginTop: "3rem" }}>
          <CTAGold href="https://veteranbarber59.booksy.com/a/">Umów się teraz</CTAGold>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   SALONY — bez map
════════════════════════════════════════════════════ */
const SALONS = [
  {
    name:     "Salon Rogowskiego",
    address:  "Rogowskiego 1, 08-530 Dęblin",
    phone:    "+48 570 341 308",
    tel:      "+48570341308",
    hours:    ["Pon: 13:00–21:00", "Wt–Pt: 10:00–21:00", "Sob: 10:00–14:00"],
    barbers:  ["Daniel Dryk", "Joanna Dryk"],
    booksy:   "https://veteranbarber59.booksy.com/a/",
    btnLabel: "Umów się — Rogowskiego",
  },
  {
    name:     "Salon 41 Baza Lotnicza",
    address:  "Szkoły Podchorążych Lotnictwa 11, 08-521 Dęblin",
    phone:    "+48 570 341 308",
    tel:      "+48570341308",
    hours:    ["Pon–Pt: 8:00–18:00"],
    barbers:  ["Kasia Jaworska", "Natalia Chachaj"],
    booksy:   "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/",
    btnLabel: "Umów się — 41 Baza",
  },
  {
    name:     "Salon Ryki",
    address:  "Żytnia 8, 08-500 Ryki",
    phone:    "+48 539 335 542",
    tel:      "+48539335542",
    hours:    ["Pon–Wt: 12:00–20:00", "Śr–Pt: 10:00–18:00", "Sob: 9:00–15:00"],
    barbers:  ["Magda Majewska"],
    booksy:   "https://veteranbarberryki.booksy.com/a/",
    btnLabel: "Umów się — Ryki",
  },
];

function SalonCard({ s, delay }: { s: typeof SALONS[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="reveal"
      data-delay={delay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    T.bgCard,
        border:        `1px solid ${hovered ? "rgba(201,168,76,0.4)" : T.border}`,
        borderTop:     `2px solid ${T.gold}`,
        borderRadius:  4,
        padding:       "2rem",
        display:       "flex",
        flexDirection: "column",
        gap:           "1.1rem",
        transition:    "all 0.3s ease",
        transform:     hovered ? "translateY(-4px)" : "none",
        boxShadow:     hovered ? "0 24px 48px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <h3 style={{ fontWeight: 800, fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.2 }}>
        <span className="gradient-text">{s.name}</span>
      </h3>

      {[
        { icon: "📍", text: s.address },
        { icon: "📞", text: s.phone, href: `tel:${s.tel}` },
      ].map(({ icon, text, href }) => (
        <div key={icon} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "0.95rem", marginTop: "0.05rem", flexShrink: 0 }}>{icon}</span>
          {href
            ? <a href={href} style={{ color: T.textSec, fontSize: "0.85rem", lineHeight: 1.5, transition: "color 0.2s", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)} onMouseLeave={(e) => (e.currentTarget.style.color = T.textSec)}>{text}</a>
            : <p style={{ color: T.textSec, fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>{text}</p>
          }
        </div>
      ))}

      <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.95rem", marginTop: "0.05rem", flexShrink: 0 }}>🕐</span>
        <div>{s.hours.map((h) => <p key={h} style={{ color: T.textSec, fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>{h}</p>)}</div>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.95rem", marginTop: "0.05rem", flexShrink: 0 }}>✂️</span>
        <p style={{ color: T.textSec, fontSize: "0.82rem", margin: 0 }}>{s.barbers.join(", ")}</p>
      </div>

      <CTAGold href={s.booksy} style={{ marginTop: "0.5rem", width: "100%", fontSize: "0.78rem" }}>
        {s.btnLabel}
      </CTAGold>
    </div>
  );
}

function Salony() {
  return (
    <section id="salony" style={{ position: "relative", zIndex: 1, background: T.bgPrimary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Znajdź nas</span>
          <h2 className="gradient-text" style={{ ...sectionTitle }}>
            Nasze Salony
          </h2>
          <GoldLine />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {SALONS.map((s, i) => <SalonCard key={s.name} s={s} delay={i * 110} />)}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   NASZ ZESPÓŁ — z modalem
════════════════════════════════════════════════════ */
type TeamMember = {
  name:   string;
  salon:  string;
  booksy: string;
  photo?: string;
};

const TEAM: TeamMember[] = [
  { name: "Daniel Dryk",     salon: "Salon Rogowskiego 1, Dęblin",     booksy: "https://veteranbarber59.booksy.com/a/" },
  { name: "Joanna Dryk",     salon: "Salon Rogowskiego 1, Dęblin",     booksy: "https://veteranbarber59.booksy.com/a/" },
  { name: "Kasia Jaworska",  salon: "Salon 41 Baza Lotnicza, Dęblin",  booksy: "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/" },
  { name: "Natalia Chachaj", salon: "Salon 41 Baza Lotnicza, Dęblin",  booksy: "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/", photo: "/natalia.JPG" },
  { name: "Magda Majewska",  salon: "Salon Ryki, Żytnia 8",            booksy: "https://veteranbarberryki.booksy.com/a/",                    photo: "/magda.JPG"    },
];

function BarberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#0D0D0D", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 4, padding: "2.5rem", maxWidth: 420, width: "100%", position: "relative", animation: "slideUp 0.3s ease-out both" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: T.gold, fontSize: "1.4rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem 0.5rem", fontFamily: "inherit" }}
        >
          ✕
        </button>

        {/* Avatar — duże zdjęcie lub inicjały */}
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            style={{
              width:        220,
              height:       220,
              borderRadius: "50%",
              objectFit:    "cover",
              objectPosition: "top",
              border:       "3px solid rgba(201,168,76,0.6)",
              display:      "block",
              margin:       "0 auto 1.5rem",
              filter:       "brightness(0.97)",
              boxShadow:    "0 0 40px rgba(201,168,76,0.2)",
            }}
          />
        ) : (
          <div style={{
            width:          220,
            height:         220,
            borderRadius:   "50%",
            background:     "rgba(201,168,76,0.08)",
            border:         "3px solid rgba(201,168,76,0.4)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            margin:         "0 auto 1.5rem",
            boxShadow:      "0 0 40px rgba(201,168,76,0.15)",
          }}>
            <span style={{ fontSize: "3rem", color: T.gold, fontWeight: 900 }}>{initials(member.name)}</span>
          </div>
        )}

        <h3 style={{ color: "#FFFFFF", fontWeight: 800, fontSize: "1.2rem", textAlign: "center", marginBottom: "0.4rem", letterSpacing: "0.03em" }}>
          {member.name}
        </h3>
        <p style={{ color: T.gold, fontSize: "0.82rem", textAlign: "center", marginBottom: "1.5rem", letterSpacing: "0.06em" }}>
          {member.salon}
        </p>

        <div style={{ borderTop: `1px solid ${T.borderGold}`, paddingTop: "1.25rem", marginBottom: "1.75rem" }}>
          <p style={{ color: T.textSec, fontSize: "0.875rem", lineHeight: 1.7, textAlign: "center" }}>
            Specjalista z wieloletnim doświadczeniem w klasycznym barberingu. Umów się przez Booksy.
          </p>
        </div>

        <CTAGold href={member.booksy} style={{ width: "100%" }}>
          Umów się
        </CTAGold>
      </div>
    </div>
  );
}

function Zespol() {
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <section id="zespol" style={{ position: "relative", zIndex: 1, background: T.bgSecondary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Poznaj nas</span>
          <h2 className="gradient-text" style={{ ...sectionTitle }}>
            Nasz Zespół
          </h2>
          <GoldLine />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "1.25rem" }}>
          {TEAM.map((m, i) => (
            <BarberCard key={m.name} member={m} delay={i * 80} onClick={() => setSelected(m)} />
          ))}
        </div>
      </div>

      {selected && <BarberModal member={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function BarberCard({ member, delay, onClick }: { member: TeamMember; delay: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="reveal"
      data-delay={delay}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:    T.bgCard,
        border:        `1px solid ${hovered ? "rgba(201,168,76,0.4)" : T.border}`,
        borderTop:     `2px solid ${T.gold}`,
        borderRadius:  4,
        padding:       "1.5rem 1rem",
        textAlign:     "center",
        cursor:        "pointer",
        transition:    "all 0.3s ease",
        transform:     hovered ? "translateY(-4px)" : "none",
        boxShadow:     hovered ? "0 16px 40px rgba(0,0,0,0.4)" : "none",
      }}
    >
      {member.photo ? (
        <img src={member.photo} alt={member.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(201,168,76,0.5)", display: "block", margin: "0 auto", filter: "brightness(0.95)" }} />
      ) : (
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "2px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
          <span style={{ color: "#FFFFFF", fontSize: "1.25rem", fontWeight: 900 }}>{initials(member.name)}</span>
        </div>
      )}

      <p style={{ color: "#FFFFFF", fontWeight: 700, fontSize: "0.9rem", marginTop: "1rem", marginBottom: "0.3rem", letterSpacing: "0.01em" }}>
        {member.name}
      </p>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.78rem", lineHeight: 1.4, marginBottom: "0.6rem" }}>
        {member.salon}
      </p>
      <span style={{ color: T.gold, fontSize: "0.78rem", fontWeight: 600 }}>
        Zobacz profil →
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   NASZE PRACE — video + photos grid
════════════════════════════════════════════════════ */
const PHOTOS = [
  "/klient%201.jpeg",
  "/klient%202.jpeg",
  "/klient%203.jpeg",
  "/klient%204.JPEG",
];

function WorkPhoto({ src }: { src: string }) {
  return (
    <div style={{ overflow: "hidden", borderRadius: 4, aspectRatio: "3 / 4" }}>
      <img
        src={src}
        alt="Realizacja Veteran Barber"
        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)", display: "block", transition: "transform 0.3s ease, border-color 0.3s ease" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; }}
      />
    </div>
  );
}

function Prace() {
  return (
    <section id="prace" style={{ position: "relative", zIndex: 1, background: T.bgPrimary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "1rem" }}>
          <span style={sectionLabel}>Portfolio</span>
          <h2 className="gradient-text" style={{ ...sectionTitle }}>
            Nasze Prace
          </h2>
          <GoldLine />
        </div>
        <p className="reveal" data-delay={100} style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", textAlign: "center", marginBottom: "2rem", marginTop: "1rem" }}>
          Każde cięcie to nasza wizytówka.
        </p>

        {/*
          Grid asymetryczny:
          Col 1 (2fr) — klient6 video, cała wysokość (row 1-3)
          Col 2 (1fr) — klient5 video (row 1), klient1 foto (row 2), klient2 foto (row 3)
          Col 3 (1fr) — klient3 foto (row 1), klient4 foto (row 2), złoty kafelek (row 3)
        */}
        <div
          className="reveal prace-grid"
          data-delay={150}
          style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}
        >
          {/* klient6 — główne video, col 1, row 1-3 */}
          <div style={{ gridColumn: 1, gridRow: "1 / 4", overflow: "hidden", borderRadius: 4 }}>
            <video autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)", display: "block", transition: "border-color 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")}
            >
              <source src="/klient6-film.MOV" type="video/mp4" />
            </video>
          </div>

          {/* klient5 — drugie video, col 2, row 1 */}
          <div style={{ gridColumn: 2, gridRow: 1, overflow: "hidden", borderRadius: 4, aspectRatio: "3 / 4" }}>
            <video autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4, border: "1px solid rgba(201,168,76,0.2)", display: "block", transition: "border-color 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)")}
            >
              <source src="/klient5.MP4" type="video/mp4" />
            </video>
          </div>

          {/* klient3 — col 3, row 1 */}
          <div style={{ gridColumn: 3, gridRow: 1 }}><WorkPhoto src={PHOTOS[2]} /></div>

          {/* klient1 — col 2, row 2 */}
          <div style={{ gridColumn: 2, gridRow: 2 }}><WorkPhoto src={PHOTOS[0]} /></div>

          {/* klient4 — col 3, row 2 */}
          <div style={{ gridColumn: 3, gridRow: 2 }}><WorkPhoto src={PHOTOS[3]} /></div>

          {/* klient2 — col 2, row 3 */}
          <div style={{ gridColumn: 2, gridRow: 3 }}><WorkPhoto src={PHOTOS[1]} /></div>

          {/* Złoty kafelek — col 3, row 3 */}
          <div style={{ gridColumn: 3, gridRow: 3, aspectRatio: "3 / 4", borderRadius: 4, background: T.goldGrad, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.25rem", textAlign: "center" }}>
            <span style={{ color: "#080808", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1.3 }}>
              Veteran<br />Barber
            </span>
            <div style={{ width: 28, height: 1, background: "rgba(8,8,8,0.3)", margin: "0.75rem auto" }} />
            <span style={{ color: "rgba(8,8,8,0.65)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Haircut &amp; Shave
            </span>
          </div>
        </div>

        <p className="reveal" data-delay={400} style={{ color: T.textSec, fontSize: "0.875rem", textAlign: "center", marginTop: "2rem" }}>
          Chcesz zobaczyć więcej? Obserwuj nas na Instagramie —{" "}
          <a href="https://instagram.com/veteran_barber_pl" target="_blank" rel="noopener noreferrer"
            style={{ color: T.gold, fontWeight: 600, transition: "text-decoration 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            @veteran_barber_pl
          </a>
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .prace-grid {
            grid-template-columns: 1fr !important;
          }
          .prace-grid > div {
            grid-column: 1 !important;
            grid-row: auto !important;
          }
          .prace-grid > div:first-child { aspect-ratio: 9/16; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   FAQ — 9 pytań
════════════════════════════════════════════════════ */
const FAQ_ITEMS = [
  {
    q: "Jak umówić się na wizytę?",
    a: "Najwygodniej zarezerwować termin przez Booksy. Każdy z naszych salonów posiada osobny profil, dzięki czemu możesz wybrać dogodną lokalizację, usługę oraz barbera. Jeżeli wolisz kontakt bezpośredni, możesz również umówić wizytę telefonicznie. Chętnie pomożemy dobrać odpowiednią usługę i znaleźć najlepszy dostępny termin. Rezerwacja online jest dostępna 24/7 i pozwala na szybkie przełożenie lub odwołanie wizyty.",
  },
  {
    q: "Czy przyjmujecie klientów bez wcześniejszego zapisu?",
    a: "Tak, przyjmujemy również klientów bez wcześniejszej rezerwacji, jeśli w danym momencie dysponujemy wolnym terminem. Aby uniknąć niepotrzebnego oczekiwania, najlepiej wcześniej zadzwonić do salonu i upewnić się, czy możemy przyjąć Cię od ręki. Największą gwarancję dogodnego terminu daje jednak wcześniejsza rezerwacja przez Booksy.",
  },
  {
    q: "Co jeśli się spóźnię na wizytę?",
    a: "Jeżeli wiesz, że możesz się spóźnić, prosimy o wcześniejszą informację telefoniczną. Dzięki temu możemy odpowiednio zarządzić grafikiem i spróbować znaleźć najlepsze rozwiązanie. Dbamy o wysoką jakość każdej usługi, dlatego w przypadku większego spóźnienia możemy być zmuszeni do przełożenia wizyty na inny termin. Dzięki temu każdy klient otrzymuje pełną uwagę i standard obsługi, na jaki zasługuje.",
  },
  {
    q: "Czy mogę wybrać konkretnego barbera?",
    a: "Tak. Podczas rezerwacji przez Booksy możesz samodzielnie wybrać barbera, do którego chcesz się umówić. Jeżeli rezerwujesz wizytę telefonicznie, wystarczy poinformować nas, do którego barbera chcesz zostać zapisany, a sprawdzimy najbliższe dostępne terminy.",
  },
  {
    q: "Jak przygotować się do pierwszej wizyty?",
    a: "Nie musisz robić nic specjalnego — po prostu przyjdź. Jeśli chcesz nam ułatwić pracę i szybciej dojść do idealnego efektu: pokaż zdjęcie fryzury która Ci się podoba, powiedz jak układasz włosy na co dzień, wskaż czego zdecydowanie chcesz uniknąć. Dobierzemy cięcie tak, żeby pasowało do Twojej twarzy, włosów i stylu życia.",
  },
  {
    q: "Czy można płacić kartą?",
    a: 'Można. Technologia dotarła nawet do barber shopu. Gotówkę lubimy trochę bardziej — jest szybsza, cichsza i nigdy "nie ma problemu z terminalem". Ale jeśli żyjesz w 2026 i nie nosisz banknotów przy sobie — spokojnie, karta też przejdzie.',
  },
  {
    q: "Czy doradzacie z fryzurą?",
    a: "Tak — jeśli nie wiesz co wybrać, spokojnie ogarniemy temat i dopasujemy fryzurę do Ciebie.",
  },
  {
    q: "Co w przypadku niepojawienia się na wizycie lub jej odwołania?",
    a: "Szanujemy Twój czas i tak samo podchodzimy do czasu naszych barberów. Jeśli musisz zmienić termin — prosimy o informację najpóźniej 6 godzin przed wizytą, wtedy bez problemu przełożymy lub odwołamy rezerwację. Brak odwołania minimum 6 godzin przed wizytą lub niepojawienie się skutkuje naliczeniem 100% wartości usługi — to standardowa zasada rezerwacji, która chroni grafik i pracę zespołu. Rezerwując wizytę, akceptujesz te warunki.",
  },
  {
    q: "Dlaczego warto wybrać nas?",
    a: 'Bo nie robimy "byle jak i byle szybko". U nas nie wychodzisz z fryzurą, którą trzeba potem tłumaczyć znajomym. Tylko z taką, przy której słyszysz: "o, to wygląda dobrze". Dbamy o szczegóły, doradzamy zamiast zgadywać i pilnujemy, żebyś nie wyglądał jak własny eksperyment z TikToka.',
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ position: "relative", zIndex: 1, background: T.bgSecondary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Masz pytania?</span>
          <h2 style={{ ...sectionTitle, color: T.textPri }}>
            <span className="gradient-text">FAQ</span>
          </h2>
          <GoldLine />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="reveal" data-delay={i * 50} style={{ borderBottom: `1px solid ${T.border}`, ...(i === 0 ? { borderTop: `1px solid ${T.border}` } : {}) }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", background: "none", border: "none", padding: "1.3rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1.5rem", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}
              >
                <span style={{ color: open === i ? T.gold : T.textPri, fontWeight: 700, fontSize: "0.88rem", letterSpacing: "0.01em", transition: "color 0.2s", lineHeight: 1.4 }}>
                  {item.q}
                </span>
                <span style={{ color: T.gold, fontSize: "1.1rem", fontWeight: 700, flexShrink: 0, display: "inline-block", transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", lineHeight: 1 }}>
                  ↓
                </span>
              </button>
              <div style={{ maxHeight: open === i ? 600 : 0, overflow: "hidden", transition: "max-height 0.4s ease" }}>
                <p style={{ paddingBottom: "1.3rem", paddingLeft: "1rem", borderLeft: `2px solid ${T.goldDark}`, color: T.textSec, fontSize: "0.875rem", lineHeight: 1.8, marginBottom: "0.1rem" }}>
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   KONTAKT
════════════════════════════════════════════════════ */
function Kontakt() {
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd  = new FormData(e.currentTarget);
    const name = fd.get("name")    as string;
    const mail = fd.get("email")   as string;
    const msg  = fd.get("message") as string;
    const body = encodeURIComponent(`Imię: ${name}\nEmail: ${mail}\n\n${msg}`);
    window.location.href = `mailto:veteranbarbersc@gmail.com?subject=${encodeURIComponent("Zapytanie ze strony Veteran Barber")}&body=${body}`;
    setSent(true);
  }, []);

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 2,
    color: "#fff", padding: "0.8rem 1rem", fontSize: "0.875rem", outline: "none", transition: "border-color 0.2s ease",
    fontFamily: "inherit", minHeight: 48,
  };
  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.4)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em",
    textTransform: "uppercase", display: "block", marginBottom: "0.4rem",
  };

  return (
    <section id="kontakt" style={{ position: "relative", zIndex: 1, background: T.bgPrimary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1020, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Napisz do nas</span>
          <h2 style={{ ...sectionTitle, color: T.textPri }}>
            <span className="gradient-text">Kontakt</span>
          </h2>
          <GoldLine />
        </div>

        <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "5rem" }}>
          {/* Dane */}
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
            {[
              { label: "Email",           value: "veteranbarbersc@gmail.com", href: "mailto:veteranbarbersc@gmail.com", note: "Odpowiadamy w ciągu 24h" },
              { label: "Telefon — Dęblin",value: "+48 570 341 308",           href: "tel:+48570341308",                note: "Rogowskiego + 41 Baza Lotnicza" },
              { label: "Telefon — Ryki",  value: "+48 539 335 542",           href: "tel:+48539335542",                note: "Salon Żytnia 8" },
            ].map(({ label, value, href, note }) => (
              <div key={label}>
                <span style={{ ...sectionLabel, marginBottom: "0.4rem" }}>{label}</span>
                <a href={href} style={{ color: T.textPri, fontWeight: 700, fontSize: "1rem", display: "block", transition: "color 0.2s", textDecoration: "none" }} onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)} onMouseLeave={(e) => (e.currentTarget.style.color = T.textPri)}>
                  {value}
                </a>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginTop: "0.25rem" }}>{note}</p>
              </div>
            ))}
            <div style={{ padding: "1.1rem 1.25rem", background: "rgba(201,168,76,0.05)", borderLeft: `3px solid ${T.goldDark}`, borderRadius: "0 4px 4px 0" }}>
              <p style={{ color: T.textSec, fontSize: "0.85rem", lineHeight: 1.65 }}>
                Preferujesz szybki kontakt?{" "}
                <span style={{ color: T.gold, fontWeight: 600 }}>Zadzwoń lub napisz przez Booksy.</span>
              </p>
            </div>
          </div>

          {/* Formularz */}
          <form className="reveal" data-delay={100} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {[
              { name: "name",  label: "Imię i nazwisko", type: "text",  placeholder: "Jan Kowalski",       required: true },
              { name: "email", label: "Email",            type: "email", placeholder: "jan@example.com",    required: true },
            ].map(({ name, label, type, placeholder, required }) => (
              <div key={name}>
                <label style={labelStyle}>{label} *</label>
                <input name={name} type={type} required={required} placeholder={placeholder} style={inputStyle}
                  onFocus={(e)  => (e.currentTarget.style.borderColor = T.gold)}
                  onBlur={(e)   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Wiadomość *</label>
              <textarea name="message" required rows={5} placeholder="Twoja wiadomość..." style={{ ...inputStyle, resize: "none", minHeight: 130 }}
                onFocus={(e)  => (e.currentTarget.style.borderColor = T.gold)}
                onBlur={(e)   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")} />
            </div>
            <CTAGold style={{ width: "100%", marginTop: "0.25rem" }}>
              {sent ? "Wysłano ✓" : "Wyślij wiadomość"}
            </CTAGold>
          </form>
        </div>
      </div>

      <style>{`@media (max-width: 640px) { .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; } }`}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ position: "relative", zIndex: 1, background: "#030303", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "3.5rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2.5rem", marginBottom: "2.5rem" }}>
          {/* Brand + IG */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span className="gradient-text" style={{ fontWeight: 900, fontSize: "1.1rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Veteran Barber
            </span>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", margin: 0 }}>Haircut &amp; Shave — Dęblin i Ryki</p>
            <a href="mailto:veteranbarbersc@gmail.com" style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
              veteranbarbersc@gmail.com
            </a>

            {/* Instagram — duży przycisk w footerze */}
            <a
              href="https://instagram.com/veteran_barber_pl"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: T.gold, fontWeight: 600, fontSize: "1rem", marginTop: "0.5rem", textDecoration: "none", transition: "text-decoration 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              <IgIcon size={20} />
              @veteran_barber_pl
            </a>

            {/* Facebook placeholder */}
            <a href="#" aria-label="Facebook" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginTop: "0.25rem", textDecoration: "none", transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)} onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
              <FbIcon size={18} />
              Facebook
            </a>
          </div>

          {/* Salony */}
          <div>
            <p style={{ color: T.gold, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 1rem" }}>Salony — Booksy</p>
            {[
              { label: "Rogowskiego — Dęblin",     href: "https://veteranbarber59.booksy.com/a/" },
              { label: "41 Baza Lotnicza — Dęblin", href: "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/" },
              { label: "Żytnia 8 — Ryki",           href: "https://veteranbarberryki.booksy.com/a/" },
            ].map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", textDecoration: "none", marginBottom: "0.5rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Szybkie linki */}
          <div>
            <p style={{ color: T.gold, fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 1rem" }}>Szybkie linki</p>
            {[
              { label: "Usługi i Ceny", id: "uslugi"  },
              { label: "Nasz Zespół",   id: "zespol"  },
              { label: "Nasze Prace",   id: "prace"   },
              { label: "FAQ",           id: "faq"     },
              { label: "Kontakt",       id: "kontakt" },
            ].map((l) => (
              <button key={l.id} onClick={() => smoothScroll(l.id)}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", padding: "0 0 0.5rem", textAlign: "left", transition: "color 0.2s", fontFamily: "inherit" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
          © 2025 Veteran Barber. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}

/* ════════════════════════════════════════════════════
   PAGE ROOT
════════════════════════════════════════════════════ */
export default function Home() {
  useReveal();
  return (
    <>
      <Navbar />
      <Hero />
      <Uslugi />
      <Salony />
      <Zespol />
      <Prace />
      <FAQ />
      <Kontakt />
      <Footer />
    </>
  );
}
