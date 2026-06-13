"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ─────────────── helpers ─────────────── */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("fade-in-up");
          el.classList.remove("opacity-0");
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ─────────────── NAVBAR ─────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Usługi", id: "uslugi" },
    { label: "Salony", id: "salony" },
    { label: "FAQ", id: "faq" },
    { label: "Kontakt", id: "kontakt" },
  ];
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: "#1B4332" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 focus:outline-none"
          >
            <span
              className="text-xl font-bold tracking-widest uppercase"
              style={{ color: "#B8962E" }}
            >
              Veteran Barber
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm font-semibold uppercase tracking-wider text-white hover:text-[#B8962E] transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("salony")}
              className="ml-4 px-4 py-2 text-sm font-bold uppercase tracking-wider rounded transition-colors"
              style={{ background: "#B8962E", color: "#1A1A1A" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#d4a93a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#B8962E")
              }
            >
              Umów się
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3"
          style={{ background: "#1B4332" }}
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setOpen(false);
                scrollTo(l.id);
              }}
              className="text-left text-base font-semibold uppercase tracking-wider text-white hover:text-[#B8962E] transition-colors py-2 border-b border-white/10"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => {
              setOpen(false);
              scrollTo("salony");
            }}
            className="mt-2 px-4 py-3 text-sm font-bold uppercase tracking-wider rounded text-[#1A1A1A] min-h-[48px]"
            style={{ background: "#B8962E" }}
          >
            Umów się
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─────────────── HERO ─────────────── */
function Hero() {
  return (
    <section
      className="relative flex flex-col items-center justify-center min-h-screen pt-16"
      style={{ background: "linear-gradient(to bottom, #1B4332, #0D2B1D)" }}
    >
      {/* Floating logo */}
      <div className="animate-float mb-6 md:mb-8">
        <Image
          src="/IMG_8760.JPG"
          alt="Veteran Barber Logo"
          width={220}
          height={220}
          priority
          className="w-36 h-36 md:w-56 md:h-56 object-contain"
          style={{
            opacity: 0.88,
            filter: "drop-shadow(0 0 40px rgba(184,150,46,0.25))",
            mixBlendMode: "luminosity",
          }}
          onError={(e) => {
            // fallback if no logo file
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Fallback text logo when image missing */}
      <div className="text-center px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-widest text-white mb-4"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Haircut &amp; Shave
        </h1>
        <p
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-md mx-auto mb-8 md:mb-10"
          style={{ fontFamily: "var(--font-montserrat), Montserrat, sans-serif" }}
        >
          Wychodzisz z fryzurą, która mówi sama za siebie.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <button
            onClick={() => scrollTo("salony")}
            className="px-8 py-4 font-bold uppercase tracking-widest text-sm rounded transition-colors min-h-[52px]"
            style={{ background: "#B8962E", color: "#1A1A1A" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#d4a93a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#B8962E")
            }
          >
            Umów się — Booksy
          </button>
          <button
            onClick={() => scrollTo("uslugi")}
            className="px-8 py-4 font-bold uppercase tracking-widest text-sm rounded border-2 text-white transition-colors min-h-[52px]"
            style={{ borderColor: "#B8962E", color: "#fff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(184,150,46,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            Sprawdź cennik
          </button>
        </div>
        <p className="text-white/50 text-sm">
          Bez czekania. Rezerwacja online 24/7.
        </p>
      </div>

      {/* Scroll arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          className="opacity-60"
        >
          <path
            d="M7 11L14 18L21 11"
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

/* ─────────────── USŁUGI I CENY ─────────────── */
const SERVICES = [
  {
    name: "Strzyżenie włosów",
    desc: "Tył i boki maszynką, góra nożyczkami lub brzytwą",
    price: "70 zł",
    highlight: false,
  },
  {
    name: "Strzyżenie długich włosów",
    desc: "Powyżej 4 cm, nożyczki + mycie",
    price: "90 zł",
    highlight: false,
  },
  {
    name: "Strzyżenie rekrut / Buzz cut",
    desc: "Wojskowe cięcie, maszynka",
    price: "60 zł",
    highlight: false,
  },
  {
    name: "Broda",
    desc: "Krótka (do 6 mm) lub pełna, formowanie i kontur",
    price: "65 zł",
    highlight: false,
  },
  {
    name: "Combo mechaniczne",
    desc: "Strzyżenie + broda elektrycznie",
    price: "120 zł",
    highlight: false,
  },
  {
    name: "Combo PREMIUM",
    desc: "Strzyżenie + broda + gorący ręcznik + brzytwa",
    price: "150 zł",
    highlight: true,
  },
  {
    name: "Wosk",
    desc: "Depilacja nosa i uszu",
    price: "40 zł",
    highlight: false,
  },
];

function Uslugi() {
  const ref = useFadeIn() as React.RefObject<HTMLElement>;
  return (
    <section
      id="uslugi"
      ref={ref}
      className="opacity-0 py-20 px-4"
      style={{ background: "#F5F0E8" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-black uppercase tracking-widest text-center mb-2"
          style={{ color: "#1B4332" }}
        >
          Usługi i Ceny
        </h2>
        <p
          className="text-center text-sm mb-10"
          style={{ color: "#555" }}
        >
          Jednolite ceny we wszystkich salonach
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              className="relative rounded-lg p-5 flex justify-between items-start gap-4 transition-all duration-200 cursor-default"
              style={{
                background: s.highlight ? "#fff" : "#fff",
                border: s.highlight ? "2px solid #B8962E" : "2px solid transparent",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#B8962E";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = s.highlight
                  ? "#B8962E"
                  : "transparent";
              }}
            >
              {s.highlight && (
                <span
                  className="absolute top-3 right-3 text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{ background: "#B8962E", color: "#1A1A1A" }}
                >
                  Bestseller
                </span>
              )}
              <div className="flex-1 pr-2">
                <p
                  className="font-bold text-base mb-1"
                  style={{ color: "#1B4332" }}
                >
                  {s.name}
                </p>
                <p className="text-sm" style={{ color: "#666" }}>
                  {s.desc}
                </p>
              </div>
              <div
                className="text-2xl font-black whitespace-nowrap"
                style={{ color: "#B8962E" }}
              >
                {s.price}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://veteranbarber59.booksy.com/a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 font-bold uppercase tracking-widest text-sm rounded transition-colors min-h-[52px]"
            style={{ background: "#B8962E", color: "#1A1A1A" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#d4a93a")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#B8962E")
            }
          >
            Umów się teraz
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── SALONY ─────────────── */
const SALONS = [
  {
    name: "Salon Rogowskiego",
    address: "Rogowskiego 1, 08-530 Dęblin",
    phone: "+48 570 341 308",
    hours: ["Pon: 13:00–21:00", "Wt–Pt: 10:00–21:00", "Sob: 10:00–14:00"],
    barbers: ["Daniel Dryk", "Joanna Dryk"],
    booksy: "https://veteranbarber59.booksy.com/a/",
    booksyLabel: "Umów się — Rogowskiego",
  },
  {
    name: "Salon 41 Baza Lotnicza",
    address: "Szkoły Podchorążych Lotnictwa 11, 08-521 Dęblin",
    phone: "+48 570 341 308",
    hours: ["Pon–Pt: 8:00–18:00"],
    barbers: ["Kasia Jaworska", "Natalia Chachaj"],
    booksy: "https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/",
    booksyLabel: "Umów się — 41 Baza",
  },
  {
    name: "Salon Ryki",
    address: "Żytnia 8, 08-500 Ryki",
    phone: "+48 539 335 542",
    hours: ["Pon–Wt: 12:00–20:00", "Śr–Pt: 10:00–18:00", "Sob: 9:00–15:00"],
    barbers: ["Magda Majewska"],
    booksy: "https://veteranbarberryki.booksy.com/a/",
    booksyLabel: "Umów się — Ryki",
  },
];

function Salony() {
  const ref = useFadeIn() as React.RefObject<HTMLElement>;
  return (
    <section
      id="salony"
      ref={ref}
      className="opacity-0 py-20 px-4"
      style={{ background: "#1B4332" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-center text-white mb-12">
          Nasze Salony
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SALONS.map((salon) => (
            <div
              key={salon.name}
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <h3
                className="text-xl font-black uppercase tracking-wide"
                style={{ color: "#B8962E" }}
              >
                {salon.name}
              </h3>

              <div className="flex items-start gap-2 text-sm text-white/80">
                <span className="mt-0.5">📍</span>
                <span>{salon.address}</span>
              </div>

              <div className="flex items-start gap-2 text-sm text-white/80">
                <span className="mt-0.5">📞</span>
                <a
                  href={`tel:${salon.phone.replace(/\s/g, "")}`}
                  className="hover:text-[#B8962E] transition-colors"
                >
                  {salon.phone}
                </a>
              </div>

              <div className="flex items-start gap-2 text-sm text-white/80">
                <span className="mt-0.5">🕐</span>
                <div className="flex flex-col gap-0.5">
                  {salon.hours.map((h) => (
                    <span key={h}>{h}</span>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-white/80">
                <span className="mt-0.5">✂️</span>
                <span>{salon.barbers.join(", ")}</span>
              </div>

              <a
                href={salon.booksy}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto flex items-center justify-center text-center px-4 py-3 font-bold uppercase tracking-widest text-sm rounded transition-colors min-h-[48px]"
                style={{ background: "#B8962E", color: "#1A1A1A" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#d4a93a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#B8962E")
                }
              >
                {salon.booksyLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── ZESPÓŁ ─────────────── */
const TEAM = [
  { name: "Daniel Dryk", salon: "Rogowskiego" },
  { name: "Joanna Dryk", salon: "Rogowskiego" },
  { name: "Kasia Jaworska", salon: "41 Baza Lotnicza" },
  { name: "Natalia Chachaj", salon: "41 Baza Lotnicza" },
  { name: "Magda Majewska", salon: "Ryki" },
];

function Zespol() {
  const ref = useFadeIn() as React.RefObject<HTMLElement>;
  return (
    <section
      ref={ref}
      className="opacity-0 py-20 px-4"
      style={{ background: "#F5F0E8" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-black uppercase tracking-widest text-center mb-12"
          style={{ color: "#1B4332" }}
        >
          Nasz Zespół
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {TEAM.map((m) => (
            <div
              key={m.name}
              className="flex flex-col items-center gap-3 w-36"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black"
                style={{ background: "#1B4332", color: "#B8962E" }}
              >
                {m.name[0]}
              </div>
              <p
                className="font-bold text-center text-sm"
                style={{ color: "#1B4332" }}
              >
                {m.name}
              </p>
              <p className="text-xs text-center" style={{ color: "#777" }}>
                {m.salon}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FAQ ─────────────── */
const FAQ_ITEMS = [
  {
    q: "Jak umówić się na wizytę?",
    a: "Przez Booksy 24/7 (link w bio i na stronie) lub telefonicznie. Każdy salon ma osobny profil — wybierz lokalizację i barbera.",
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
  const ref = useFadeIn() as React.RefObject<HTMLElement>;
  return (
    <section
      id="faq"
      ref={ref}
      className="opacity-0 py-20 px-4"
      style={{ background: "#1B4332" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-center text-white mb-12">
          FAQ
        </h2>
        <div className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left font-bold text-white hover:text-[#B8962E] transition-colors text-sm uppercase tracking-wide"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{item.q}</span>
                <span
                  className="text-[#B8962E] text-xl transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div
                  className="px-5 pb-5 text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.75)" }}
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

/* ─────────────── KONTAKT ─────────────── */
function Kontakt() {
  const ref = useFadeIn() as React.RefObject<HTMLElement>;
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const subject = data.get("subject") as string;
    const message = data.get("message") as string;
    const body = encodeURIComponent(
      `Imię i nazwisko: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:veteranbarbersc@gmail.com?subject=${encodeURIComponent(subject || "Zapytanie ze strony")}&body=${body}`;
    setSent(true);
  }

  return (
    <section
      id="kontakt"
      ref={ref}
      className="opacity-0 py-20 px-4"
      style={{ background: "#F5F0E8" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-4xl font-black uppercase tracking-widest text-center mb-12"
          style={{ color: "#1B4332" }}
        >
          Kontakt
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Dane kontaktowe */}
          <div className="flex flex-col gap-6">
            <div>
              <p
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: "#B8962E" }}
              >
                Email
              </p>
              <a
                href="mailto:veteranbarbersc@gmail.com"
                className="text-base font-semibold hover:underline"
                style={{ color: "#1B4332" }}
              >
                veteranbarbersc@gmail.com
              </a>
              <p className="text-xs mt-1" style={{ color: "#777" }}>
                Odpowiadamy na emaile w ciągu 24h
              </p>
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: "#B8962E" }}
              >
                Telefon — Dęblin
              </p>
              <a
                href="tel:+48570341308"
                className="text-base font-semibold hover:underline"
                style={{ color: "#1B4332" }}
              >
                +48 570 341 308
              </a>
              <p className="text-xs mt-0.5" style={{ color: "#777" }}>
                Salon Rogowskiego + 41 Baza Lotnicza
              </p>
            </div>

            <div>
              <p
                className="text-xs uppercase tracking-widest font-bold mb-1"
                style={{ color: "#B8962E" }}
              >
                Telefon — Ryki
              </p>
              <a
                href="tel:+48539335542"
                className="text-base font-semibold hover:underline"
                style={{ color: "#1B4332" }}
              >
                +48 539 335 542
              </a>
              <p className="text-xs mt-0.5" style={{ color: "#777" }}>
                Salon Żytnia 8
              </p>
            </div>

            <div className="mt-4 p-4 rounded-lg" style={{ background: "#1B4332" }}>
              <p className="text-white/70 text-sm">
                Preferujesz szybki kontakt?{" "}
                <span style={{ color: "#B8962E" }}>Zadzwoń lub napisz przez Booksy.</span>
              </p>
            </div>
          </div>

          {/* Formularz */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-bold block mb-1" style={{ color: "#1B4332" }}>
                Imię i nazwisko *
              </label>
              <input
                name="name"
                required
                className="w-full px-4 py-3 rounded border text-sm focus:outline-none focus:border-[#B8962E] transition-colors"
                style={{ borderColor: "#ccc", background: "#fff", color: "#1A1A1A", minHeight: "48px" }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold block mb-1" style={{ color: "#1B4332" }}>
                Email *
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded border text-sm focus:outline-none focus:border-[#B8962E] transition-colors"
                style={{ borderColor: "#ccc", background: "#fff", color: "#1A1A1A", minHeight: "48px" }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold block mb-1" style={{ color: "#1B4332" }}>
                Temat
              </label>
              <input
                name="subject"
                className="w-full px-4 py-3 rounded border text-sm focus:outline-none focus:border-[#B8962E] transition-colors"
                style={{ borderColor: "#ccc", background: "#fff", color: "#1A1A1A", minHeight: "48px" }}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold block mb-1" style={{ color: "#1B4332" }}>
                Wiadomość *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded border text-sm focus:outline-none focus:border-[#B8962E] transition-colors resize-none"
                style={{ borderColor: "#ccc", background: "#fff", color: "#1A1A1A" }}
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 font-bold uppercase tracking-widest text-sm rounded transition-colors min-h-[52px]"
              style={{ background: "#B8962E", color: "#1A1A1A" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#d4a93a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#B8962E")
              }
            >
              {sent ? "Wysłano ✓" : "Wyślij"}
            </button>
            <p className="text-xs text-center" style={{ color: "#777" }}>
              Preferujesz szybki kontakt? Zadzwoń lub napisz przez Booksy.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── FOOTER ─────────────── */
function Footer() {
  return (
    <footer
      className="py-14 px-4"
      style={{ background: "#1A1A1A" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <span
              className="text-lg font-black uppercase tracking-widest"
              style={{ color: "#B8962E" }}
            >
              Veteran Barber
            </span>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Haircut &amp; Shave — Dęblin i Ryki
            </p>
            <a
              href="mailto:veteranbarbersc@gmail.com"
              className="text-sm hover:underline"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              veteranbarbersc@gmail.com
            </a>
            {/* Social */}
            <div className="flex gap-4 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "#B8962E" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "#B8962E" }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Salony */}
          <div>
            <p
              className="text-xs uppercase tracking-widest font-bold mb-4"
              style={{ color: "#B8962E" }}
            >
              Salony — Booksy
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://veteranbarber59.booksy.com/a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-[#B8962E] transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Rogowskiego — Dęblin
              </a>
              <a
                href="https://veteranbarber41bazalotnictwaszkolnego.booksy.com/a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-[#B8962E] transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                41 Baza Lotnicza — Dęblin
              </a>
              <a
                href="https://veteranbarberryki.booksy.com/a/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-[#B8962E] transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Żytnia 8 — Ryki
              </a>
            </div>
          </div>

          {/* Szybkie linki */}
          <div>
            <p
              className="text-xs uppercase tracking-widest font-bold mb-4"
              style={{ color: "#B8962E" }}
            >
              Szybkie linki
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Usługi i Ceny", id: "uslugi" },
                { label: "Kontakt", id: "kontakt" },
                { label: "FAQ", id: "faq" },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="text-left text-sm hover:text-[#B8962E] transition-colors"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="pt-6 text-center text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.3)" }}
        >
          © 2025 Veteran Barber. Wszelkie prawa zastrzeżone.
        </div>
      </div>
    </footer>
  );
}

/* ─────────────── PAGE ─────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Uslugi />
      <Salony />
      <Zespol />
      <FAQ />
      <Kontakt />
      <Footer />
    </>
  );
}
