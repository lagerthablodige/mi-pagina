"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useCerrarConAtras } from "./useCerrarConAtras";

export type FotoVisor = { src: string; alt: string };

type Props = {
  fotos: FotoVisor[];
  inicio: number; // foto con la que abre (contando desde 0)
  onClose: (ultima: number) => void; // recibe la foto que se estaba viendo al cerrar
};

// Foto ya descargada en la página (galería o collage) para mostrarla al instante mientras llega la del visor.
// next/image pide /_next/image?url=<ruta>&w=..&q=..; se elige la más grande que ya esté lista.
function previaDe(src: string): string | undefined {
  const clave = `url=${encodeURIComponent(src)}&`;
  let mejor: HTMLImageElement | undefined;
  for (const img of Array.from(document.images)) {
    if (!img.complete || img.naturalWidth === 0 || !img.currentSrc.includes(clave)) continue;
    if (!mejor || img.naturalWidth > mejor.naturalWidth) mejor = img;
  }
  return mejor?.currentSrc;
}

// Cuánto se acerca: las fotos miden 2000 px de ancho, así que no se estiran más allá de eso (iPhone 3x: ~1,7).
function factorZoom() {
  return Math.max(1.5, Math.min(2.5, 2000 / (window.innerWidth * window.devicePixelRatio)));
}

