import { useState, useEffect, useRef } from "react";
import "./QuienesSomos.css";

/* ─── Fotos del equipo ────────────────────────────────
   Ajusta estas rutas si tu carpeta "photo" no está en
   src/photo (según tu estructura sería ../../photo/...
   desde src/pages/home/QuienesSomos.jsx) */
import fotoElias from "../../photo/EliasDelgado.jpeg";
import fotoAlcindo from "../../photo/AlcindoChavarria.jpeg";
import fotoDiego from "../../photo/DiegoSepulveda.jpeg";
import fotoDaniel from "../../photo/DanielRiquelme.jpeg";

const DEVELOPERS = [
  {
    name: "Elias Delgado Manriquez",
    role: "Desarrollador Fullstack",
    tag: "Fullstack",
    foto: fotoElias,
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
    foto: fotoAlcindo,
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
    foto: fotoDiego,
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

/* ─── Docente guía del proyecto ───────────────────────── */
const MENTOR = {
  name: "Daniel Riquelme Rigot",
  role: "Docente Guía del Proyecto",
  tag: "Docente",
  foto: fotoDaniel,
  color: "#1A2D5A",
  accent: "#A78BFA",
  description:
    "Acompañó al equipo durante todo el ciclo de desarrollo de Campus Emprende, " +
    "orientando las decisiones de arquitectura, la planificación de hitos y la " +
    "revisión de buenas prácticas de ingeniería de software. Su retroalimentación " +
    "constante permitió alinear el proyecto con los objetivos académicos del curso " +
    "y con estándares profesionales de calidad, documentación y trazabilidad.",
  skills: ["Mentoría académica", "Arquitectura de software", "Buenas prácticas", "Evaluación de proyectos"],
};

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

/* ─── Card de integrante (foto + descripción, estilo testimonio) ───
   Layout horizontal en escritorio (foto a la izquierda, contenido a
   la derecha) y apilado en móvil. La animación de entrada va en el
   contenedor exterior y el hover en ".team-card" (ver QuienesSomos.css) */
function TeamCard({ person, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        transitionDelay: visible ? `${delay}ms` : "0ms",
      }}
    >
      <div className="team-card" style={{ borderTopColor: person.accent }}>
        <div className="team-card__photo">
          <img src={person.foto} alt={`Foto de ${person.name}`} />
        </div>
        <div className="team-card__content">
          <span className="team-card__quote-mark" style={{ color: person.accent }}>"</span>
          <Badge text={person.tag} accent={person.accent} />
          <h3 className="team-card__name" style={{ color: person.color }}>
            {person.name}
          </h3>
          <p className="team-card__role">{person.role}</p>
          <p className="team-card__desc">{person.description}</p>
          <div className="team-card__skills">
            {person.skills.map(s => (
              <SkillPill key={s} text={s} accent={person.accent} />
            ))}
          </div>
        </div>
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
  const [mentorRef, mentorVisible] = useInView(0.05);
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
    subTitle: {
      fontFamily: "'Georgia', serif",
      fontSize: "clamp(20px, 2.6vw, 28px)", fontWeight: 700,
      color: "#1A2D5A", marginBottom: 14, lineHeight: 1.25,
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

        <div className="team-list">
          {DEVELOPERS.map((dev, i) => (
            <TeamCard key={dev.name} person={dev} delay={i * 120} />
          ))}
        </div>

        {/* ── DOCENTE GUÍA ── */}
        <div ref={mentorRef} style={{ marginTop: 64 }}>
          <span style={styles.sectionLabel}>Acompañamiento académico</span>
          <h3 style={{
            ...styles.subTitle,
            opacity: mentorVisible ? 1 : 0,
            transform: mentorVisible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>Con la guía de nuestro docente</h3>
          <p style={{
            ...styles.sectionSub,
            marginBottom: 32,
            opacity: mentorVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.1s",
          }}>
            Este proyecto fue desarrollado en el marco académico del curso, bajo la
            supervisión y retroalimentación constante de nuestro docente guía.
          </p>
        </div>

        <div className="team-list">
          <TeamCard person={MENTOR} delay={0} />
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
