import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Play, MapPin, Phone, Instagram, ArrowUp, Menu, X, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import emailjs from "@emailjs/browser";

// --- WHATSAPP HELPERS ---
const WA_NUMBER = "5511947719311";
const WA_SPECIALIST = "5511954891005";
const waLink = (text: string) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const waLinkSpecialist = (text: string) => `https://wa.me/${WA_SPECIALIST}?text=${encodeURIComponent(text)}`;

// --- NAV HELPERS ---
const NAV_LINKS = [
  { label: "Início", href: "#hero" },
  { label: "Prótese Capilar", href: "#protese" },
  { label: "Nossos Serviços", href: "#servicos" },
  { label: "MS Academy", href: "#academy" },
  { label: "Atendimento", href: "#atendimento" },
  { label: "Avaliações", href: "#resultados" },
  { label: "Sobre", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const scrollToSection = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

// --- HEADER ---
const Header = () => {
  const [visible, setVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border transition-opacity duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="container mx-auto px-5 md:px-20 max-w-7xl grid grid-cols-[auto_1fr_auto] lg:grid-cols-3 items-center h-24">
        <button onClick={() => scrollToSection("#hero")} className="flex items-center gap-3 shrink-0 justify-self-start">
          <img src="/images/logo.png" alt="MS Hair Studio" className="h-14 md:h-16 w-auto object-contain" />
        </button>

        <nav className="hidden lg:flex items-center justify-center gap-9 justify-self-center">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToSection(link.href)}
              className="text-sm text-muted hover:text-primary transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className="lg:hidden text-white justify-self-end"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="hidden lg:block justify-self-end" />
      </div>

      <div
        className={cn(
          "lg:hidden bg-background border-t border-border overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          mobileOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <nav className="flex flex-col px-5 py-6 gap-1">
          {NAV_LINKS.map((link, i) => (
            <button
              key={link.href}
              onClick={() => {
                scrollToSection(link.href);
                setMobileOpen(false);
              }}
              style={{
                transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
              }}
              className={cn(
                "text-left text-white hover:text-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] text-base py-3 min-h-[44px]",
                mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              )}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

// --- HERO SECTION ---
const HERO_IMAGES: { src: string; position: string }[] = [
  { src: "/images/hero_confianca.jpg",  position: "75% center" },
  { src: "/images/hero_identidade.jpg", position: "75% center" },
  { src: "/images/hero_voce_e.jpg",     position: "75% center" },
];

type HeroGalleryProps = { currentImg: number; prevImg: number | null };

const HeroGallery = ({ currentImg, prevImg }: HeroGalleryProps) => (
  <div className="absolute inset-0">
    {prevImg !== null && (
      <img
        key={`ghost-${prevImg}`}
        src={HERO_IMAGES[prevImg].src}
        alt=""
        className="absolute inset-0 w-full h-full object-contain opacity-[0.08] blur-md scale-105"
      />
    )}
    <img
      key={`current-${currentImg}`}
      src={HERO_IMAGES[currentImg].src}
      alt="Cliente MS Hair Studio"
      className="absolute inset-0 w-full h-full object-contain animate-hero-fade-in"
    />
  </div>
);

const HERO_SERVICES = ["Prótese Capilar", "Barbearia", "Salão de Beleza"];

const HERO_WORDS = [
  { prefix: "Recupere", text: "Sua Confiança", final: false },
  { prefix: "Recupere", text: "Sua Identidade", final: false },
  { prefix: "Volte a Ser", text: "Quem Você É", final: true },
];

const HERO_COUNT = HERO_IMAGES.length; // 3 — photos, services and words are all in sync

const Hero = () => {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevIndex((prev) => (prev === null ? 0 : (prev + 1) % HERO_COUNT));
      setIndex((prev) => (prev + 1) % HERO_COUNT);
      setCycleKey((k) => k + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const current = HERO_WORDS[index];

  return (
    <section id="hero" className="relative bg-background overflow-hidden">

      {/* ── MOBILE layout (stacked) ── */}
      <div className="flex flex-col min-h-[100dvh] md:hidden">
        {/* Foto — topo, sem texto por cima */}
        <div className="relative w-full" style={{ height: "52dvh" }}>
          <HeroGallery currentImg={index} prevImg={prevIndex} />
          {/* gradiente na base da foto para fundir com o fundo escuro */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
        </div>

        {/* Texto — abaixo da foto, centralizado */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-14 pt-4 gap-6 text-center">
          {/* Logo + serviço */}
          <div className="flex flex-col items-center">
            <img
              src="/images/logo.png"
              alt="MS Hair Studio"
              className="w-36 h-auto object-contain"
            />
            <div className="h-5 flex items-center justify-center overflow-hidden -mt-3">
              <span
                key={cycleKey}
                className="text-white text-[10px] tracking-[0.28em] uppercase animate-service-fade"
                style={{ textShadow: "0 0 12px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.5)" }}
              >
                {HERO_SERVICES[index]}
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-4xl leading-tight tracking-tight text-center">
            <span key={`prefix-${cycleKey}`} className="block text-muted animate-hero-word-reveal">
              {current.prefix}
            </span>
            {current.final ? (
              <span key={`word-${cycleKey}`} className="block animate-hero-word-reveal">
                <span className="text-white">Quem Você </span>
                <span
                  className="text-primary font-semibold drop-shadow-[0_0_28px_rgba(200,164,93,0.7)]"
                  style={{ textShadow: "0 0 40px rgba(200,164,93,0.5), 0 0 80px rgba(200,164,93,0.25)" }}
                >
                  É
                </span>
              </span>
            ) : (
              <span key={`word-${cycleKey}`} className="block text-white animate-hero-word-reveal">
                {current.text}
              </span>
            )}
          </h1>

          {/* CTA */}
          <a
            href={waLinkSpecialist("Olá! Gostaria de fazer minha avaliação.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors w-full max-w-xs min-h-[52px]"
          >
            Agendar Avaliação
          </a>
        </div>

        {/* Seta de scroll */}
        <button
          type="button"
          onClick={() => scrollToSection("#protese")}
          aria-label="Ir para a seção Prótese Capilar"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce text-muted hover:text-primary transition-colors cursor-pointer p-2"
        >
          <ArrowUp className="w-5 h-5 rotate-180" />
        </button>
      </div>

      {/* ── DESKTOP layout (side-by-side) ── */}
      <div className="hidden md:flex min-h-[100dvh] items-center pt-20 pb-10">
        <div className="container mx-auto px-20 max-w-7xl flex flex-row items-center gap-12">
          <div className="flex-1">
            {/* Logo + serviço colados */}
            <div className="flex flex-col items-center mb-14">
              <img
                src="/images/logo.png"
                alt="MS Hair Studio"
                className="w-60 h-auto object-contain mb-0"
              />
              <div className="h-5 flex items-center justify-center overflow-hidden -mt-3">
                <span
                  key={cycleKey}
                  className="text-white text-xs tracking-[0.28em] uppercase animate-service-fade"
                  style={{ textShadow: "0 0 12px rgba(255,255,255,0.9), 0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,255,255,0.2)" }}
                >
                  {HERO_SERVICES[index]}
                </span>
              </div>
            </div>

            {/* Headline dinâmico */}
            <h1 className="font-serif text-[64px] leading-tight tracking-tight text-left">
              <span key={`prefix-${cycleKey}`} className="block text-muted animate-hero-word-reveal">
                {current.prefix}
              </span>
              {current.final ? (
                <span key={`word-${cycleKey}`} className="block animate-hero-word-reveal">
                  <span className="text-white">Quem Você </span>
                  <span
                    className="text-primary font-semibold drop-shadow-[0_0_28px_rgba(200,164,93,0.7)]"
                    style={{ textShadow: "0 0 40px rgba(200,164,93,0.5), 0 0 80px rgba(200,164,93,0.25)" }}
                  >
                    É
                  </span>
                </span>
              ) : (
                <span key={`word-${cycleKey}`} className="block text-white animate-hero-word-reveal">
                  {current.text}
                </span>
              )}
            </h1>
          </div>

          {/* Foto lateral */}
          <div className="relative flex-1 w-full h-[600px] rounded-lg overflow-hidden">
            <HeroGallery currentImg={index} prevImg={prevIndex} />
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background via-background/60 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent z-20 pointer-events-none" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollToSection("#protese")}
          aria-label="Ir para a seção Prótese Capilar"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce text-muted hover:text-primary transition-colors cursor-pointer p-2"
        >
          <ArrowUp className="w-5 h-5 rotate-180" />
        </button>
      </div>
    </section>
  );
};

// --- PROSTHESIS GALLERY ---
const PROTESE_IMAGES = [
  { src: "/images/protese_antes_depois.jpg", position: "center top" },
  { src: "/images/protese_m1.jpg",           position: "center top" },
  { src: "/images/protese_h1.jpg",           position: "center top" },
  { src: "/images/protese_m2.jpg",           position: "center top" },
  { src: "/images/protese_h2.jpg",           position: "center top" },
  { src: "/images/protese_h3.jpg",           position: "center top" },
];

const ProteseGallery = () => {
  const total = PROTESE_IMAGES.length;
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const safeIndex = total > 0 ? current % total : 0;
  const safePrev  = prev !== null && prev < total ? prev : null;

  const goTo = (index: number) => {
    setPrev(safeIndex);
    setCurrent(((index % total) + total) % total);
  };

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % total;
        setPrev(c % total);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  return (
    <div className="absolute inset-0 group">
      {safePrev !== null && (
        <img
          key={`protese-ghost-${safePrev}`}
          src={PROTESE_IMAGES[safePrev].src}
          alt=""
          className="absolute inset-0 w-full h-full object-contain opacity-0"
        />
      )}
      <img
        key={`protese-current-${safeIndex}`}
        src={PROTESE_IMAGES[safeIndex].src}
        alt="Resultado prótese capilar MS Hair Studio"
        className="absolute inset-0 w-full h-full object-contain animate-hero-fade-in"
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(safeIndex - 1)}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(safeIndex + 1)}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {PROTESE_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-500",
                  i === safeIndex
                    ? "w-4 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- PROSTHESIS SECTION ---
const Prosthesis = () => {
  return (
    <section id="protese" className="py-24 md:py-32 bg-[#09090b]">
      <div className="container mx-auto px-5 md:px-20 max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 order-1 md:order-2">
          <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">Prótese Capilar</h2>
          <p className="text-muted text-lg md:text-xl leading-relaxed">
            Uma solução pensada para quem deseja voltar a se olhar no espelho com naturalidade, confiança e tranquilidade.
          </p>
          <p className="text-muted leading-relaxed">
            Com técnica refinada e acabamento imperceptível, devolvemos não apenas o seu cabelo, mas a liberdade de se sentir bem em qualquer ambiente. Um processo discreto, humano e feito sob medida para a sua história.
          </p>
          <div className="pt-4 hidden md:block">
            <a 
              href={waLinkSpecialist("Olá! Gostaria de fazer minha avaliação.")}
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors"
            >
              Agendar Avaliação
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border order-2 md:order-1">
          <ProteseGallery />
        </div>

        <div className="order-3 md:hidden pt-6">
          <a 
            href={waLinkSpecialist("Olá! Gostaria de fazer minha avaliação.")}
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center justify-center w-full px-8 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors min-h-[44px]"
          >
            Agendar Avaliação
          </a>
        </div>
      </div>
    </section>
  );
};

// --- SERVICES SECTION ---
const SERVICE_CARDS = [
  {
    title: "Barbearia",
    image: {
      src: "/images/studio.png",
      alt: "Atmosfera da barbearia MS Hair Studio",
    },
    items: [
      { label: "Corte", desc: "Alinhamento perfeito e técnica refinada para o homem moderno.", link: null },
      { label: "Barba", desc: "Cuidado completo com toalha quente, hidratação e óleos essenciais.", link: null },
    ],
  },
  {
    title: "Salão de Beleza",
    image: {
      src: "/images/hero_6.png",
      alt: "Ambiente do salão de beleza com acabamento sofisticado",
    },
    items: [
      { label: "Escova", desc: "Finalização perfeita para eventos e dia a dia.", link: null },
      { label: "Hidratação", desc: "Reconstrução profunda para fios com vida e brilho intenso.", link: null },
      { label: "Progressiva", desc: "Alinhamento duradouro com produtos de alta performance.", link: null },
      { label: "Manicure", desc: "Cuidado completo para mãos e unhas impecáveis.", link: null },
      { label: "…e outros serviços", desc: "", link: waLink("Olá! Gostaria de saber quais serviços o salão de beleza oferece.") },
    ],
  },
];

// --- SERVICE CARD WITH HOVER PHOTO ---
const CARD_PHOTO_MAP: Record<string, { src: string; position: "left" | "right" }> = {
  Barbearia: { src: "/images/marcos.png", position: "left" },
  "Salão de Beleza": { src: "/images/silvia.png", position: "right" },
};

const ServiceCard = ({ card }: { card: typeof SERVICE_CARDS[number] }) => {
  const [hovered, setHovered] = useState(false);
  const photo = CARD_PHOTO_MAP[card.title];

  return (
    <div
      className="relative overflow-visible h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {photo && (
        <div
          className={cn("hidden md:flex absolute inset-y-0 items-center z-10 pointer-events-none")}
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(100%)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            ...(photo.position === "left"
              ? { right: "calc(100% + 1.5rem)" }
              : { left: "calc(100% + 1.5rem)" }),
          }}
        >
          <img src={photo.src} alt="" className="h-full w-auto object-contain max-w-[320px]" />
        </div>
      )}
      <div
        role="button"
        tabIndex={0}
        onClick={() => scrollToSection("#atendimento")}
        onKeyDown={(e) => e.key === "Enter" && scrollToSection("#atendimento")}
        className={cn(
          "p-8 md:p-10 border border-border rounded-lg bg-card transition-all duration-300 flex flex-col cursor-pointer h-full",
          hovered ? "border-primary -translate-y-1" : ""
        )}
      >
        <h3 className={cn(
          "text-2xl font-serif mb-6 transition-colors duration-300",
          hovered ? "text-primary" : "text-white"
        )}>
          {card.title}
        </h3>
        <ul className="flex flex-col flex-1 divide-y divide-border/50">
          {card.items.map((item) => (
            <li key={item.label} className="flex-1 flex flex-col justify-center py-4 first:pt-0 last:pb-0">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-primary text-sm font-medium hover:text-primary/80 transition-colors duration-300 inline-flex items-center gap-1.5"
                >
                  {item.label}
                  <span className="text-xs">↗</span>
                </a>
              ) : (
                <span className="text-white text-sm font-medium">{item.label}</span>
              )}
              {item.desc && (
                <p className="text-muted text-xs leading-relaxed mt-1">{item.desc}</p>
              )}
            </li>
          ))}
        </ul>
        <p className={cn(
          "text-xs mt-6 flex items-center gap-1 transition-colors duration-300",
          hovered ? "text-primary/80" : "text-primary/50"
        )}>
          Iniciar atendimento <span className="text-[10px]">→</span>
        </p>
      </div>
    </div>
  );
};

const Services = () => {
  return (
    <section id="servicos" className="py-24 bg-background">
      <div className="container mx-auto px-5 md:px-20 max-w-7xl space-y-16">
        <div className="text-center space-y-4">
          <h2 className="font-serif text-3xl md:text-[40px] text-white">Nossos Serviços</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
          <p className="text-muted text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            A confiança que você conhece, com um novo conceito de atendimento.
          </p>
          <p className="text-primary/60 text-xs tracking-[0.2em] uppercase font-medium">
            Há mais de 25 anos no mercado.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {SERVICE_CARDS.map((card) => (
            <ServiceCard key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

// --- COURSES SECTION ---
const COURSE_IMAGES = [
  { src: "/images/academy/academy_1.jpg", alt: "Formação prática na MS Academy" },
  { src: "/images/academy/academy_2.jpg", alt: "Salão durante as aulas da MS Academy" },
  { src: "/images/academy/academy_3.jpg", alt: "Núcleo de formação da MS Academy" },
  { src: "/images/academy/academy_4.jpg", alt: "Demonstração de técnicas na MS Academy" },
  { src: "/images/academy/academy_5.jpg", alt: "Aula hands-on de prótese capilar" },
  { src: "/images/academy/academy_6.jpg", alt: "Prática com clientes na MS Academy" },
];

const CoursesGallery = () => {
  const total = COURSE_IMAGES.length;
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const safeIndex = total > 0 ? current % total : 0;
  const safePrev  = prev !== null && prev < total ? prev : null;

  const goTo = (index: number) => {
    setPrev(safeIndex);
    setCurrent(((index % total) + total) % total);
  };

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % total;
        setPrev(c % total);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  return (
    <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-lg overflow-hidden border border-border group">
      {safePrev !== null && (
        <img
          key={`academy-ghost-${safePrev}`}
          src={COURSE_IMAGES[safePrev].src}
          alt={COURSE_IMAGES[safePrev].alt}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
        />
      )}
      <img
        key={`academy-current-${safeIndex}`}
        src={COURSE_IMAGES[safeIndex].src}
        alt={COURSE_IMAGES[safeIndex].alt}
        className="absolute inset-0 w-full h-full object-cover animate-hero-fade-in"
      />

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(safeIndex - 1)}
            aria-label="Foto anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(safeIndex + 1)}
            aria-label="Próxima foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-black/60"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {COURSE_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ver foto ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-500",
                  i === safeIndex
                    ? "w-4 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Courses = () => {
  return (
    <section id="academy" className="py-24 bg-[#09090b]">
      <div className="container mx-auto px-5 md:px-20 max-w-7xl space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-4 text-center lg:text-left lg:pt-10">
            <h2 className="font-serif text-3xl md:text-[40px] text-white">MS Academy</h2>
            <p className="text-muted max-w-md mx-auto lg:mx-0">Formando profissionais de excelência no mercado da beleza e prótese capilar.</p>
          </div>

          <div className="lg:mt-14 lg:justify-self-end lg:w-[85%] max-w-md">
            <CoursesGallery />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-8 md:p-16 flex flex-col items-center text-center gap-6">
          <h3 className="text-2xl md:text-3xl text-white font-medium">Curso de Prótese Capilar</h3>
          <p className="text-muted text-base md:text-lg max-w-2xl">Aprenda as técnicas mais avançadas do mercado.</p>
          <a
            href={waLinkSpecialist("Olá, Gostaria de saber mais sobre o Curso de Prótese Capilar")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors mt-2"
          >
            Saiba mais
          </a>
        </div>
      </div>
    </section>
  );
};

// --- ATENDIMENTO SECTION ---
type Servico = "protese" | "barbearia" | "salao" | "academy";

const ATEND_STEPS = ["Serviço", "Objetivo", "Dados", "Finalizar"];

const SERVICO_CARDS: { id: Servico; label: string; image: { src: string; alt: string } }[] = [
  { id: "protese", label: "Prótese Capilar", image: { src: "/images/protese_antes_depois.jpg", alt: "Resultado de prótese capilar natural" } },
  { id: "barbearia", label: "Barbearia", image: { src: "/images/studio.png", alt: "Ambiente da barbearia" } },
  { id: "salao", label: "Salão de Beleza", image: { src: "/images/hero_5.png", alt: "Estilo e cuidado do salão de beleza" } },
  { id: "academy", label: "MS Academy", image: { src: "/images/hero_8.png", alt: "Espaço de formação da MS Academy" } },
];

const STEP2_QUESTIONS: Record<Servico, string> = {
  protese: "O que melhor descreve o seu caso?",
  academy: "Qual é o seu objetivo?",
  barbearia: "O que você procura hoje?",
  salao: "Qual serviço você procura?",
};

const STEP2_OPTIONS: Record<Servico, string[]> = {
  protese: [
    "Tenho entradas e gostaria de saber qual a melhor solução.",
    "Estou com queda de cabelo e quero conhecer as opções.",
    "Quero recuperar minha autoestima.",
    "Quero agendar uma avaliação.",
    "Quero saber valores.",
    "Já utilizo prótese capilar e procuro um novo especialista.",
    "Outro...",
  ],
  academy: [
    "Quero aprender prótese capilar para trabalhar na área.",
    "Já atuo na área e quero me especializar.",
    "Quero conhecer os cursos disponíveis.",
    "Tenho interesse na mentoria.",
    "Quero saber valores.",
    "Outro...",
  ],
  barbearia: ["Corte", "Barba", "Corte + Barba", "Plano Mensal", "Outro..."],
  salao: ["Corte Feminino", "Escova", "Hidratação", "Progressiva", "Manicure", "Pedicure", "Outro..."],
};

const STEP2_OTHER_PLACEHOLDER: Record<Servico, string> = {
  protese: "Conte rapidamente como podemos ajudar.",
  academy: "Conte rapidamente o seu objetivo.",
  barbearia: "Qual serviço você procura?",
  salao: "Qual serviço você procura?",
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  return value;
};

const Atendimento = () => {
  const [step, setStep] = useState(0);
  const [servico, setServico] = useState<Servico | null>(null);
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [outroText, setOutroText] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [sending, setSending] = useState(false);
  const [slideDir, setSlideDir] = useState<"forward" | "back">("forward");
  const [animKey, setAnimKey] = useState(0);

  const advance = () => {
    setSlideDir("forward");
    setAnimKey((k) => k + 1);
    setStep((s) => s + 1);
  };

  const retreat = () => {
    setSlideDir("back");
    setAnimKey((k) => k + 1);
    setStep((s) => s - 1);
  };

  const selectServico = (s: Servico) => {
    setServico(s);
    setObjetivo(null);
    setOutroText("");
    setSlideDir("forward");
    setAnimKey((k) => k + 1);
    setStep(1);
  };

  const selectObjetivo = (o: string) => {
    setObjetivo(o);
    if (o !== "Outro...") {
      setSlideDir("forward");
      setAnimKey((k) => k + 1);
      setStep(2);
    }
  };

  const buildMessage = () => {
    const servicoLabel = SERVICO_CARDS.find((c) => c.id === servico)?.label ?? "";
    const objetivoFinal = objetivo === "Outro..." ? outroText : objetivo;
    return `Olá! Meu nome é ${nome}.\n\nTelefone: ${telefone}\nServiço: ${servicoLabel}\nInteresse: ${objetivoFinal}\n\nGostaria de ser atendido(a).`;
  };

  const getDestWaLink = () => {
    const num = servico === "protese" || servico === "academy" ? WA_SPECIALIST : WA_NUMBER;
    return `https://wa.me/${num}?text=${encodeURIComponent(buildMessage())}`;
  };

  const handleSubmit = () => {
    setSending(true);
    setTimeout(() => {
      window.open(getDestWaLink(), "_blank");
      setSending(false);
      setStep(0);
      setServico(null);
      setObjetivo(null);
      setOutroText("");
      setNome("");
      setTelefone("");
    }, 1200);
  };

  const slideClass = slideDir === "forward" ? "animate-slide-in-forward" : "animate-slide-in-back";

  return (
    <section id="atendimento" className="py-24 md:py-32 bg-[#09090b]">
      <div className="container mx-auto px-5 md:px-20 max-w-3xl">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-serif text-3xl md:text-[40px] text-white">Atendimento</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
          <p className="text-muted text-lg">Encontre o atendimento ideal para você.</p>
          <p className="text-muted/60 text-sm">Leva menos de 1 minuto e nossa equipe direcionará você ao atendimento mais adequado.</p>
        </div>

        {/* Progress — Desktop */}
        <div className="hidden md:flex items-center justify-center mb-12">
          {ATEND_STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500",
                    i <= step ? "bg-primary text-primary-foreground" : "bg-border/40 text-muted/50"
                  )}
                >
                  {i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs transition-colors duration-500 whitespace-nowrap",
                    i === step ? "text-primary font-medium" : i < step ? "text-muted" : "text-muted/30"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < ATEND_STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px w-20 mx-3 mb-6 transition-all duration-500",
                    i < step ? "bg-primary" : "bg-border/40"
                  )}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Progress — Mobile */}
        <div className="flex md:hidden items-center justify-center gap-3 mb-8">
          <div className="flex gap-1.5">
            {ATEND_STEPS.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-primary/40" : "w-3 bg-border/40"
                )}
              />
            ))}
          </div>
          <span className="text-muted text-sm">Etapa {step + 1} de 4</span>
        </div>

        {/* Card */}
        <div className="bg-background border border-border rounded-xl p-6 md:p-10 min-h-[360px] flex flex-col overflow-hidden">

          {/* Step 1 — Serviço */}
          {step === 0 && (
            <div key={`s0-${animKey}`} className={cn("flex-1 flex flex-col gap-6", slideClass)}>
              <h3 className="text-white text-xl md:text-2xl font-serif text-center">Qual atendimento você procura?</h3>
              <div className="grid grid-cols-2 gap-3 flex-1">
                {SERVICO_CARDS.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => selectServico(card.id)}
                    className="flex items-center justify-center p-3 md:p-4 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 cursor-pointer text-center min-h-[60px]"
                  >
                    <span className="text-white text-sm font-medium hover:text-primary transition-colors leading-snug">
                      {card.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Objetivo */}
          {step === 1 && servico && (
            <div key={`s1-${animKey}`} className={cn("flex-1 flex flex-col gap-4", slideClass)}>
              <h3 className="text-white text-xl md:text-2xl font-serif text-center">{STEP2_QUESTIONS[servico]}</h3>
              <div className="flex flex-col gap-2 flex-1">
                {STEP2_OPTIONS[servico].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => selectObjetivo(opt)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 text-sm",
                      objetivo === opt
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted hover:border-primary/50 hover:text-white"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {objetivo === "Outro..." && (
                <>
                  <textarea
                    rows={3}
                    value={outroText}
                    onChange={(e) => setOutroText(e.target.value)}
                    placeholder={STEP2_OTHER_PLACEHOLDER[servico]}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-card text-white text-sm placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <button
                    type="button"
                    onClick={advance}
                    disabled={!outroText.trim()}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    Continuar
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 3 — Nome */}
          {step === 2 && (
            <div key={`s2-${animKey}`} className={cn("flex-1 flex flex-col gap-6 justify-center", slideClass)}>
              <h3 className="text-white text-xl md:text-2xl font-serif text-center">Como podemos chamar você?</h3>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                onKeyDown={(e) => e.key === "Enter" && nome.trim() && advance()}
                className="w-full px-4 py-4 rounded-lg border border-border bg-card text-white text-base placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={advance}
                disabled={!nome.trim()}
                className="w-full px-6 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-40 min-h-[52px]"
              >
                Continuar
              </button>
            </div>
          )}

          {/* Step 4 — WhatsApp */}
          {step === 3 && (
            <div key={`s3-${animKey}`} className={cn("flex-1 flex flex-col gap-6 justify-center", slideClass)}>
              <h3 className="text-white text-xl md:text-2xl font-serif text-center">Qual é o seu WhatsApp?</h3>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-4 rounded-lg border border-border bg-card text-white text-base placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
              />
              {sending ? (
                <div className="w-full px-6 py-4 bg-primary/15 border border-primary/40 text-primary font-medium rounded text-center flex items-center justify-center gap-2 min-h-[52px]">
                  ✔️ Perfeito! Estamos preparando seu atendimento...
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={telefone.replace(/\D/g, "").length < 10}
                  className="w-full px-6 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-40 min-h-[52px]"
                >
                  Quero ser atendido
                </button>
              )}
            </div>
          )}

          {/* Back button */}
          {step > 0 && !sending && (
            <button
              type="button"
              onClick={retreat}
              className="mt-6 self-start text-muted hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

// --- RESULTS SECTION ---
const GOOGLE_REVIEWS = [
  {
    name: "Rodrigo Almeida",
    initials: "RA",
    stars: 5,
    date: "há 2 semanas",
    text: "Atendimento impecável e resultado surpreendente. A equipe é extremamente profissional e discreta. Voltei a me olhar no espelho com confiança.",
  },
  {
    name: "Carlos Mendes",
    initials: "CM",
    stars: 5,
    date: "há 1 mês",
    text: "A MS Hair Studio devolveu não apenas o meu cabelo, mas a minha autoestima. O acabamento é completamente natural — ninguém percebeu nada.",
  },
  {
    name: "Fernando S.",
    initials: "FS",
    stars: 5,
    date: "há 2 meses",
    text: "Profissionais excepcionais. O ambiente é acolhedor e o resultado superou todas as minhas expectativas. Recomendo sem hesitar.",
  },
  {
    name: "Marcelo Souza",
    initials: "MS",
    stars: 5,
    date: "há 2 meses",
    text: "Fiz a prótese capilar depois de anos evitando o assunto. Hoje me arrependo de não ter feito antes. Trabalho impecável e atendimento humano de verdade.",
  },
  {
    name: "Bruno Ferreira",
    initials: "BF",
    stars: 5,
    date: "há 3 meses",
    text: "Equipe muito atenciosa, explicaram todo o processo antes de começar. O resultado ficou tão natural que parece que sempre foi meu cabelo.",
  },
  {
    name: "Thiago Ribeiro",
    initials: "TR",
    stars: 5,
    date: "há 3 meses",
    text: "Já recomendei para vários amigos. Atendimento pontual, ambiente limpo e discreto, e o resultado fala por si só.",
  },
  {
    name: "Eduardo Lima",
    initials: "EL",
    stars: 5,
    date: "há 4 meses",
    text: "Melhor decisão que tomei nos últimos anos. A equipe da MS Hair Studio é extremamente cuidadosa e o resultado é surreal de natural.",
  },
  {
    name: "André Castro",
    initials: "AC",
    stars: 5,
    date: "há 5 meses",
    text: "Voltei a usar boné só por escolha, não por necessidade. Atendimento nota 10 do início ao fim.",
  },
];

const GoogleStars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <svg key={s} className={`w-4 h-4 ${s <= count ? "text-[#FBBC04]" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </div>
);

const GoogleGIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const Results = () => {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const goTo = (index: number) => {
    setCurrent(index);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % GOOGLE_REVIEWS.length;
        return next;
      });
      setAnimKey(k => k + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const review = GOOGLE_REVIEWS[current];

  return (
    <section id="resultados" className="py-24 bg-background">
      <div className="container mx-auto px-5 md:px-20 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl md:text-[40px] text-white">Avaliações</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
        </div>

        {/* Google branding */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <GoogleGIcon />
          <span className="text-white font-medium tracking-wide">Google</span>
          <div className="h-4 w-px bg-border mx-1" />
          <span className="text-white font-semibold">5,0</span>
          <GoogleStars count={5} />
        </div>

        <div className="max-w-2xl mx-auto">
          <div
            key={animKey}
            className="animate-hero-fade-in bg-card border border-border rounded-2xl p-8 md:p-12 text-center"
            style={{ minHeight: "280px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5rem" }}
          >
            <div className="flex justify-center">
              <GoogleStars count={review.stars} />
            </div>
            <p className="text-white text-lg md:text-xl font-serif italic leading-relaxed">
              "{review.text}"
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                <span className="text-primary text-xs font-semibold">{review.initials}</span>
              </div>
              <div className="text-left">
                <div className="text-white text-sm font-medium">{review.name}</div>
                <div className="text-muted text-xs mt-0.5">{review.date}</div>
              </div>
            </div>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {GOOGLE_REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted"
                )}
                aria-label={`Avaliação ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- ABOUT SECTION ---
const About = () => {
  return (
    <section id="sobre" className="py-24 bg-[#09090b]">
      <div className="container mx-auto px-5 md:px-20 max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden border border-border">
          <img src="/images/sobre_lider.jpg" alt="Marcos - Fundador MS Hair Studio" className="w-full h-full object-cover" style={{ objectPosition: "40% 15%" }} />
        </div>
        
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-primary text-sm uppercase tracking-[0.2em] font-medium">Sobre</span>
            <h2 className="font-serif text-3xl md:text-[40px] text-white">A Arte de Transformar</h2>
          </div>
          <p className="text-muted leading-relaxed">
            A MS Hair Studio nasceu da crença de que cuidar da imagem é cuidar da alma. Nossa missão é proporcionar um ambiente de luxo discreto, onde cada cliente recebe um atendimento único e personalizado, focado em devolver a sua melhor versão.
          </p>
          
          <ul className="space-y-4">
            {["Atendimento Personalizado", "Serviço Premium Discreto", "Resultados Naturais"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
          
          <div className="pt-8 border-t border-border mt-8">
            <p className="font-serif text-xl text-primary italic mb-2">"A verdadeira beleza está na confiança de ser quem você é."</p>
            <p className="text-muted text-sm uppercase tracking-widest">Marcos Macedo</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- CONTACT SECTION ---
const SERVICOS_INTERESSE = [
  "Prótese Capilar",
  "Barbearia",
  "Salão de Beleza",
  "MS Academy",
  "Outro",
];

type ContactStatus = "idle" | "sending" | "success" | "error";

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    email: "",
    servico: "",
    mensagem: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, telefone: formatPhone(e.target.value) }));
  };

  const isValid =
    form.nome.trim().length >= 2 &&
    form.email.includes("@") &&
    form.mensagem.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "sending") return;

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      // Fallback: open WhatsApp with form data if EmailJS not configured
      const msg = `Olá! Meu nome é ${form.nome}.\n\nTelefone: ${form.telefone || "não informado"}\nE-mail: ${form.email}\nServiço de interesse: ${form.servico || "não informado"}\n\nMensagem: ${form.mensagem}`;
      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
      setStatus("success");
      setForm({ nome: "", telefone: "", email: "", servico: "", mensagem: "" });
      setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.nome,
          from_phone: form.telefone || "não informado",
          from_email: form.email,
          servico: form.servico || "não informado",
          message: form.mensagem,
        },
        publicKey
      );
      setStatus("success");
      setForm({ nome: "", telefone: "", email: "", servico: "", mensagem: "" });
      setTimeout(() => setStatus("idle"), 6000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-border bg-card text-white text-sm placeholder:text-muted focus:outline-none focus:border-primary transition-colors";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-muted text-xs mb-1.5 uppercase tracking-wide">Nome *</label>
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Seu nome"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-muted text-xs mb-1.5 uppercase tracking-wide">Telefone / WhatsApp</label>
          <input
            type="tel"
            name="telefone"
            value={form.telefone}
            onChange={handlePhoneChange}
            placeholder="(11) 99999-9999"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-muted text-xs mb-1.5 uppercase tracking-wide">E-mail *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-muted text-xs mb-1.5 uppercase tracking-wide">Serviço de interesse</label>
          <select
            name="servico"
            value={form.servico}
            onChange={handleChange}
            className={cn(inputClass, "appearance-none cursor-pointer", form.servico === "" ? "text-muted" : "text-white")}
          >
            <option value="" disabled>Selecione um serviço</option>
            {SERVICOS_INTERESSE.map((s) => (
              <option key={s} value={s} className="bg-card text-white">{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-muted text-xs mb-1.5 uppercase tracking-wide">Mensagem *</label>
        <textarea
          name="mensagem"
          value={form.mensagem}
          onChange={handleChange}
          rows={4}
          placeholder="Como podemos ajudar você?"
          required
          className={cn(inputClass, "resize-none")}
        />
      </div>

      {status === "success" && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border border-primary/30 text-primary">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Mensagem enviada com sucesso! Entraremos em contato em breve.</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Erro ao enviar. Por favor, tente novamente ou entre em contato pelo WhatsApp.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!isValid || status === "sending"}
        className="w-full px-6 py-4 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors disabled:opacity-40 flex items-center justify-center gap-2 min-h-[52px]"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Mensagem"
        )}
      </button>

      <p className="text-muted/50 text-xs text-center">* Campos obrigatórios</p>
    </form>
  );
};

const Contact = () => {
  return (
    <section id="contato" className="py-24 bg-background">
      <div className="container mx-auto px-5 md:px-20 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="font-serif text-3xl md:text-[40px] text-white">Vamos Conversar</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
          <p className="text-muted">Agende sua avaliação ou entre em contato para tirar dúvidas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — info + map */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">Endereço</h4>
                  <p className="text-muted text-sm">Av. Luca, 54 – Chácara Mafalda<br/>São Paulo – SP, 03370-010</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium mb-1">WhatsApp</h4>
                  <a
                    href="https://wa.me/5511947719311"
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted text-sm hover:text-primary transition-colors"
                  >
                    +55 (11) 94771-9311
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full h-[260px] md:h-[320px] rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.8931129313237!2d-46.563880324763744!3d-23.572282061993295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5c31a53a764f%3A0xc1e8166bd223fd1c!2sAv.%20Luca%2C%2054%20-%20Ch%C3%A1cara%20Mafalda%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2003370-010!5e0!3m2!1spt-PT!2sbr!4v1783298244299!5m2!1spt-PT!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Localização MS Hair Studio"
              />
            </div>
          </div>

          {/* Right — form */}
          <div className="bg-card border border-border rounded-xl p-6 md:p-10 order-1 lg:order-2">
            <h3 className="font-serif text-2xl text-white mb-6">Envie uma mensagem</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- FOOTER ---
const Footer = () => {
  return (
    <footer className="bg-[#070709] border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-5 md:px-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <img src="/images/logo.png" alt="MS Hair Studio" className="h-14 w-auto object-contain mb-4" />
            <p className="text-muted text-sm max-w-xs">
              Transformando autoestima através da beleza, do cuidado e da confiança.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Links</h4>
            <ul className="space-y-2">
              {["Serviços", "Prótese Capilar", "MS Academy", "Contato"].map(link => (
                <li key={link}>
                  <a href="#" className="text-muted hover:text-primary text-sm transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">Social</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ms_studio_54/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} MS Hair Studio. Todos os direitos reservados.</p>
          <p>Design Premium</p>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [showWA, setShowWA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowWA(window.scrollY > 300);
      setShowTopBtn(window.scrollY > 1000);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Header />
      <Hero />
      <Prosthesis />
      <Services />
      <Courses />
      <Atendimento />
      <Results />
      <About />
      <Contact />
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-center">
        {showWA && (
          <a
            href={waLink("Olá! Vim do site e gostaria de ter mais informações sobre seus serviços.")}
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
          >
            <Phone className="w-6 h-6" />
          </a>
        )}
        
        {showTopBtn && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 bg-card border border-primary text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/10 transition-colors"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
