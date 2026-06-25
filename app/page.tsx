import Image from "next/image";
import HeroBackground from "./HeroBackground";

const sections = [
  {
    image: "/historia/cabras-estepa.png",
    alt: "Manada de cabras de cashmere en las estepas de Mongolia",
    title: "El origen",
    text: "En las estepas de Mongolia, donde el clima alcanza extremos y la naturaleza define el ritmo de la vida, nace una de las fibras más nobles del mundo: el cashmere auténtico, formado en condiciones únicas y seleccionado desde su origen.",
  },
  {
    image: "/historia/peinado-cabra.png",
    alt: "Pastor peinando manualmente la fibra de una cabra",
    title: "La recolección",
    text: "La cabra de cashmere vive en libertad, soportando temperaturas de hasta 40 grados bajo cero. Para sobrevivir desarrolla una doble capa de pelo: una externa áspera y una interna extremadamente fina y suave. Cada primavera, los pastores recolectan esta fibra a través de un delicado proceso artesanal de peinado manual que preserva su pureza.",
  },
  {
    image: "/historia/fabrica.png",
    alt: "Manufactura textil donde se confeccionan las prendas Nirün",
    title: "Manos expertas",
    text: "Detrás de cada prenda hay manos expertas —principalmente mujeres— cuyo trabajo no solo da forma a la fibra, sino que sostiene comunidades y tradiciones. La fábrica da empleo a más de 100 personas, dando prioridad a hogares encabezados por mujeres y apoyando a las comunidades de origen de la cachemira.",
  },
  {
    image: "/historia/hilos.png",
    alt: "Hilos de cashmere de distintos colores listos para confección",
    title: "Calidad superior",
    text: "Nuestra manufactura cuenta con el sello Mongolian Noble Fiber (MNF), que certifica prácticas sostenibles y un nivel de calidad superior. Cada pieza es ligera, cálida y duradera: una suavidad que no se impone, se percibe.",
  },
  {
    image: "/historia/cazador-aguila.png",
    alt: "Cazador con águila, tradición de los pueblos de Mongolia",
    title: "Mongolia como origen",
    text: "El lujo como visión. Una herencia de tradiciones milenarias que hoy se traduce en prendas atemporales, hechas para quienes entienden la diferencia.",
  },
];

const cornerStyle = (
  top?: number,
  bottom?: number,
  left?: number,
  right?: number,
  size = 48,
  thickness = 1,
  opacity = 0.5,
  drawHorizontal = true
) => ({
  position: "absolute" as const,
  top,
  bottom,
  left,
  right,
  width: `${size}px`,
  height: `${size}px`,
  borderTop: top !== undefined && drawHorizontal ? `${thickness}px solid #a36b3f` : undefined,
  borderBottom: bottom !== undefined && drawHorizontal ? `${thickness}px solid #a36b3f` : undefined,
  borderLeft: left !== undefined ? `${thickness}px solid #a36b3f` : undefined,
  borderRight: right !== undefined ? `${thickness}px solid #a36b3f` : undefined,
  opacity,
  pointerEvents: "none" as const,
  zIndex: 50,
});

const FlameOrnament = () => (
  <svg width="44" height="30" viewBox="0 0 44 30" fill="none" aria-hidden="true" style={{ marginBottom: "1rem", opacity: 0.9 }}>
    <path d="M10 28 Q 5 17 10 6 Q 15 17 10 28 Z" stroke="#a36b3f" strokeWidth="0.9" fill="#a36b3f" fillOpacity="0.1"/>
    <path d="M22 30 Q 14 16 22 2 Q 30 16 22 30 Z" stroke="#a36b3f" strokeWidth="1.2" fill="#a36b3f" fillOpacity="0.15"/>
    <path d="M34 28 Q 29 17 34 6 Q 39 17 34 28 Z" stroke="#a36b3f" strokeWidth="0.9" fill="#a36b3f" fillOpacity="0.1"/>
  </svg>
);

