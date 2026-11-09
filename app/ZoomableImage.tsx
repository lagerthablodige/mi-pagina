"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

// El visor se descarga recién al abrir la foto (no entra en la primera carga del inicio).
const VisorFotos = dynamic(() => import("./VisorFotos"), { ssr: false });
const precargarVisor = () => void import("./VisorFotos");

type Props = {
  src: string;
  alt: string;
  sizes: string;
  objectPosition?: string;
  priority?: boolean; // foto principal de una página: se carga de inmediato
  quality?: number;
};

// Foto que se amplía al tocarla (collage del showroom). Usa el mismo visor que la galería de la ficha, con una sola foto.
export default function ZoomableImage({ src, alt, sizes, objectPosition = "center", priority = false, quality }: Props) {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const fotos = useMemo(() => [{ src, alt }], [src, alt]);

  // Al cerrar, el foco vuelve al botón que lo abrió, sin mover la página.
  const cerrar = useCallback(() => {
    setAbierto(false);
    boton.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <button
        ref={boton}
        type="button"
        className="foto-zoom"
        onClick={() => setAbierto(true)}
        onPointerDown={precargarVisor}
        onFocus={precargarVisor}
        aria-label={`Ampliar foto: ${alt}`}
      >
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={quality} style={{ objectFit: "cover", objectPosition }} />
      </button>
      {abierto && <VisorFotos fotos={fotos} inicio={0} onClose={cerrar} />}
    </>
  );
}
