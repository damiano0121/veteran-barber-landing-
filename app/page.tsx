"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════
   GLOBAL STYLES injected once
═══════════════════════════════════════════ */
const GLOBAL_CSS = `
  @keyframes float {
    0%,100% { transform: translateY(0px) rotate(-0.8deg); }
    50%      { transform: translateY(-18px) rotate(0.8deg); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes particleFloat {
    0%,100% { transform: translateY(0px) translateX(0px); opacity: 0.25; }
    33%      { transform: translateY(-20px) translateX(8px); opacity: 0.45; }
    66%      { transform: translateY(-10px) translateX(-6px); opacity: 0.2; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .slide-up-1 { animation: slideUp 0.8s ease-out 0.2s both; }
  .slide-up-2 { animation: slideUp 0.8s ease-out 0.5s both; }
  .slide-up-3 { animation: slideUp 0.8s ease-out 0.8s both; }
  .slide-up-4 { animation: slideUp 0.8s ease-out 1.0s both; }

  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .cta-gold {
    background: #B8962E;
    color: #1B4332;
    font-weight: 900;
    padding: 1rem 2.5rem;
    border-radius: 2px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.875rem;
    transition: all 0.25s ease;
    display: inline-block;
    min-height: 52px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .cta-gold:hover {
    background: #D4AF37;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(184,150,46,0.45);
  }
  .cta-outline {
    border: 2px solid #B8962E;
    color: white;
    background: transparent;
    font-weight: 900;
    padding: 1rem 2.5rem;
    border-radius: 2px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 0.875rem;
    transition: all 0.25s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 52px;
    cursor: pointer;
  }
  .cta-outline:hover {
    background: rgba(184,150,46,0.15);
    transform: translateY(-2px);
  }

  .service-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(184,150,46,0.2);
    border-radius: 4px;
    transition: all 0.3s ease;
    padding: 1.25rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    position: relative;
    cursor: default;
  }
  .service-card:hover {
    border-color: #B8962E;
    background: rgba(184,150,46,0.08);
    transform: translateY(-4px);
  }

  .salon-card {
    background: rgba(0,0,0,0.25);
    border-top: 3px solid #B8962E;
    border-radius: 4px;
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: transform 0.3s ease;
  }
  .salon-card:hover { transform: translateY(-4px); }

  .faq-item {
    border: 1px solid rgba(184,150,46,0.2);
    border-radius: 4px;
    overflow: hidden;
    transition: border-color 0.3s ease;
  }
  .faq-item:hover { border-color: rgba(184,150,46,0.5); }

  .form-input {
    width: 100%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(184,150,46,0.25);
    border-radius: 2px;
    color: white;
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.25s ease;
    font-family: inherit;
    min-height: 48px;
  }
  .form-input:focus { border-color: #B8962E; }
  .form-input::placeholder { color: rgba(255,255,255,0.35); }

  .nav-link {
    color: rgba(255,255,255,0.85);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.2s ease;
    background: none;
    border: none;
    padding: 0;
  }
  .nav-link:hover { color: #B8962E; }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
`;

/* ═══════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════ */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  top: `${5 + Math.floor((i * 17 + 11) % 90)}%`,
  left: `${3 + Math.floor((i * 23 + 7) % 94)}%`,
  size: 2 + (i % 3),
  duration: 4 + (i % 5),
  delay: -(i * 0.4),
}));

