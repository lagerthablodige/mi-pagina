"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fibers } from "./fibersData";

function Tile({ fiber, offset }: { fiber: (typeof fibers)[number]; offset: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const period = 3000 + offset * 500; // 3000/3500/4000ms, desincroniza las columnas
    const start = setTimeout(() => {
      setIndex((i) => (i + 1) % fiber.images.length);
    }, offset * 900);
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % fiber.images.length);
    }, period);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [fiber.images.length, offset]);

  const current = fiber.images[index];

  return (
    <a
      href={`#${fiber.anchor}`}
      style={{
        position: "relative",
        flex: "1 1 0",
        height: "78vh",
        minHeight: "420px",
        overflow: "hidden",
        display: "block",
        textDecoration: "none",
      }}
    >
      {fiber.images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={`${fiber.label} — ${img.garment}`}
          fill
          quality={90}
          priority={offset === 0 && i === 0}
          style={{
            objectFit: "cover",
            objectPosition: "center 12%",
            opacity: i === index ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(20,16,12,0.65), rgba(20,16,12,0.05) 45%)",
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: "1.6rem", textAlign: "center" }}>
        <p
          style={{
            color: "#f5f0e8",
            fontSize: "1.1rem",
            letterSpacing: "0.3em",
            fontWeight: 300,
            margin: 0,
            textShadow: "0 1px 8px rgba(0,0,0,0.4)",
          }}
        >
          {fiber.label}
        </p>
        <p
          style={{
            color: "#d8cdbd",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            marginTop: "0.4rem",
          }}
        >
          {current.garment}
        </p>
      </div>
    </a>
  );
}

export default function Vitrina() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {fibers.map((fiber, i) => (
        <Tile key={fiber.key} fiber={fiber} offset={i} />
      ))}
    </div>
  );
}