// Visor de fotos a pantalla completa: desliza entre las fotos, acerca al tocar, se cierra con «Atrás», Escape o Cerrar.
// Se carga con next/dynamic (ssr: false) recién al abrir una foto.
export default function VisorFotos({ fotos, inicio, onClose }: Props) {
  const total = fotos.length;
  const primera = Math.min(Math.max(inicio, 0), total - 1);
  const [actual, setActual] = useState(primera);
  const [zoom, setZoom] = useState(false);
  const [factor, setFactor] = useState(2);
  const [previas, setPrevias] = useState(() => fotos.map((f) => previaDe(f.src)));

  const dialogo = useRef<HTMLDivElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const cerrarBoton = useRef<HTMLButtonElement>(null);
  const areas = useRef<(HTMLDivElement | null)[]>([]);
  const botones = useRef<(HTMLButtonElement | null)[]>([]);
  const actualRef = useRef(primera);
  const zoomRef = useRef(false);
  const toque = useRef({ x: 0.5, y: 0.5 });
  const liberar = useRef<(() => void) | null>(null);
  const cerrado = useRef(false);

  actualRef.current = actual;
  zoomRef.current = zoom;

  // Cierra una sola vez: primero devuelve la página (inert y scroll) y después avisa, así quien abrió el visor
  // puede devolver el foco a su foto.
  const cerrar = useCallback(() => {
    if (cerrado.current) return;
    cerrado.current = true;
    liberar.current?.();
    onClose(actualRef.current);
  }, [onClose]);

  // «Atrás» del celular cierra el visor sin salir de la ficha.
  useCerrarConAtras(true, cerrar);

  // Al abrir: la página de atrás queda inerte (Tab no se escapa), sin scroll, y el foco va a Cerrar.
  useEffect(() => {
    const raiz = dialogo.current;
    const previos = new Map<HTMLElement, boolean>();
    for (const el of Array.from(document.body.children)) {
      if (el === raiz || !(el instanceof HTMLElement)) continue;
      previos.set(el, el.inert);
      el.inert = true;
    }
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let hecho = false;
    liberar.current = () => {
      if (hecho) return;
      hecho = true;
      previos.forEach((valor, el) => {
        el.inert = valor; // se devuelve el valor que tenía, sin forzar false
      });
      document.body.style.overflow = overflowPrevio;
    };
    cerrarBoton.current?.focus({ preventScroll: true });
    return () => liberar.current?.();
  }, []);

  // Abre en la foto elegida, antes de pintar (sin pasar por la primera).
  useLayoutEffect(() => {
    const el = pista.current;
    if (el) el.scrollLeft = primera * el.clientWidth;
  }, [primera]);

  // Foto actual según el deslizamiento.
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let pendiente = 0;
    const alMover = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(() => {
        if (el.clientWidth === 0) return;
        setActual(Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))));
      });
    };
    el.addEventListener("scroll", alMover, { passive: true });
    return () => {
      cancelAnimationFrame(pendiente);
      el.removeEventListener("scroll", alMover);
    };
  }, [total]);

  // Si el foco estaba en una foto y se pasó a otra (flechas o deslizamiento), el foco la sigue:
  // así no queda en una foto escondida para el lector de pantalla.
  useEffect(() => {
    const activo = document.activeElement;
    const destino = botones.current[actual];
    if (!destino || activo === destino || !botones.current.some((b) => b === activo)) return;
    destino.focus({ preventScroll: true });
  }, [actual]);

  const ir = useCallback(
    (n: number) => {
      const el = pista.current;
      if (!el || n < 0 || n >= total) return;
      const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: n * el.clientWidth, behavior: suave ? "smooth" : "auto" });
    },
    [total]
  );

  const acercar = useCallback((centro: { x: number; y: number }) => {
    const n = actualRef.current;
    // La foto que ya se ve queda debajo de la acercada mientras esta llega: sin cuadro negro.
    const img = botones.current[n]?.querySelector<HTMLImageElement>("img[data-nimg]");
    if (img?.complete && img.naturalWidth > 0) {
      const src = img.currentSrc;
      setPrevias((p) => p.map((v, i) => (i === n ? src : v)));
    }
    toque.current = centro;
    setFactor(factorZoom());
    setZoom(true);
  }, []);

  const alternar = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (zoomRef.current) {
      setZoom(false);
      return;
    }
    // Con teclado (e.detail === 0) se acerca al centro; con el dedo o el mouse, al punto tocado.
    let centro = { x: 0.5, y: 0.5 };
    if (e.detail !== 0) {
      const r = e.currentTarget.getBoundingClientRect();
      centro = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
    }
    acercar(centro);
  };

  // Al acercar, el punto tocado queda al centro de la pantalla.
  useLayoutEffect(() => {
    const area = areas.current[actualRef.current];
    if (!zoom || !area) return;
    area.scrollLeft = toque.current.x * area.scrollWidth - area.clientWidth / 2;
    area.scrollTop = toque.current.y * area.scrollHeight - area.clientHeight / 2;
  }, [zoom, factor]);

  // Teclado: Escape cierra, las flechas pasan de foto (sin zoom) y Tab no sale del diálogo.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cerrar();
        return;
      }
      if ((e.key === "ArrowRight" || e.key === "ArrowLeft") && !zoomRef.current) {
        e.preventDefault();
        ir(actualRef.current + (e.key === "ArrowRight" ? 1 : -1));
        return;
      }
      if (e.key === "Tab") {
        const focos = [cerrarBoton.current, botones.current[actualRef.current]].filter(
          (x): x is HTMLButtonElement => x !== null && x !== undefined
        );
        if (focos.length === 0) return;
        e.preventDefault();
        const i = focos.indexOf(document.activeElement as HTMLButtonElement);
        const siguiente = e.shiftKey ? (i <= 0 ? focos.length - 1 : i - 1) : i < 0 || i === focos.length - 1 ? 0 : i + 1;
        focos[siguiente].focus();
      }
    };
    document.addEventListener("keydown", alTeclear);
    return () => document.removeEventListener("keydown", alTeclear);
  }, [cerrar, ir]);

  // PC con mouse: la rueda pasa de foto (sin zoom). Un giro seguido, o el deslizamiento con inercia del trackpad,
  // cuenta una sola vez: hace falta una pausa para pasar a la siguiente. El deslizamiento horizontal sigue siendo nativo.
  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    let ultimo = -Infinity;
    const alGirar = (e: WheelEvent) => {
      if (zoomRef.current || e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      const seguido = e.timeStamp - ultimo < 300;
      ultimo = e.timeStamp;
      if (!seguido) ir(actualRef.current + (e.deltaY > 0 ? 1 : -1));
    };
    el.addEventListener("wheel", alGirar, { passive: false });
    return () => el.removeEventListener("wheel", alGirar);
  }, [ir]);

  // Pellizcar no amplía la página; un pellizco hacia afuera acerca y hacia adentro aleja. iPhone avisa con gesture*;
  // Android solo con touch* (dos dedos). En iPhone llegan los dos: `usado` hace que cada pellizco cuente una sola vez.
  useEffect(() => {
    const raiz = dialogo.current;
    if (!raiz) return;
    let usado = false;
    let d0 = 0;
    const distancia = (t: TouchList) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
    const alTocar = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      d0 = distancia(e.touches);
      usado = false;
    };
    const alMoverDedos = (e: TouchEvent) => {
      if (e.touches.length !== 2 || d0 <= 0 || usado) return;
      const k = distancia(e.touches) / d0;
      if (k > 1.15 && !zoomRef.current) {
        usado = true;
        acercar({ x: 0.5, y: 0.5 });
      } else if (k < 0.85 && zoomRef.current) {
        usado = true;
        setZoom(false);
      }
    };
    const alEmpezar = (e: Event) => {
      e.preventDefault();
      usado = false;
    };
    const alCambiar = (e: Event) => {
      e.preventDefault();
      if (usado) return;
      const escala = (e as unknown as { scale: number }).scale;
      if (escala > 1.15 && !zoomRef.current) {
        usado = true;
        acercar({ x: 0.5, y: 0.5 });
      } else if (escala < 0.85 && zoomRef.current) {
        usado = true;
        setZoom(false);
      }
    };
    raiz.addEventListener("touchstart", alTocar, { passive: true });
    raiz.addEventListener("touchmove", alMoverDedos, { passive: true });
    raiz.addEventListener("gesturestart", alEmpezar);
    raiz.addEventListener("gesturechange", alCambiar);
    return () => {
      raiz.removeEventListener("touchstart", alTocar);
      raiz.removeEventListener("touchmove", alMoverDedos);
      raiz.removeEventListener("gesturestart", alEmpezar);
      raiz.removeEventListener("gesturechange", alCambiar);
    };
  }, [acercar]);

  return createPortal(
    <div ref={dialogo} className="visor" role="dialog" aria-modal="true" aria-label="Fotos de la prenda">
      <div className="visor__barra">
        <p className="eyebrow visor__contador" aria-hidden="true">
          {total > 1 ? `${actual + 1} / ${total}` : ""}
        </p>
        <button ref={cerrarBoton} type="button" className="visor__cerrar" onClick={cerrar} aria-label="Cerrar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
          </svg>
        </button>
      </div>
      {total > 1 && (
        <p className="sr-only" aria-live="polite">
          {`Foto ${actual + 1} de ${total}: ${fotos[actual].alt}`}
        </p>
      )}
      <div ref={pista} className={`visor__pista${zoom ? " visor__pista--zoom" : ""}`}>
        {fotos.map((foto, i) => {
          const esta = i === actual;
          const acercada = esta && zoom;
          const escala = `${Math.round(factor * 100)}%`;
          return (
            <div key={foto.src} className="visor__foto" aria-hidden={esta ? undefined : true}>
              <div
                ref={(el) => {
                  areas.current[i] = el;
                }}
                className={`visor__area${acercada ? " visor__area--zoom" : ""}`}
              >
                <button
                  ref={(el) => {
                    botones.current[i] = el;
                  }}
                  type="button"
                  className="visor__boton"
                  tabIndex={esta ? 0 : -1}
                  aria-label={`${acercada ? "Alejar" : "Acercar"} la foto: ${foto.alt}`}
                  onClick={alternar}
                  style={acercada ? { width: escala, height: escala } : undefined}
                >
                  {previas[i] && (
                    // eslint-disable-next-line @next/next/no-img-element -- copia ya descargada, no se optimiza de nuevo
                    <img className="visor__previa" src={previas[i]} alt="" aria-hidden="true" />
                  )}
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    sizes={acercada ? `${Math.round(factor * 100)}vw` : "100vw"}
                    quality={70}
                    loading={Math.abs(i - actual) <= 1 ? "eager" : "lazy"}
                    decoding={acercada ? "sync" : undefined}
                    style={{ objectFit: "contain" }}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>,
    document.body
  );
}