function Particles() {
  return (
    <>
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "#B8962E",
            opacity: 0.3,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════
   SCROLL HELPER
═══════════════════════════════════════════ */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL HOOK
═══════════════════════════════════════════ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = el.dataset.delay ?? "0";
            setTimeout(() => el.classList.add("visible"), Number(delay));
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Usługi", id: "uslugi" },
    { label: "Salony", id: "salony" },
    { label: "FAQ", id: "faq" },
    { label: "Kontakt", id: "kontakt" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(27,67,50,0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(184,150,46,0.3)",
        transition: "padding 0.3s ease, box-shadow 0.3s ease",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: scrolled ? "0.5rem 1.5rem" : "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "padding 0.3s ease",
        }}
      >
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#B8962E",
            fontWeight: 900,
            fontSize: "1rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Veteran Barber
        </button>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden-mobile">
          {links.map((l) => (
            <button key={l.id} className="nav-link" onClick={() => scrollTo(l.id)}>
              {l.label}
            </button>
          ))}
          <button
            className="cta-gold"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.75rem" }}
            onClick={() => scrollTo("salony")}
          >
            Umów się
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="show-mobile"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "4px",
          }}
          aria-label="Menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 24,
                height: 2,
                background: "white",
                borderRadius: 2,
                transition: "transform 0.3s, opacity 0.3s",
                transform:
                  open && i === 0
                    ? "rotate(45deg) translate(5px,5px)"
                    : open && i === 2
                    ? "rotate(-45deg) translate(5px,-5px)"
                    : "none",
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          style={{
            background: "#1B4332",
            borderTop: "1px solid rgba(184,150,46,0.2)",
            padding: "1rem 1.5rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              className="nav-link"
              style={{
                textAlign: "left",
                padding: "0.75rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                fontSize: "0.85rem",
              }}
              onClick={() => {
                setOpen(false);
                scrollTo(l.id);
              }}
            >
              {l.label}
            </button>
          ))}
          <button
            className="cta-gold"
            style={{ marginTop: "0.75rem", width: "100%" }}
            onClick={() => {
              setOpen(false);
              scrollTo("salony");
            }}
          >
            Umów się
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   HERO
═══════════════════════════════════════════ */
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at 60% 40%, #2D6A4F 0%, #1B4332 40%, #0A1F14 100%)",
        paddingTop: 80,
      }}
    >
      {/* Watermark logo — huge, blended */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <Image
          src="/IMG_8760.JPG"
          alt=""
          fill
          style={{
            objectFit: "contain",
            mixBlendMode: "luminosity",
            opacity: 0.12,
          }}
          priority
        />
      </div>

      {/* Particles */}
      <Particles />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 1.5rem",
          gap: 0,
        }}
      >
        {/* Floating logo — small, visible */}
        <div className="animate-float slide-up-1" style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              position: "relative",
              width: 180,
              height: 180,
            }}
          >
            <Image
              src="/IMG_8760.JPG"
              alt="Veteran Barber"
              fill
              style={{
                objectFit: "contain",
                opacity: 0.9,
                filter: "drop-shadow(0 0 60px rgba(184,150,46,0.4))",
                mixBlendMode: "normal",
              }}
              priority
            />
          </div>
        </div>

        {/* Decorative line */}
        <div
          className="slide-up-1"
          style={{
            width: 60,
            height: 2,
            background: "#B8962E",
            marginBottom: "2rem",
          }}
        />

        {/* H1 */}
        <h1
          className="slide-up-2"
          style={{
            fontSize: "clamp(2.8rem, 8vw, 7rem)",
            fontWeight: 900,
            color: "white",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            lineHeight: 1.05,
            margin: 0,
            marginBottom: "1.25rem",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Haircut &amp; Shave
        </h1>

        {/* Claim */}
        <p
          className="slide-up-2"
          style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.75)",
            maxWidth: 480,
            lineHeight: 1.6,
            margin: 0,
            marginBottom: "2.5rem",
          }}
        >
          Wychodzisz z fryzurą, która mówi sama za siebie.
        </p>

        {/* CTA buttons */}
        <div
          className="slide-up-3"
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "1.5rem",
          }}
        >
          <button className="cta-gold" onClick={() => scrollTo("salony")}>
            Umów się — Booksy
          </button>
          <button className="cta-outline" onClick={() => scrollTo("uslugi")}>
            Sprawdź cennik
          </button>
        </div>

        <p
          className="slide-up-4"
          style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", letterSpacing: "0.05em" }}
        >
          Bez czekania. Rezerwacja online 24/7.
        </p>
      </div>

      {/* Scroll arrow */}
      <div
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          animation: "slideUp 1s ease-out 1.5s both",
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          style={{ opacity: 0.5, animation: "particleFloat 2s ease-in-out infinite" }}
        >
          <path
            d="M8 12L15 19L22 12"
            stroke="#B8962E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   USŁUGI