const LujoOrnament = () => (
  <svg width="320" height="22" viewBox="0 0 320 22" fill="none" aria-hidden="true">
    <line x1="0" y1="11" x2="110" y2="11" stroke="#a36b3f" strokeWidth="0.5" opacity="0.45"/>
    <path d="M116 11 Q119 7 122 11 Q119 15 116 11 Z" stroke="#a36b3f" strokeWidth="0.8" fill="#a36b3f" fillOpacity="0.12"/>
    <path d="M125 11 Q128 7 131 11 Q128 15 125 11 Z" stroke="#a36b3f" strokeWidth="0.8" fill="#a36b3f" fillOpacity="0.12"/>
    <path d="M160 3 L163 9 L169 11 L163 13 L160 19 L157 13 L151 11 L157 9 Z" stroke="#a36b3f" strokeWidth="0.9" fill="#a36b3f" fillOpacity="0.18"/>
    <path d="M189 11 Q192 7 195 11 Q192 15 189 11 Z" stroke="#a36b3f" strokeWidth="0.8" fill="#a36b3f" fillOpacity="0.12"/>
    <path d="M198 11 Q201 7 204 11 Q201 15 198 11 Z" stroke="#a36b3f" strokeWidth="0.8" fill="#a36b3f" fillOpacity="0.12"/>
    <line x1="210" y1="11" x2="320" y2="11" stroke="#a36b3f" strokeWidth="0.5" opacity="0.45"/>
  </svg>
);

