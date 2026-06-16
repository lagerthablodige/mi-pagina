"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const images = [
  { src: "/hero/playa.jpg", alt: "Modelo con abrigo de cashmere en la playa" },
  { src: "/hero/rocas.jpg", alt: "Modelo con abrigo de cashmere y botas de pelo entre rocas" },
  { src: "/hero/cardigan.jpg", alt: "Modelo con cárdigan de punto cashmere frente al mar" },
  { src: "/hero/columnas.jpg", alt: "Modelo con abrigo de cashmere gris entre columnas" },
];

export default function HeroBackground() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          quality={92}
          priority={i === 0}
          style={{
            objectFit: "cover",
            objectPosition: "center 20%",
            opacity: i === index ? 1 : 0,
            transition: "opacity 1.4s ease-in-out",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(20, 16, 12, 0.45)",
        }}
      />
    </div>
  );
}
