import Image from "next/image";

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
      <p style={{ fontSize: "1.05rem", color: "#444", maxWidth: "500px", lineHeight: "1.9", marginBottom: "3rem" }}>
        Prendas elaboradas con fibras como el yak y el camello,
        seleccionadas para una audiencia que entiende la diferencia.
        Cada pieza oscila entre los $700 y $1.400 USD.
      </p>
      <Image src="/perros.png" alt="nirün" width={350} height={440} style={{ opacity: 0.9 }} />
    </div>
  );
}
