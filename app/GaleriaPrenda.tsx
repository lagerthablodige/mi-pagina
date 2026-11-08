"use client";

import { useEffect, useRef, useState } from "react";
import ZoomableImage from "./ZoomableImage";

type Foto = { src: string; alt: string };

// Galería de la ficha. Celular: una foto por pantalla, a sangre, con scroll-snap y contador "1 / 4".
// PC: cuadrícula de 2x2. Al tocar una foto se abre el zoom.
export default function GaleriaPrenda({ fotos }: { fotos: Foto[] }) {
  const [actual, setActual] = useState(0);
  const pista = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let pendiente = 0;
    const alMover = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(() => {
        if (el.clientWidth === 0) return;
        setActual(Math.min(fotos.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
      });
    };
    el.addEventListener("scroll", alMover, { passive: true });
    return () => {
      cancelAnimationFrame(pendiente);
      el.removeEventListener("scroll", alMover);
    };
  }, [fotos.length]);

  return (
    <div className="galeria">
      <div ref={pista} className="galeria__pista" role="region" aria-label="Fotos de la prenda" tabIndex={0}>
        {fotos.map((foto, n) => (
          <div key={foto.src} className="galeria__foto">
            <ZoomableImage
              src={foto.src}
              alt={foto.alt}
              sizes="(min-width: 1024px) 28vw, 100vw"
              objectPosition="center top"
              priority={n === 0}
              quality={n === 0 ? 75 : 70}
            />
          </div>
        ))}
      </div>
      <p className="galeria__contador" aria-hidden="true">
        {actual + 1} / {fotos.length}
      </p>
    </div>
  );
}