═══════════════════════════════════════════ */
const SERVICES = [
  { name: "Strzyżenie włosów", desc: "Tył i boki maszynką, góra nożyczkami lub brzytwą", price: "70 zł", highlight: false },
  { name: "Strzyżenie długich włosów", desc: "Powyżej 4 cm, nożyczki + mycie", price: "90 zł", highlight: false },
  { name: "Strzyżenie rekrut / Buzz cut", desc: "Wojskowe cięcie, maszynka", price: "60 zł", highlight: false },
  { name: "Broda", desc: "Krótka (do 6 mm) lub pełna, formowanie i kontur", price: "65 zł", highlight: false },
  { name: "Combo mechaniczne", desc: "Strzyżenie + broda elektrycznie", price: "120 zł", highlight: false },
  { name: "Combo PREMIUM", desc: "Strzyżenie + broda + gorący ręcznik + brzytwa", price: "150 zł", highlight: true },
  { name: "Wosk", desc: "Depilacja nosa i uszu", price: "40 zł", highlight: false },
];

function Uslugi() {
  return (
    <section
      id="uslugi"
      style={{ background: "#0F2A1A", padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ color: "#B8962E", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Co oferujemy
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
              marginBottom: "0.75rem",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Usługi i Ceny
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem" }}>
            Jednolite ceny we wszystkich salonach
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "0.875rem",
          }}
        >
          {SERVICES.map((s, i) => (
            <div
              key={s.name}
              className={`service-card reveal${s.highlight ? " service-highlight" : ""}`}
              data-delay={String(i * 80)}
            >
              {s.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    right: "1rem",
                    background: "#B8962E",
                    color: "#1B4332",
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    padding: "0.2rem 0.6rem",
                    textTransform: "uppercase",
                    borderRadius: "0 0 3px 3px",
                  }}
                >
                  Bestseller
                </div>
              )}
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontWeight: 800,
                    color: s.highlight ? "#B8962E" : "white",
                    fontSize: "0.95rem",
                    margin: 0,
                    marginBottom: "0.3rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.name}
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", margin: 0 }}>
                  {s.desc}
                </p>
              </div>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "#B8962E",
                  whiteSpace: "nowrap",
                  letterSpacing: "-0.01em",
                }}
              >
                {s.price}
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ textAlign: "center", marginTop: "3rem" }} data-delay="200">
          <a href="https://veteranbarber59.booksy.com/a/" target="_blank" rel="noopener noreferrer" className="cta-gold">
            Umów się teraz
          </a>
        </div>
      </div>

      <style>{`
        .service-highlight {
          border-color: rgba(184,150,46,0.5) !important;
          background: rgba(184,150,46,0.05) !important;
        }
      `}</style>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SALONY
═══════════════════════════════════════════ */
const SALONS = [
  {
    name: "Salon Rogowskiego",
    address: "Rogowskiego 1, 08-530 Dęblin",
    phone: "+48 570 341 308",
    hours: ["Pon: 13:00–21:00", "Wt–Pt: 10:00–21:00", "Sob: 10:00–14:00"],
    booksy: "https://veteranbarber59.booksy.com/a/",
    label: "Umów się — Rogowskiego",
  },
  {
    name: "Salon 41 Baza Lotnicza",
    address: "Szkoły Podchorążych Lotnictwa 11, 08-521 Dęblin",
    phone: "+48 570 341 308",
    hours: ["Pon–Pt: 8:00–18:00"],
    booksy: "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/",
    label: "Umów się — 41 Baza",
  },
  {
    name: "Salon Ryki",
    address: "Żytnia 8, 08-500 Ryki",
    phone: "+48 539 335 542",
    hours: ["Pon–Wt: 12:00–20:00", "Śr–Pt: 10:00–18:00", "Sob: 9:00–15:00"],
    booksy: "https://veteranbarberryki.booksy.com/a/",
    label: "Umów się — Ryki",
  },
];

