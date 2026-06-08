// QuienesSomos.jsx
// Página "¿Quiénes somos?" para Campus Emprende
// Integra: descripción de la app + cards de los tres desarrolladores
// Uso: <QuienesSomos /> — no requiere props
// Dependencias: solo React (sin librerías externas)

import { useState, useEffect, useRef } from "react";

/* ─── Datos ──────────────────────────────────────────── */
const DEVELOPERS = [
  {
    name: "Elías Bombom Mi Corazon ❤️🤣",
    role: "Desarrollador Fullstack",
    tag: "Fullstack",
    avatar: "EDM",
    color: "#2E1A6E",
    accent: "#7B68D4",
    description:
      "Integra frontend y backend para construir flujos completos y funcionales. " +
      "Participó en el diseño de la arquitectura por capas, la implementación de los " +
      "módulos de servicios, solicitudes y reseñas, y la configuración del entorno " +
      "de pruebas y CI/CD con GitHub Actions.",
    skills: ["React", "Spring Boot", "GitHub Actions", "Testing", "CI/CD"],
  },
  {
    name: "Alcindo Chavarría Vera",
    role: "Arquitecto de Backend",
    tag: "Backend",
    avatar: "ACV",
    color: "#1A2D5A",
    accent: "#4A3F9F",
    description:
      "Responsable del diseño e implementación del servidor con Spring Boot y Java 21. " +
      "Lideró la arquitectura de seguridad con JWT, la gestión de base de datos PostgreSQL " +
      "y la documentación de la API con Swagger/OpenAPI. Su trabajo garantiza la solidez " +
      "técnica y la trazabilidad del sistema.",
    skills: ["Java 21", "Spring Boot", "PostgreSQL", "JWT", "REST API"],
  },
  {
    name: "Diego Sepúlveda Pérez",
    role: "Desarrollador Frontend",
    tag: "Frontend",
    avatar: "DSP",
    color: "#12355B",
    accent: "#3A8FC9",
    description:
      "Encargado de la interfaz de usuario, la experiencia de navegación y el diseño " +
      "visual de la plataforma. Desarrolló los componentes React con Vite, implementó " +
      "rutas protegidas con Redux Toolkit y veló por la accesibilidad, coherencia " +
      "visual y calidad del producto desde el lado del cliente.",
    skills: ["React 19", "Vite", "Redux Toolkit", "Axios", "UX/UI"],
  },
];

const FEATURES = [
  {
    icon: "🎓",
    title: "Marketplace estudiantil",
    desc: "Publica y encuentra servicios técnicos, creativos o profesionales ofrecidos por estudiantes dentro del ecosistema universitario.",
  },
  {
    icon: "🔐",
    title: "Acceso seguro",
    desc: "Registro con verificación de correo, autenticación JWT y rutas protegidas que garantizan la seguridad de tu cuenta.",
  },
  {
    icon: "⭐",
    title: "Reseñas y trazabilidad",
    desc: "Valora los servicios recibidos y construye tu reputación académica con evidencia real de tu experiencia profesional.",
  },
  {
    icon: "🛡️",
    title: "Moderación institucional",
    desc: "Panel de administración para supervisar publicaciones, gestionar reportes y mantener un entorno académico confiable.",
  },
  {
    icon: "📊",
    title: "Perfil profesional",
    desc: "Tu historial de servicios se convierte en evidencia documentada de tus habilidades, visible dentro del entorno académico.",
  },
  {
    icon: "🔔",
    title: "Gestión de solicitudes",
    desc: "Envía y recibe solicitudes de servicios, coordina entregas y mantén un registro ordenado de tus interacciones.",
  },
];

/* ─── Hook de animación al entrar en viewport ────────── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

/* ─── Componentes menores ────────────────────────────── */
function Badge({ text, accent }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.05em",
      background: accent + "22",
      color: accent,
      border: `1px solid ${accent}44`,
      fontFamily: "inherit",
    }}>{text}</span>
  );
}

function SkillPill({ text, accent }) {
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "6px",
      fontSize: "11px",
      fontWeight: 500,
      background: "#F0EFF8",
      color: "#4A3F9F",
      marginRight: 5,
      marginBottom: 5,
      fontFamily: "inherit",
    }}>{text}</span>
  );
}

