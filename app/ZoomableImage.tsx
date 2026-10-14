"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ZOOM = 2.5;

type Props = {
  src: string;
  alt: string;
  sizes: string;
  objectPosition?: string;
};

export default function ZoomableImage({ src, alt, sizes, objectPosition = "center" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar foto: ${alt}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          padding: 0,
          border: 0,
          background: "none",
          cursor: "zoom-in",
        }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} style={{ objectFit: "cover", objectPosition }} />
      </button>
      {open && createPortal(<Lightbox src={src} alt={alt} onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [zoomed, setZoomed] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);
  const tapRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  // Al acercar, deja el punto tocado al centro de la pantalla.
  useEffect(() => {
    const area = areaRef.current;
    if (!zoomed || !area) return;
    area.scrollLeft = tapRef.current.x * area.scrollWidth - area.clientWidth / 2;
    area.scrollTop = tapRef.current.y * area.scrollHeight - area.clientHeight / 2;
  }, [zoomed]);

  function toggleZoom(e: React.MouseEvent<HTMLDivElement>) {
    const area = areaRef.current;
    if (!area) return;
    if (!zoomed) {
      const rect = area.getBoundingClientRect();
      tapRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    }
    setZoomed((z) => !z);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        backgroundColor: "#0c0a08",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.5rem 0.5rem 0.5rem 1rem",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#b8945f",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          {zoomed ? "Toca para alejar" : "Toca la foto para acercar"}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          autoFocus
          style={{
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "1px solid rgba(245,240,232,0.35)",
            cursor: "pointer",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="#f5f0e8" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div
        ref={areaRef}
        onClick={toggleZoom}
        style={{
          position: "relative",
          flex: 1,
          overflow: zoomed ? "auto" : "hidden",
          overscrollBehavior: "contain",
          cursor: zoomed ? "zoom-out" : "zoom-in",
        }}
      >
        <div
          style={{
            position: "relative",
            width: zoomed ? `${ZOOM * 100}%` : "100%",
            height: zoomed ? `${ZOOM * 100}%` : "100%",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={zoomed ? `${ZOOM * 100}vw` : "100vw"}
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
