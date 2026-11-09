"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

// El visor se descarga recién al abrir una foto: su JS no entra en la primera carga de la ficha.
const VisorFotos = dynamic(() => import("./VisorFotos"), { ssr: false });
// Al apoyar el dedo (o pasar con el teclado) ya se pide el visor, para que abra sin espera.
const precargarVisor = () => void import("./VisorFotos");

type Foto = { src: string; alt: string };

// Galería de la ficha. Celular: una foto por pantalla, a sangre, con scroll-snap y trazos finos de progreso debajo.
// PC: cuadrícula de 2x2. Al tocar una foto se abre el visor en esa foto.
// La primera foto (la de la tarjeta) se pide primero. En el celular, las demás se dibujan recién cuando
// llega la primera (o si falla, si pasan 2,5 s o si se desliza), para que no le quiten red: en 4G lenta
// el LCP medido con las cuatro a la vez daba 2,6 s. En PC la cuadrícula está entera a la vista y van todas.
export default function GaleriaPrenda({ fotos }: { fotos: Foto[] }) {
  const [actual, setActual] = useState(0);
  const [visor, setVisor] = useState<number | null>(null);
  const [resto, setResto] = useState(false);
  const pista = useRef<HTMLDivElement>(null);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const mostrarResto = useCallback(() => setResto(true), []);

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setResto(true);
      return;
    }
    const respaldo = window.setTimeout(() => setResto(true), 2500);
    return () => window.clearTimeout(respaldo);
  }, []);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let pendiente = 0;
    const alMover = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(() => {
        if (el.clientWidth === 0) return;
        setResto(true);
        setActual(Math.min(fotos.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
      });
    };
    el.addEventListener("scroll", alMover, { passive: true });
    return () => {
      cancelAnimationFrame(pendiente);
      el.removeEventListener("scroll", alMover);
    };
  }, [fotos.length]);

  // Al cerrar el visor, la galería queda en la última foto vista y el foco vuelve a su botón, sin mover la página.
  const cerrarVisor = useCallback((ultima: number) => {
    setVisor(null);
    const el = pista.current;
    if (el) el.scrollTo({ left: ultima * el.clientWidth });
    botones.current[ultima]?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="galeria">
      <div ref={pista} className="galeria__pista" role="region" aria-label="Fotos de la prenda" tabIndex={0}>
        {fotos.map((foto, n) => (
          <div key={foto.src} className="galeria__foto">
            <button
              ref={(el) => {
                botones.current[n] = el;
              }}
              type="button"
              className="galeria__boton foto-zoom"
              aria-label={`Ampliar foto ${n + 1} de ${fotos.length}: ${foto.alt}`}
              onClick={() => setVisor(n)}
              onPointerDown={precargarVisor}
              onFocus={precargarVisor}
            >
              {(n === 0 || resto) && (
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  quality={70}
                  priority={n === 0}
                  fetchPriority={n === 0 ? "high" : "low"}
                  onLoad={n === 0 ? mostrarResto : undefined}
                  onError={n === 0 ? mostrarResto : undefined}
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
              )}
            </button>
          </div>
        ))}
      </div>
      <ol className="galeria__progreso" aria-hidden="true">
        {fotos.map((foto, i) => (
          <li key={foto.src} aria-current={i === actual ? "true" : undefined} />
        ))}
      </ol>
      {visor !== null && <VisorFotos fotos={fotos} inicio={visor} onClose={cerrarVisor} />}
    </div>
  );
}