function Avatar({ initials, color, accent, size = 72 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: `linear-gradient(135deg, ${color} 0%, ${accent} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: `0 4px 20px ${accent}44`,
      fontSize: size * 0.28,
      fontWeight: 700,
      color: "white",
      fontFamily: "'Georgia', serif",
      letterSpacing: "0.02em",
    }}>{initials}</div>
  );
}

/* ─── Card de desarrollador ──────────────────────────── */
function DevCard({ dev, delay = 0 }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "white",
        borderRadius: 20,
        padding: "32px 28px",
        boxShadow: hovered
          ? `0 20px 60px ${dev.accent}28, 0 2px 8px rgba(0,0,0,0.06)`
          : "0 4px 24px rgba(0,0,0,0.07)",
        border: `1.5px solid ${hovered ? dev.accent + "44" : "#EEF0F8"}`,
        transition: "all 0.35s cubic-bezier(.22,.68,0,1.2)",
        transform: visible
          ? hovered ? "translateY(-6px)" : "translateY(0)"
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${delay}ms` : "0ms",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorador de fondo */}
      <div style={{
        position: "absolute", top: -30, right: -30,
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${dev.accent}12, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        <Avatar initials={dev.avatar} color={dev.color} accent={dev.accent} size={68} />
        <div>
          <Badge text={dev.tag} accent={dev.accent} />
          <div style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 17, fontWeight: 700,
            color: dev.color, marginTop: 6, lineHeight: 1.2,
          }}>{dev.name}</div>
          <div style={{
            fontSize: 13, color: "#888", fontStyle: "italic",
            marginTop: 3, fontFamily: "inherit",
          }}>{dev.role}</div>
        </div>
      </div>

      {/* Separador */}
      <div style={{
        height: 1, background: `linear-gradient(to right, ${dev.accent}33, transparent)`,
        marginBottom: 16,
      }} />

      {/* Descripción */}
      <p style={{
        fontSize: 13.5, lineHeight: 1.7, color: "#555",
        margin: "0 0 18px 0", fontFamily: "inherit",
      }}>{dev.description}</p>

      {/* Skills */}
      <div>
        {dev.skills.map(s => <SkillPill key={s} text={s} accent={dev.accent} />)}
      </div>
    </div>
  );
}

/* ─── Card de característica ─────────────────────────── */
function FeatureCard({ icon, title, desc, delay = 0 }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "white" : "#FAFAFE",
        borderRadius: 16,
        padding: "24px 22px",
        border: `1.5px solid ${hovered ? "#7B68D4" : "#ECEAF8"}`,
        transition: "all 0.3s ease",
        transform: visible ? "translateY(0)" : "translateY(20px)",
        opacity: visible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        boxShadow: hovered ? "0 8px 32px rgba(74,63,159,0.12)" : "none",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{
        fontFamily: "'Georgia', serif", fontSize: 15, fontWeight: 700,
        color: "#1A2D5A", marginBottom: 8,
      }}>{title}</div>
      <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  );
}

