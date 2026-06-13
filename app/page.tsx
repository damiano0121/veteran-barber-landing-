"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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
  top:      `${6 + ((i * 19 + 13) % 86)}%`,
  left:     `${4 + ((i * 31 + 9) % 90)}%`,
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

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
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
   SHARED STYLES
════════════════════════════════════════════════════ */
const sectionLabel: React.CSSProperties = {
  color:         T.gold,
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
    <div
      style={{
        width,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
        margin: "1.25rem auto 0",
      }}
    />
  );
}

function CTAGold({
  children,
  onClick,
  href,
  small,
  style: extra,
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
    ...extra,
  };

  const hover = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
    (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 40px rgba(201,168,76,0.3)";
    (e.currentTarget as HTMLElement).style.animation = "pulse-gold 1.5s ease-in-out infinite";
  };
  const leave = (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.transform = "";
    (e.currentTarget as HTMLElement).style.boxShadow = "";
    (e.currentTarget as HTMLElement).style.animation = "";
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={base}
        onMouseEnter={hover} onMouseLeave={leave}>
        {children}
      </a>
    );
  }
  return (
    <button style={base} onClick={onClick} onMouseEnter={hover} onMouseLeave={leave}>
      {children}
    </button>
  );
}

/* ════════════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Usługi", id: "uslugi" },
  { label: "Salony", id: "salony" },
  { label: "FAQ",    id: "faq"    },
  { label: "Kontakt",id: "kontakt"},
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navStyle: React.CSSProperties = {
    position:       "fixed",
    top:            0,
    left:           0,
    right:          0,
    zIndex:         100,
    background:     scrolled ? "rgba(8,8,8,0.98)" : "rgba(8,8,8,0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom:   `1px solid ${scrolled ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.15)"}`,
    transition:     "all 0.3s ease",
  };

  const innerStyle: React.CSSProperties = {
    maxWidth:       1200,
    margin:         "0 auto",
    padding:        scrolled ? "0.6rem 1.5rem" : "1.1rem 1.5rem",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "space-between",
    transition:     "padding 0.3s ease",
  };

  return (
    <nav style={navStyle}>
      <div style={innerStyle}>
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background:        "none",
            border:            "none",
            cursor:            "pointer",
            fontWeight:        900,
            fontSize:          "1.05rem",
            letterSpacing:     "0.15em",
            textTransform:     "uppercase",
          }}
        >
          <span className="gradient-text">Veteran Barber</span>
        </button>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="nav-desktop">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => smoothScroll(l.id)}
              style={{
                background:    "none",
                border:        "none",
                color:         "rgba(255,255,255,0.7)",
                fontWeight:    600,
                fontSize:      "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition:    "color 0.2s",
                cursor:        "pointer",
                padding:       0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {l.label}
            </button>
          ))}
          <CTAGold small onClick={() => smoothScroll("salony")}>Umów się</CTAGold>
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{
              display:    "block",
              width:      24,
              height:     2,
              background: "#fff",
              borderRadius: 2,
              marginBottom: i < 2 ? 5 : 0,
              transition: "all 0.3s",
              transform:  open && i === 0 ? "rotate(45deg) translate(5px, 5px)"
                        : open && i === 2 ? "rotate(-45deg) translate(5px, -5px)"
                        : "none",
              opacity:    open && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background:   "rgba(8,8,8,0.99)",
          borderTop:    "1px solid rgba(201,168,76,0.15)",
          padding:      "1rem 1.5rem 1.5rem",
          display:      "flex",
          flexDirection:"column",
          gap:          "0.25rem",
        }}>
          {NAV_LINKS.map((l) => (
            <button key={l.id}
              onClick={() => { setOpen(false); smoothScroll(l.id); }}
              style={{
                background:    "none",
                border:        "none",
                color:         "rgba(255,255,255,0.7)",
                fontWeight:    600,
                fontSize:      "0.85rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textAlign:     "left",
                padding:       "0.8rem 0",
                borderBottom:  "1px solid rgba(255,255,255,0.05)",
                cursor:        "pointer",
                transition:    "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
            >
              {l.label}
            </button>
          ))}
          <div style={{ marginTop: "0.75rem" }}>
            <CTAGold style={{ width: "100%" }} onClick={() => { setOpen(false); smoothScroll("salony"); }}>
              Umów się
            </CTAGold>
          </div>
        </div>
      )}

      <style>{`
        .nav-desktop    { }
        .nav-hamburger  { display: none; }
        @media (max-width: 768px) {
          .nav-desktop   { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

/* ════════════════════════════════════════════════════
   HERO
════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section style={{
      position:   "relative",
      minHeight:  "100vh",
      background: T.bgPrimary,
      overflow:   "hidden",
      display:    "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 80,
    }}>
      {/* Layer 1 — Spotlight gradients */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: `
          radial-gradient(ellipse at 25% 60%, rgba(201,168,76,0.06) 0%, transparent 55%),
          radial-gradient(ellipse at 75% 30%, rgba(201,168,76,0.04) 0%, transparent 45%)
        `,
        pointerEvents: "none",
      }} />

      {/* Layer 2 — Watermark logo (screen blend removes JPG black bg) */}
      <div style={{
        position:  "absolute",
        width:     700,
        height:    700,
        top:       "50%",
        left:      "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex:    1,
      }}>
        <Image
          src="/IMG_8760.JPG"
          alt=""
          fill
          priority
          style={{
            objectFit:    "contain",
            mixBlendMode: "screen",
            opacity:      0.06,
            filter:       "grayscale(100%) brightness(3)",
          }}
        />
      </div>

      {/* Layer 3 — Particles */}
      {PARTICLES.map((p) => (
        <div key={p.id} style={{
          position:      "absolute",
          top:           p.top,
          left:          p.left,
          width:         p.size,
          height:        p.size,
          borderRadius:  "50%",
          background:    T.gold,
          opacity:       0.3,
          animation:     `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          pointerEvents: "none",
          zIndex:        2,
        }} />
      ))}

      {/* Layer 4 — Horizontal gold line */}
      <div style={{
        position:   "absolute",
        top:        "50%",
        left:       "10%",
        right:      "10%",
        height:     1,
        background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)",
        pointerEvents: "none",
        zIndex:     2,
      }} />

      {/* Content */}
      <div style={{
        position:       "relative",
        zIndex:         10,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        textAlign:      "center",
        padding:        "0 1.5rem",
      }}>
        {/* Floating logo */}
        <div style={{
          width:     160,
          height:    160,
          position:  "relative",
          animation: "float 6s ease-in-out infinite, slideUp 0.9s ease-out 0.1s both",
          marginBottom: "0.5rem",
        }}>
          <Image
            src="/IMG_8760.JPG"
            alt="Veteran Barber"
            fill
            priority
            style={{
              objectFit:    "contain",
              mixBlendMode: "screen",
              opacity:      0.95,
              filter:       "drop-shadow(0 0 40px rgba(201,168,76,0.5)) brightness(1.1)",
            }}
          />
        </div>

        {/* Decorative line */}
        <div style={{
          width:      60,
          height:     1,
          background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
          margin:     "1.5rem auto 2rem",
          animation:  "slideUp 0.9s ease-out 0.2s both",
        }} />

        {/* H1 */}
        <h1
          className="hero-h1"
          style={{
            fontSize:      "clamp(2.8rem, 7vw, 6.5rem)",
            fontWeight:    900,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            lineHeight:    1.0,
            margin:        0,
            animation:     "slideUp 0.9s ease-out 0.3s both",
            fontFamily:    "var(--font-montserrat), Montserrat, sans-serif",
          }}
        >
          Haircut &amp; Shave
        </h1>

        {/* Claim */}
        <p style={{
          color:         T.textSec,
          fontSize:      "1.1rem",
          fontWeight:    300,
          letterSpacing: "0.05em",
          maxWidth:      460,
          lineHeight:    1.65,
          margin:        "1.5rem 0 0",
          animation:     "slideUp 0.9s ease-out 0.6s both",
        }}>
          Wychodzisz z fryzurą, która mówi sama za siebie.
        </p>

        {/* CTA buttons */}
        <div style={{
          display:        "flex",
          gap:            "1rem",
          flexWrap:       "wrap",
          justifyContent: "center",
          marginTop:      "2.5rem",
          animation:      "slideUp 0.9s ease-out 0.9s both",
        }}>
          <CTAGold onClick={() => smoothScroll("salony")}>
            Umów się — Booksy
          </CTAGold>

          <button
            onClick={() => smoothScroll("uslugi")}
            style={{
              background:    "transparent",
              border:        "1px solid rgba(201,168,76,0.5)",
              color:         "rgba(255,255,255,0.85)",
              fontWeight:    700,
              fontSize:      "0.85rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding:       "1rem 2.5rem",
              borderRadius:  2,
              minHeight:     52,
              cursor:        "pointer",
              transition:    "all 0.25s ease",
              display:       "inline-flex",
              alignItems:    "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor  = T.gold;
              e.currentTarget.style.background   = "rgba(201,168,76,0.08)";
              e.currentTarget.style.color        = "#fff";
              e.currentTarget.style.transform    = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor  = "rgba(201,168,76,0.5)";
              e.currentTarget.style.background   = "transparent";
              e.currentTarget.style.color        = "rgba(255,255,255,0.85)";
              e.currentTarget.style.transform    = "";
            }}
          >
            Sprawdź cennik
          </button>
        </div>

        {/* Subtitle */}
        <p style={{
          color:     "rgba(255,255,255,0.3)",
          fontSize:  "0.78rem",
          marginTop: "1.25rem",
          letterSpacing: "0.06em",
          animation: "slideUp 0.9s ease-out 1.1s both",
        }}>
          Bez czekania. Rezerwacja online 24/7.
        </p>
      </div>

      {/* Scroll indicator — vertical line that fills */}
      <div style={{
        position:   "absolute",
        bottom:     "2rem",
        left:       "50%",
        transform:  "translateX(-50%)",
        display:    "flex",
        flexDirection: "column",
        alignItems: "center",
        gap:        "0.5rem",
        animation:  "slideUp 1s ease-out 1.4s both",
      }}>
        <span style={{ color: "rgba(201,168,76,0.4)", fontSize: "0.65rem", letterSpacing: "0.15em" }}>
          SCROLL
        </span>
        <div style={{
          width:    1,
          height:   48,
          background: "rgba(201,168,76,0.15)",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position:   "absolute",
            left:       0,
            right:      0,
            top:        0,
            background: T.gold,
            animation:  "scrollFill 1.8s ease-in-out infinite",
          }} />
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   USŁUGI
════════════════════════════════════════════════════ */
const SERVICES = [
  { name: "Strzyżenie włosów",         desc: "Tył i boki maszynką, góra nożyczkami lub brzytwą", price: "70 zł",  highlight: false },
  { name: "Strzyżenie długich włosów", desc: "Powyżej 4 cm, nożyczki + mycie",                   price: "90 zł",  highlight: false },
  { name: "Strzyżenie rekrut / Buzz cut", desc: "Wojskowe cięcie, maszynka",                     price: "60 zł",  highlight: false },
  { name: "Broda",                     desc: "Krótka (do 6 mm) lub pełna, formowanie i kontur",  price: "65 zł",  highlight: false },
  { name: "Combo mechaniczne",         desc: "Strzyżenie + broda elektrycznie",                   price: "120 zł", highlight: false },
  { name: "Combo PREMIUM",             desc: "Strzyżenie + broda + gorący ręcznik + brzytwa",    price: "150 zł", highlight: true  },
  { name: "Wosk",                      desc: "Depilacja nosa i uszu",                            price: "40 zł",  highlight: false },
];

function ServiceCard({ s, delay }: { s: typeof SERVICES[0]; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="reveal"
      data-delay={delay}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   hovered ? "rgba(201,168,76,0.05)" : (s.highlight ? "rgba(201,168,76,0.06)" : T.bgCard),
        border:       `1px solid ${hovered || s.highlight ? "rgba(201,168,76,0.4)" : T.border}`,
        borderRadius: 4,
        padding:      "1.75rem",
        display:      "flex",
        justifyContent: "space-between",
        alignItems:   "flex-start",
        gap:          "1.25rem",
        position:     "relative",
        transition:   "all 0.3s ease",
        transform:    hovered ? "translateY(-4px)" : "none",
        boxShadow:    hovered ? "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.2)" : "none",
        cursor:       "default",
      }}
    >
      {s.highlight && (
        <div style={{
          position:      "absolute",
          top:           -1,
          right:         "1.25rem",
          background:    T.goldGrad,
          color:         "#080808",
          fontSize:      "0.65rem",
          fontWeight:    800,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding:       "0.2rem 0.65rem",
          borderRadius:  "0 0 3px 3px",
        }}>
          Bestseller
        </div>
      )}
      <div style={{ flex: 1, paddingRight: "0.5rem" }}>
        <p style={{ color: T.textPri, fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem", letterSpacing: "0.01em" }}>
          {s.name}
        </p>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", lineHeight: 1.5 }}>
          {s.desc}
        </p>
      </div>
      <div style={{
        fontSize:   "1.5rem",
        fontWeight: 800,
        whiteSpace: "nowrap",
        letterSpacing: "-0.01em",
      }}>
        <span className="gradient-text">{s.price}</span>
      </div>
    </div>
  );
}

function Uslugi() {
  return (
    <section id="uslugi" style={{ background: T.bgSecondary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Co oferujemy</span>
          <h2 style={{ ...sectionTitle, color: T.textPri }}>
            <span className="gradient-text">Usługi</span>{" "}
            <span style={{ color: T.textPri }}>i Ceny</span>
          </h2>
          <GoldLine />
          <p style={{ color: T.textSec, fontSize: "0.82rem", marginTop: "1rem" }}>
            Jednolite ceny we wszystkich salonach
          </p>
        </div>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap:                 "0.875rem",
        }}>
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.name} s={s} delay={i * 70} />
          ))}
        </div>

        <div className="reveal" data-delay={300} style={{ textAlign: "center", marginTop: "3rem" }}>
          <CTAGold href="https://veteranbarber59.booksy.com/a/">
            Umów się teraz
          </CTAGold>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   SALONY
════════════════════════════════════════════════════ */
const SALONS = [
  {
    name:    "Salon Rogowskiego",
    address: "Rogowskiego 1, 08-530 Dęblin",
    phone:   "+48 570 341 308",
    tel:     "+48570341308",
    hours:   ["Pon: 13:00–21:00", "Wt–Pt: 10:00–21:00", "Sob: 10:00–14:00"],
    barbers: ["Daniel Dryk", "Joanna Dryk"],
    booksy:  "https://veteranbarber59.booksy.com/a/",
    btnLabel:"Umów się — Rogowskiego",
    mapSrc:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39695.27289773679!2d21.8020974486328!3d51.550732300000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47189de453c2a91b%3A0xd614d93340918fd9!2sVeteran%20Barber!5e0!3m2!1spl!2spl!4v1781376643041!5m2!1spl!2spl",
  },
  {
    name:    "Salon 41 Baza Lotnicza",
    address: "Szkoły Podchorążych Lotnictwa 11, 08-521 Dęblin",
    phone:   "+48 570 341 308",
    tel:     "+48570341308",
    hours:   ["Pon–Pt: 8:00–18:00"],
    barbers: ["Kasia Jaworska", "Natalia Chachaj"],
    booksy:  "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/",
    btnLabel:"Umów się — 41 Baza",
    mapSrc:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.8206525045607!2d21.862413188460835!3d51.55318759917343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47189d29b98d4eb9%3A0x7ad6e46e9f597f13!2sVeteran%20Barber%20-%2041%20Baza%20Lotnictwa%20Szkolnego!5e0!3m2!1spl!2spl!4v1781376610941!5m2!1spl!2spl",
  },
  {
    name:    "Salon Ryki",
    address: "Żytnia 8, 08-500 Ryki",
    phone:   "+48 539 335 542",
    tel:     "+48539335542",
    hours:   ["Pon–Wt: 12:00–20:00", "Śr–Pt: 10:00–18:00", "Sob: 9:00–15:00"],
    barbers: ["Magda Majewska"],
    booksy:  "https://veteranbarberryki.booksy.com/a/",
    btnLabel:"Umów się — Ryki",
    mapSrc:  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2477.085552345337!2d21.93264157640027!3d51.62164197183955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47189f2c80a824a3%3A0xbdcd6a63c35f7d13!2sVeteran%20Barber%20Ryki!5e0!3m2!1spl!2spl!4v1781376586816!5m2!1spl!2spl",
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
        background:   T.bgCard,
        border:       `1px solid ${hovered ? "rgba(201,168,76,0.4)" : T.border}`,
        borderTop:    `2px solid ${T.gold}`,
        borderRadius: 4,
        padding:      "2rem",
        display:      "flex",
        flexDirection:"column",
        gap:          "1.1rem",
        transition:   "all 0.3s ease",
        transform:    hovered ? "translateY(-4px)" : "none",
        boxShadow:    hovered ? "0 24px 48px rgba(0,0,0,0.5)" : "none",
      }}
    >
      <h3 style={{
        fontWeight:    800,
        fontSize:      "1rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        lineHeight:    1.2,
      }}>
        <span className="gradient-text">{s.name}</span>
      </h3>

      {[
        { icon: "📍", content: s.address },
        { icon: "📞", content: s.phone, href: `tel:${s.tel}` },
      ].map(({ icon, content, href }) => (
        <div key={icon} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
          <span style={{ fontSize: "0.95rem", marginTop: "0.05rem", flexShrink: 0 }}>{icon}</span>
          {href
            ? <a href={href} style={{ color: T.textSec, fontSize: "0.85rem", lineHeight: 1.5, transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = T.textSec)}>
                {content}
              </a>
            : <p style={{ color: T.textSec, fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>{content}</p>
          }
        </div>
      ))}

      <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.95rem", marginTop: "0.05rem", flexShrink: 0 }}>🕐</span>
        <div>
          {s.hours.map((h) => (
            <p key={h} style={{ color: T.textSec, fontSize: "0.82rem", lineHeight: 1.6, margin: 0 }}>{h}</p>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.95rem", marginTop: "0.05rem", flexShrink: 0 }}>✂️</span>
        <p style={{ color: T.textSec, fontSize: "0.82rem", margin: 0 }}>{s.barbers.join(", ")}</p>
      </div>

      <CTAGold href={s.booksy} style={{ marginTop: "0.5rem", width: "100%", fontSize: "0.78rem" }}>
        {s.btnLabel}
      </CTAGold>

      <iframe
        src={s.mapSrc}
        width="100%"
        height="220"
        style={{
          border:       0,
          borderRadius: 4,
          outline:      "1px solid rgba(201,168,76,0.2)",
          filter:       "grayscale(100%) invert(92%) contrast(83%)",
          marginTop:    "1.5rem",
          display:      "block",
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa — ${s.name}`}
      />
    </div>
  );
}

function Salony() {
  return (
    <section id="salony" style={{ background: T.bgPrimary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Znajdź nas</span>
          <h2 style={{ ...sectionTitle, color: T.textPri }}>
            Nasze <span className="gradient-text">Salony</span>
          </h2>
          <GoldLine />
        </div>

        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap:                 "1.5rem",
        }}>
          {SALONS.map((s, i) => <SalonCard key={s.name} s={s} delay={i * 110} />)}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   FAQ
════════════════════════════════════════════════════ */
const FAQ_ITEMS = [
  { q: "Jak umówić się na wizytę?",
    a: "Przez Booksy 24/7 lub telefonicznie. Każdy salon ma osobny profil — wybierz lokalizację i barbera." },
  { q: "Czy przyjmujecie bez zapisu?",
    a: "Tak, jeśli mamy wolny termin. Zadzwoń przed przyjazdem. Rezerwacja przez Booksy gwarantuje termin." },
  { q: "Co jeśli się spóźnię lub chcę odwołać?",
    a: "Informacja min. 6h przed wizytą — przesuniemy bez problemu. Brak odwołania = 100% wartości usługi." },
  { q: "Czy można płacić kartą?",
    a: "Tak. Gotówka też mile widziana." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" style={{ background: T.bgSecondary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Masz pytania?</span>
          <h2 style={{ ...sectionTitle, color: T.textPri }}>
            <span className="gradient-text">FAQ</span>
          </h2>
          <GoldLine />
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="reveal"
              data-delay={i * 80}
              style={{
                borderBottom: `1px solid ${T.border}`,
                ...(i === 0 ? { borderTop: `1px solid ${T.border}` } : {}),
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width:         "100%",
                  background:    "none",
                  border:        "none",
                  padding:       "1.4rem 0",
                  display:       "flex",
                  justifyContent:"space-between",
                  alignItems:    "center",
                  gap:           "1.5rem",
                  textAlign:     "left",
                  cursor:        "pointer",
                }}
              >
                <span style={{
                  color:         open === i ? T.gold : T.textPri,
                  fontWeight:    700,
                  fontSize:      "0.9rem",
                  letterSpacing: "0.01em",
                  transition:    "color 0.2s",
                }}>
                  {item.q}
                </span>
                <span style={{
                  color:       T.gold,
                  fontSize:    "1.2rem",
                  fontWeight:  700,
                  flexShrink:  0,
                  display:     "inline-block",
                  transform:   open === i ? "rotate(180deg)" : "rotate(0deg)",
                  transition:  "transform 0.3s ease",
                  lineHeight:  1,
                }}>
                  ↓
                </span>
              </button>
              {open === i && (
                <div style={{
                  paddingBottom: "1.4rem",
                  color:         T.textSec,
                  fontSize:      "0.875rem",
                  lineHeight:    1.75,
                  borderLeft:    `2px solid ${T.goldDark}`,
                  paddingLeft:   "1rem",
                  marginBottom:  "0.25rem",
                }}>
                  {item.a}
                </div>
              )}
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
    const fd   = new FormData(e.currentTarget);
    const name = fd.get("name")    as string;
    const mail = fd.get("email")   as string;
    const msg  = fd.get("message") as string;
    const body = encodeURIComponent(`Imię: ${name}\nEmail: ${mail}\n\n${msg}`);
    window.location.href = `mailto:veteranbarbersc@gmail.com?subject=${encodeURIComponent("Zapytanie ze strony Veteran Barber")}&body=${body}`;
    setSent(true);
  }, []);

  const inputStyle: React.CSSProperties = {
    width:       "100%",
    background:  "rgba(255,255,255,0.03)",
    border:      "1px solid rgba(255,255,255,0.08)",
    borderRadius: 2,
    color:       "#fff",
    padding:     "0.8rem 1rem",
    fontSize:    "0.875rem",
    outline:     "none",
    transition:  "border-color 0.2s ease",
    fontFamily:  "inherit",
    minHeight:   48,
  };

  const labelStyle: React.CSSProperties = {
    color:         "rgba(255,255,255,0.4)",
    fontSize:      "0.68rem",
    fontWeight:    700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    display:       "block",
    marginBottom:  "0.4rem",
  };

  return (
    <section id="kontakt" style={{ background: T.bgPrimary, padding: "6rem 1.5rem" }}>
      <div style={{ maxWidth: 1020, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <span style={sectionLabel}>Napisz do nas</span>
          <h2 style={{ ...sectionTitle, color: T.textPri }}>
            <span className="gradient-text">Kontakt</span>
          </h2>
          <GoldLine />
        </div>

        <div className="contact-grid" style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1.2fr",
          gap:                 "5rem",
        }}>
          {/* Data */}
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "2.25rem" }}>
            {[
              { label: "Email", value: "veteranbarbersc@gmail.com", href: "mailto:veteranbarbersc@gmail.com", note: "Odpowiadamy w ciągu 24h" },
              { label: "Telefon — Dęblin",value: "+48 570 341 308", href: "tel:+48570341308", note: "Rogowskiego + 41 Baza Lotnicza" },
              { label: "Telefon — Ryki",  value: "+48 539 335 542", href: "tel:+48539335542", note: "Salon Żytnia 8" },
            ].map(({ label, value, href, note }) => (
              <div key={label}>
                <span style={{ ...sectionLabel, marginBottom: "0.4rem" }}>{label}</span>
                <a href={href}
                  style={{ color: T.textPri, fontWeight: 700, fontSize: "1rem", display: "block", transition: "color 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.textPri)}>
                  {value}
                </a>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", marginTop: "0.25rem" }}>{note}</p>
              </div>
            ))}

            <div style={{
              padding:    "1.1rem 1.25rem",
              background: "rgba(201,168,76,0.05)",
              borderLeft: `3px solid ${T.goldDark}`,
              borderRadius: "0 4px 4px 0",
              marginTop:  "0.5rem",
            }}>
              <p style={{ color: T.textSec, fontSize: "0.85rem", lineHeight: 1.65 }}>
                Preferujesz szybki kontakt?{" "}
                <span style={{ color: T.gold, fontWeight: 600 }}>
                  Zadzwoń lub napisz przez Booksy.
                </span>
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            className="reveal"
            data-delay={100}
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            {[
              { name: "name",    label: "Imię i nazwisko",     type: "text",  placeholder: "Jan Kowalski", required: true  },
              { name: "email",   label: "Email",               type: "email", placeholder: "jan@example.com", required: true },
            ].map(({ name, label, type, placeholder, required }) => (
              <div key={name}>
                <label style={labelStyle}>{label} {required && "*"}</label>
                <input
                  name={name}
                  type={type}
                  required={required}
                  placeholder={placeholder}
                  style={inputStyle}
                  onFocus={(e)  => (e.currentTarget.style.borderColor = T.gold)}
                  onBlur={(e)   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Wiadomość *</label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Twoja wiadomość..."
                style={{ ...inputStyle, resize: "none", minHeight: 130 }}
                onFocus={(e)  => (e.currentTarget.style.borderColor = T.gold)}
                onBlur={(e)   => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>
            <CTAGold style={{ width: "100%", marginTop: "0.25rem" }}>
              {sent ? "Wysłano ✓" : "Wyślij wiadomość"}
            </CTAGold>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}

/* ════════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{
      background:  "#030303",
      borderTop:   "1px solid rgba(201,168,76,0.15)",
      padding:     "3rem 1.5rem",
      textAlign:   "center",
      display:     "flex",
      flexDirection:"column",
      alignItems:  "center",
      gap:         "0.6rem",
    }}>
      <div style={{
        fontWeight:    900,
        fontSize:      "1.15rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}>
        <span className="gradient-text">Veteran Barber</span>
      </div>
      <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Haircut &amp; Shave
      </p>

      <div style={{
        width:      40,
        height:     1,
        background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)`,
        margin:     "0.75rem auto",
      }} />

      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", justifyContent: "center", marginBottom: "0.5rem" }}>
        {[
          { label: "Rogowskiego", href: "https://veteranbarber59.booksy.com/a/" },
          { label: "41 Baza Lotnicza", href: "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/" },
          { label: "Ryki", href: "https://veteranbarberryki.booksy.com/a/" },
        ].map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", letterSpacing: "0.06em", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = T.gold)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}>
            {l.label}
          </a>
        ))}
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {[
          { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
          { label: "Facebook",  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
        ].map(({ label, path }) => (
          <a key={label} href="#" aria-label={label}
            style={{ color: T.gold, opacity: 0.6, transition: "opacity 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d={path} />
            </svg>
          </a>
        ))}
      </div>

      <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", marginTop: "0.75rem", letterSpacing: "0.04em" }}>
        © 2025 Veteran Barber. Wszelkie prawa zastrzeżone.
      </p>
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
      <FAQ />
      <Kontakt />
      <Footer />
    </>
  );
}