export default function Home() {
  return (
    <div style={{ backgroundColor: "#fafaf8", fontFamily: "Georgia, serif" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          textAlign: "center",
          position: "relative",
        }}
      >
        <HeroBackground />

        <div style={cornerStyle(24, undefined, 24, undefined)} />
        <div style={cornerStyle(24, undefined, undefined, 24)} />
        <div style={cornerStyle(undefined, 24, 24, undefined, 48, 1, 0.5, false)} />
        <div style={cornerStyle(undefined, 24, undefined, 24, 48, 1, 0.5, false)} />

        <div style={cornerStyle(10, undefined, 10, undefined, 80, 1.5, 0.7)} />
        <div style={cornerStyle(10, undefined, undefined, 10, 80, 1.5, 0.7)} />
        <div style={cornerStyle(undefined, 10, 10, undefined, 80, 1.5, 0.7, false)} />
        <div style={cornerStyle(undefined, 10, undefined, 10, 80, 1.5, 0.7, false)} />

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <FlameOrnament />
          <h1
            style={{
              fontSize: "3rem",
              letterSpacing: "0.3em",
              fontWeight: 300,
              color: "#f5f0e8",
              marginBottom: "0.5rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.35)",
            }}
          >
            NIRÜN
          </h1>
        </div>
        <p
          style={{
            position: "relative",
            zIndex: 10,
            fontSize: "0.85rem",
            letterSpacing: "0.25em",
            color: "#e8e0d4",
            textTransform: "uppercase",
            marginBottom: "2.5rem",
            textShadow: "0 1px 6px rgba(0,0,0,0.35)",
          }}
        >
          Fibras Naturales. Texturas sedosas. Diseño Atemporal.
        </p>
        <p
          style={{
            position: "relative",
            zIndex: 10,
            fontSize: "1.05rem",
            color: "#f0ece4",
            maxWidth: "500px",
            lineHeight: "1.9",
            marginBottom: "2.5rem",
            textShadow: "0 1px 6px rgba(0,0,0,0.35)",
          }}
        >
          Prendas elaboradas a partir de Baby Camel, Cashmere, Yak y Seda.
          Seleccionadas para una audiencia que conoce la diferencia.
        </p>
        <a
          href="https://wa.me/56990911592?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20visita%20al%20local%20para%20ver%20las%20prendas."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "relative",
            zIndex: 10,
            padding: "0.85rem 2.5rem",
            border: "1px solid #f5f0e8",
            color: "#f5f0e8",
            backgroundColor: "transparent",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "all 0.2s",
            marginBottom: "4rem",
          }}
        >
          Agenda tu visita
        </a>

        <a
          href="#lujo-silencioso"
          aria-label="Bajar para descubrir el lujo silencioso"
          style={{
            position: "absolute",
            zIndex: 10,
            bottom: "2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.6rem",
            textDecoration: "none",
            color: "#f5f0e8",
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              textShadow: "0 1px 6px rgba(0,0,0,0.35)",
            }}
          >
            Descubre
          </span>
          <svg
            className="scroll-cue"
            width="20"
            height="28"
            viewBox="0 0 20 28"
            fill="none"
          >
            <path
              d="M2 8 L10 16 L18 8"
              stroke="#f5f0e8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 18 L10 26 L18 18"
              stroke="#f5f0e8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </svg>
        </a>
      </div>

      <div id="lujo-silencioso" style={{ textAlign: "center", padding: "2rem 2rem 0" }}>
        <LujoOrnament />
        <p
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.35em",
            color: "#a36b3f",
            textTransform: "uppercase",
            marginTop: "0.6rem",
          }}
        >
          Lujo Silencioso
        </p>
      </div>

      {sections.map((section, i) => (
        <div
          key={section.title}
          style={{
            display: "flex",
            flexDirection: i % 2 === 0 ? "row" : "row-reverse",
            flexWrap: "wrap",
            alignItems: "center",
            backgroundColor: i % 2 === 0 ? "#fafaf8" : "#f1efe9",
          }}
        >
          <div style={{ flex: "1 1 420px", position: "relative", height: "420px" }}>
            <Image
              src={section.image}
              alt={section.alt}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              flex: "1 1 420px",
              padding: "3rem 3.5rem",
              maxWidth: "560px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "1.2rem" }}>
              <span style={{ color: "#a36b3f", fontSize: "0.55rem", opacity: 0.7, transform: "rotate(45deg)", display: "inline-block", letterSpacing: 0 }}>■</span>
              <h2
                style={{
                  fontSize: "1.4rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {section.title}
              </h2>
            </div>
            <p
              style={{
                fontSize: "1rem",
                color: "#444",
                lineHeight: "1.9",
              }}
            >
              {section.text}
            </p>
          </div>
        </div>
      ))}

      <div
        style={{
          textAlign: "center",
          padding: "4rem 2rem",
          backgroundColor: "#1a1a1a",
        }}
      >
        <svg width="36" height="24" viewBox="0 0 44 30" fill="none" aria-hidden="true" style={{ marginBottom: "1.5rem", opacity: 0.35 }}>
          <path d="M10 28 Q 5 17 10 6 Q 15 17 10 28 Z" stroke="#f5f0e8" strokeWidth="0.9" fill="#f5f0e8" fillOpacity="0.1"/>
          <path d="M22 30 Q 14 16 22 2 Q 30 16 22 30 Z" stroke="#f5f0e8" strokeWidth="1.2" fill="#f5f0e8" fillOpacity="0.15"/>
          <path d="M34 28 Q 29 17 34 6 Q 39 17 34 28 Z" stroke="#f5f0e8" strokeWidth="0.9" fill="#f5f0e8" fillOpacity="0.1"/>
        </svg>
        <p
          style={{
            fontSize: "1.3rem",
            letterSpacing: "0.1em",
            color: "#f5f0e8",
            lineHeight: "1.8",
            maxWidth: "600px",
            margin: "0 auto 2rem",
          }}
        >
          Mongolia como origen. El lujo como visión.
        </p>
        <a
          href="https://wa.me/56990911592?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20visita%20al%20local%20para%20ver%20las%20prendas."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "0.85rem 2.5rem",
            border: "1px solid #f5f0e8",
            color: "#f5f0e8",
            backgroundColor: "transparent",
            fontSize: "0.85rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          Agenda tu visita
        </a>
      </div>
    </div>
  );
}