/* ─── Componente principal ───────────────────────────── */
export default function QuienesSomos() {
  const [heroRef, heroVisible] = useInView(0.05);
  const [teamRef, teamVisible] = useInView(0.05);
  const [featRef, featVisible] = useInView(0.05);
  const isMobile = window.innerWidth < 768;

  const styles = {
    page: {
      fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
      color: "#333",
      background: "#F8F9FC",
      minHeight: "100vh",
    },

    /* ── Hero ── */
    hero: {
      background: "linear-gradient(135deg, #0F1F4A 0%, #1A2D5A 40%, #2E1A6E 100%)",
      padding: isMobile
        ? "60px 20px 70px"
        : "90px 24px 100px",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    heroGlow: {
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      width: 600, height: 300,
      background: "radial-gradient(ellipse, rgba(123,104,212,0.25) 0%, transparent 70%)",
      pointerEvents: "none",
    },
    heroTag: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(123,104,212,0.25)",
      border: "1px solid rgba(123,104,212,0.5)",
      borderRadius: 20, padding: "6px 16px",
      fontSize: 12, fontWeight: 600, color: "#BDB6F0",
      letterSpacing: "0.08em", textTransform: "uppercase",
      marginBottom: 28,
    },
    heroTitle: {
      fontFamily: "'Georgia', 'Times New Roman', serif",
      fontSize: "clamp(36px, 5vw, 58px)",
      fontWeight: 700,
      color: "white",
      lineHeight: 1.15,
      marginBottom: 20,
      position: "relative",
    },
    heroAccent: {
      background: "linear-gradient(90deg, #A78BFA, #60A5FA)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    heroSub: {
      fontSize: "clamp(15px, 2vw, 18px)",
      color: "rgba(255,255,255,0.7)",
      maxWidth: 640, margin: "0 auto 36px",
      lineHeight: 1.7,
    },
    heroStats: {
      display: "flex", justifyContent: "center", gap: 48,
      flexWrap: "wrap",
    },
    statItem: {
      textAlign: "center",
    },
    statNum: {
      fontFamily: "'Georgia', serif",
      fontSize: 32, fontWeight: 700, color: "white",
      display: "block",
    },
    statLabel: {
      fontSize: 12, color: "rgba(255,255,255,0.55)",
      letterSpacing: "0.06em", textTransform: "uppercase",
    },

    /* ── Sections ── */
    section: {
      maxWidth: 1100, margin: "0 auto", padding: "80px 24px",
    },
    sectionLabel: {
      display: "inline-block",
      fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
      textTransform: "uppercase", color: "#7B68D4",
      marginBottom: 12,
    },
    sectionTitle: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 700,
      color: "#1A2D5A", marginBottom: 14, lineHeight: 1.2,
    },
    sectionSub: {
      fontSize: 15.5, color: "#666", lineHeight: 1.7,
      maxWidth: 680, marginBottom: 56,
    },

    /* ── Misión ── */
    missionWrap: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? 24 : 40,
      alignItems: "center",
    },
    missionText: { fontSize: 15, color: "#555", lineHeight: 1.8 },
    missionHighlight: {
      background: "linear-gradient(135deg, #1A2D5A, #4A3F9F)",
      borderRadius: 20, padding: "36px 32px", color: "white",
    },
    missionQuote: {
      fontFamily: "'Georgia', serif",
      fontSize: 20, fontStyle: "italic", lineHeight: 1.6,
      borderLeft: "3px solid rgba(123,104,212,0.8)",
      paddingLeft: 20, marginBottom: 24,
    },

    /* ── Tech stack ── */
    stackBadge: {
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: 8, padding: "7px 14px",
      fontSize: 13, color: "rgba(255,255,255,0.85)",
      marginRight: 8, marginBottom: 8,
    },

    /* ── Cards grid ── */
    devGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(340px, 1fr))",
      gap: 24,
    },
    featGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(280px, 1fr))",
      gap: 20,
    },

    /* ── CTA ── */
    cta: {
      background: "linear-gradient(135deg, #1A2D5A 0%, #4A3F9F 100%)",
      borderRadius: 24, padding: "60px 40px",
      textAlign: "center",
      margin: "0 24px 80px",
      maxWidth: 1100 - 48,
      marginLeft: "auto", marginRight: "auto",
      position: "relative", overflow: "hidden",
    },
    ctaBtn: {
      display: "inline-block",
      background: "white",
      color: "#1A2D5A",
      padding: "14px 36px",
      borderRadius: 12, fontSize: 15, fontWeight: 700,
      textDecoration: "none", cursor: "pointer",
      border: "none",
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    divider: {
      height: 1,
      background: "linear-gradient(to right, transparent, #D0CCF0, transparent)",
      margin: "0 24px",
      maxWidth: 1100, marginLeft: "auto", marginRight: "auto",
    },
  };


  return (
    <div style={styles.page}>

      {/* ── HERO ── */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div ref={heroRef} style={{
          position: "relative",
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}>
          <div style={styles.heroTag}>
            <span>🎓</span> Marketplace estudiantil universitario
          </div>
          <h1 style={styles.heroTitle}>
            Conectamos talento,{" "}
            <span style={styles.heroAccent}>construimos futuro</span>
          </h1>
          <p style={styles.heroSub}>
            Campus Emprende es la plataforma que transforma el talento estudiantil en
            experiencia profesional real, dentro de un entorno académico seguro y trazable.
          </p>
          <div style={styles.heroStats}>
            {[
              ["React + Spring Boot", "Stack tecnológico"],
              ["JWT + PostgreSQL", "Seguridad y datos"],
              ["22+", "Pruebas automatizadas"],
              ["3", "Desarrolladores"],
            ].map(([num, label]) => (
              <div key={label} style={styles.statItem}>
                <span style={styles.statNum}>{num}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ ES CAMPUS EMPRENDE ── */}
      <div style={styles.section}>
        <div style={{
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
        }}>
          <span style={styles.sectionLabel}>¿Qué es Campus Emprende?</span>
          <h2 style={styles.sectionTitle}>Una plataforma construida por y para estudiantes</h2>
        </div>

        <div style={{ ...styles.missionWrap, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.missionText, marginBottom: 20 }}>
              En el entorno académico, estudiantes con capacidades técnicas, creativas o
              profesionales suelen ofrecer sus servicios por canales informales: grupos de
              WhatsApp, redes sociales o recomendaciones personales. Esto genera baja
              visibilidad, poca trazabilidad y ninguna evidencia profesional.
            </p>
            <p style={{ ...styles.missionText, marginBottom: 20 }}>
              <strong style={{ color: "#1A2D5A" }}>Campus Emprende</strong> cambia esa
              dinámica. Es un marketplace universitario donde los estudiantes pueden
              publicar sus servicios, recibir solicitudes, acumular reseñas verificadas y
              construir un perfil profesional dentro de un entorno controlado e institucional.
            </p>
            <p style={styles.missionText}>
              La plataforma actúa como puente entre quienes tienen talento y quienes lo
              necesitan, generando trazabilidad, confianza y evidencia de empleabilidad
              temprana para toda la comunidad académica.
            </p>
          </div>

          <div style={styles.missionHighlight}>
            <p style={styles.missionQuote}>
              "Transformamos actividades dispersas en canales informales en evidencia
              profesional trazable."
            </p>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
              Stack tecnológico de Campus Emprende:
            </div>
            <div>
              {["React 19", "Spring Boot 3", "PostgreSQL", "JWT Auth", "GitHub Actions", "Swagger"].map(t => (
                <span key={t} style={styles.stackBadge}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.divider} />

      {/* ── FUNCIONALIDADES ── */}
      <div style={styles.section}>
        <div ref={featRef}>
          <span style={styles.sectionLabel}>Funcionalidades</span>
          <h2 style={{
            ...styles.sectionTitle,
            opacity: featVisible ? 1 : 0,
            transform: featVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>Todo lo que necesitas en un solo lugar</h2>
          <p style={{
            ...styles.sectionSub,
            opacity: featVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.1s",
          }}>
            Una suite completa de herramientas para que estudiantes oferentes y solicitantes
            puedan interactuar de forma segura, ordenada y con total trazabilidad.
          </p>
        </div>
        <div style={styles.featGrid}>
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 80} />
          ))}
        </div>
      </div>

      <div style={styles.divider} />

      {/* ── EQUIPO ── */}
      <div style={styles.section}>
        <div ref={teamRef}>
          <span style={styles.sectionLabel}>Equipo de desarrollo</span>
          <h2 style={{
            ...styles.sectionTitle,
            opacity: teamVisible ? 1 : 0,
            transform: teamVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>Las personas detrás de Campus Emprende</h2>
          <p style={{
            ...styles.sectionSub,
            opacity: teamVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.1s",
          }}>
            Un equipo de desarrolladores apasionados que combinaron diseño, ingeniería y
            visión académica para construir una plataforma técnicamente sólida y con propósito real.
          </p>
        </div>
        <div style={styles.devGrid}>
          {DEVELOPERS.map((dev, i) => (
            <DevCard key={dev.name} dev={dev} delay={i * 120} />
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div style={styles.cta}>
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 250, height: 250, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,104,212,0.3), transparent 70%)",
          pointerEvents: "none",
        }} />
        <h2 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(22px, 3vw, 32px)",
          color: "white", marginBottom: 14,
        }}>
          ¿Listo para conectar tu talento?
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.7)", fontSize: 15,
          maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7,
        }}>
          Únete a Campus Emprende, publica tus servicios y comienza a construir tu
          reputación profesional dentro del ecosistema universitario.
        </p>
        <button
          style={styles.ctaBtn}
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 30px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
          }}
          onClick={() => window.location.href = "/registro"}
        >
          Crear cuenta gratis
        </button>
      </div>

    </div>
  );
}
