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

        <h1
          style={{
            position: "relative",
            zIndex: 10,
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
          Fibras raras. Para quienes las conocen.
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
          Prendas elaboradas con fibras como el yak y el camello,
          seleccionadas para una audiencia que entiende la diferencia.
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

      <div id="lujo-silencioso" style={{ textAlign: "center", padding: "1rem 2rem 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <span style={{ width: "60px", height: "1px", backgroundColor: "#a36b3f", opacity: 0.6 }} />
          <span style={{ color: "#a36b3f", fontSize: "0.9rem" }}>✦</span>
          <span style={{ width: "60px", height: "1px", backgroundColor: "#a36b3f", opacity: 0.6 }} />
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            letterSpacing: "0.35em",
            color: "#a36b3f",
            textTransform: "uppercase",
            marginTop: "0.8rem",
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
            <h2
              style={{
                fontSize: "1.4rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 400,
                color: "#1a1a1a",
                marginBottom: "1.2rem",
              }}
            >
              {section.title}
            </h2>
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
