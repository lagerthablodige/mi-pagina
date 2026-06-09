import Image from "next/image";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh", gap: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontFamily: "sans-serif" }}>
        ola mamita estoy avanzando en la pagina
      </h1>
      <Image src="/perros.png" alt="perros" width={400} height={500} />
    </div>
  );
}