function Salony() {
  return (
    <section
      id="salony"
      style={{ background: "#1B4332", padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ color: "#B8962E", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Znajdź nas
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Nasze Salony
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {SALONS.map((s, i) => (
            <div key={s.name} className="salon-card reveal" data-delay={String(i * 120)}>
              <h3
                style={{
                  color: "#B8962E",
                  fontWeight: 900,
                  fontSize: "1.05rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: 0,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {s.name}
              </h3>

              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1rem", marginTop: "0.1rem", flexShrink: 0 }}>📍</span>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem", margin: 0, lineHeight: 1.5 }}>
                  {s.address}
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>📞</span>
                <a
                  href={`tel:${s.phone.replace(/\s/g, "")}`}
                  style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.875rem", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#B8962E")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                >
                  {s.phone}
                </a>
              </div>

              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1rem", marginTop: "0.1rem", flexShrink: 0 }}>🕐</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  {s.hours.map((h) => (
                    <p key={h} style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.825rem", margin: 0 }}>
                      {h}
                    </p>
                  ))}
                </div>
              </div>

              <a
                href={s.booksy}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-gold"
                style={{ marginTop: "0.5rem", width: "100%", fontSize: "0.8rem" }}
              >
                {s.label}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FAQ
═══════════════════════════════════════════ */
const FAQ_ITEMS = [
  {
    q: "Jak umówić się na wizytę?",
    a: "Przez Booksy 24/7 lub telefonicznie. Każdy salon ma osobny profil — wybierz lokalizację i barbera.",
  },
  {
    q: "Czy przyjmujecie bez zapisu?",
    a: "Tak, jeśli mamy wolny termin. Zadzwoń przed przyjazdem. Rezerwacja przez Booksy gwarantuje termin.",
  },
  {
    q: "Co jeśli się spóźnię lub chcę odwołać?",
    a: "Informacja min. 6h przed wizytą — przesuniemy bez problemu. Brak odwołania = 100% wartości usługi.",
  },
  {
    q: "Czy można płacić kartą?",
    a: "Tak. Gotówka też mile widziana.",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section
      id="faq"
      style={{ background: "#0F2A1A", padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ color: "#B8962E", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Masz pytania?
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            FAQ
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq-item reveal" data-delay={String(i * 80)}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.03)",
                  border: "none",
                  padding: "1.25rem 1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  textAlign: "left",
                  gap: "1rem",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.q}
                </span>
                <span
                  style={{
                    color: "#B8962E",
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    flexShrink: 0,
                    transform: open === i ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                    display: "inline-block",
                    lineHeight: 1,
                  }}
                >
                  ↓
                </span>
              </button>
              {open === i && (
                <div
                  style={{
                    background: "rgba(184,150,46,0.05)",
                    padding: "1rem 1.5rem 1.25rem",
                    borderTop: "1px solid rgba(184,150,46,0.15)",
                    color: "rgba(255,255,255,0.65)",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                  }}
                >
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

/* ═══════════════════════════════════════════
   KONTAKT
═══════════════════════════════════════════ */
function Kontakt() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const msg = fd.get("message") as string;
    const body = encodeURIComponent(`Imię: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:veteranbarbersc@gmail.com?subject=${encodeURIComponent("Zapytanie ze strony")}&body=${body}`;
    setSent(true);
  }

  return (
    <section
      id="kontakt"
      style={{ background: "#1B4332", padding: "6rem 1.5rem" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p style={{ color: "#B8962E", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            Napisz do nas
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 900,
              color: "white",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: 0,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            Kontakt
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
          }}
          className="contact-grid"
        >
          {/* Dane */}
          <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              { label: "Email", value: "veteranbarbersc@gmail.com", href: "mailto:veteranbarbersc@gmail.com", note: "Odpowiadamy w ciągu 24h" },
              { label: "Telefon — Dęblin", value: "+48 570 341 308", href: "tel:+48570341308", note: "Rogowskiego + 41 Baza Lotnicza" },
              { label: "Telefon — Ryki", value: "+48 539 335 542", href: "tel:+48539335542", note: "Salon Żytnia 8" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  style={{
                    color: "#B8962E",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    margin: 0,
                    marginBottom: "0.4rem",
                  }}
                >
                  {item.label}
                </p>
                <a
                  href={item.href}
                  style={{ color: "white", fontSize: "1rem", fontWeight: 700, textDecoration: "none", display: "block" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#B8962E")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                >
                  {item.value}
                </a>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", margin: "0.25rem 0 0" }}>
                  {item.note}
                </p>
              </div>
            ))}

            <div
              style={{
                marginTop: "1rem",
                padding: "1rem 1.25rem",
                background: "rgba(0,0,0,0.2)",
                borderLeft: "3px solid #B8962E",
                borderRadius: "0 4px 4px 0",
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: 0, lineHeight: 1.6 }}>
                Preferujesz szybki kontakt?{" "}
                <span style={{ color: "#B8962E", fontWeight: 700 }}>
                  Zadzwoń lub napisz przez Booksy.
                </span>
              </p>
            </div>
          </div>

          {/* Formularz */}
          <form
            onSubmit={handleSubmit}
            className="reveal"
            data-delay="100"
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
                Imię i nazwisko *
              </label>
              <input name="name" required className="form-input" placeholder="Jan Kowalski" />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
                Email *
              </label>
              <input name="email" type="email" required className="form-input" placeholder="jan@example.com" />
            </div>
            <div>
              <label style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
                Wiadomość *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="form-input"
                placeholder="Twoja wiadomość..."
                style={{ resize: "none", minHeight: 130 }}
              />
            </div>
            <button
              type="submit"
              className="cta-gold"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {sent ? "Wysłano ✓" : "Wyślij wiadomość"}
            </button>
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

/* ═══════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background: "#0A1F14", padding: "3.5rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <span
              style={{
                color: "#B8962E",
                fontWeight: 900,
                fontSize: "1.1rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Veteran Barber
            </span>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", margin: 0 }}>
              Haircut &amp; Shave — Dęblin i Ryki
            </p>
            <a
              href="mailto:veteranbarbersc@gmail.com"
              style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#B8962E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >
              veteranbarbersc@gmail.com
            </a>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              {[
                { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  style={{ color: "#B8962E", opacity: 0.7, transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Salony */}
          <div>
            <p style={{ color: "#B8962E", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 1rem" }}>
              Salony — Booksy
            </p>
            {[
              { label: "Rogowskiego — Dęblin", href: "https://veteranbarber59.booksy.com/a/" },
              { label: "41 Baza Lotnicza — Dęblin", href: "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/" },
              { label: "Żytnia 8 — Ryki", href: "https://veteranbarberryki.booksy.com/a/" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "block", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", textDecoration: "none", marginBottom: "0.5rem", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#B8962E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Linki */}
          <div>
            <p style={{ color: "#B8962E", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 1rem" }}>
              Szybkie linki
            </p>
            {[
              { label: "Usługi i Ceny", id: "uslugi" },
              { label: "Kontakt", id: "kontakt" },
              { label: "FAQ", id: "faq" },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{ display: "block", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", padding: "0 0 0.5rem", textAlign: "left", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#B8962E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "1.5rem",
            textAlign: "center",
            color: "rgba(255,255,255,0.2)",
            fontSize: "0.78rem",
          }}
        >
          © 2025 Veteran Barber. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   PAGE ROOT
═══════════════════════════════════════════ */
export default function Home() {
  useReveal();

  return (
    <>
      <style>{GLOBAL_CSS}</style>
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
