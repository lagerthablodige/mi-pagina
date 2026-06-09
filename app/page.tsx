export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#fafaf8",
      fontFamily: "Georgia, serif",
      padding: "2rem",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "3rem", letterSpacing: "0.3em", fontWeight: 300, color: "#1a1a1a", marginBottom: "0.5rem" }}>
        NIRÜN
      </h1>
      <p style={{ fontSize: "0.85rem", letterSpacing: "0.25em", color: "#888", textTransform: "uppercase", marginBottom: "2.5rem" }}>
        Fibras raras. Para quienes las conocen.
      </p>
      <p style={{ fontSize: "1.05rem", color: "#444", maxWidth: "500px", lineHeight: "1.9", marginBottom: "2.5rem" }}>
        Prendas elaboradas con fibras como el yak y el camello,
        seleccionadas para una audiencia que entiende la diferencia.
      </p>
      <a
        href="https://wa.me/56990911592?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20visita%20al%20local%20para%20ver%20las%20prendas."
        target="_blank"
        rel="noopener noreferrer"
        style={{
          padding: "0.85rem 2.5rem",
          border: "1px solid #1a1a1a",
          color: "#1a1a1a",
          backgroundColor: "transparent",
          fontSize: "0.85rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textDecoration: "none",
          transition: "all 0.2s",
        }}
      >
        Agenda tu visita
      </a>
    </div>
  );
}
