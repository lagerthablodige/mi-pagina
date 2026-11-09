"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import TrackedLink from "./TrackedLink";
import { CALENDLY_HREF, INSTAGRAM_HREF, WHATSAPP_HREF } from "./links";
import { InstagramIcon, WhatsAppIcon } from "./Iconos";
import { useCerrarConAtras } from "./useCerrarConAtras";

const ENLACES = [
  { href: "/#coleccion", texto: "Colección" },
  { href: "/#fibras", texto: "Las fibras" },
  { href: "/#origen", texto: "Origen" },
  { href: "/#showroom", texto: "Showroom" },
];

const FOCUSABLES = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

// === M09 === Duración del fundido de salida del menú (igual que menu-sale en globals.css).
const SALIDA_MENU_MS = 320;
// Después de saltar a una sección, el encabezado del celular no reaparece por el scroll del salto.
const PAUSA_TRAS_SALTO_MS = 1200;

// Clic con Ctrl, Cmd, Shift o botón del medio: se deja al navegador (pestaña nueva, etc.).
function esClicEspecial(ev: ReactMouseEvent<HTMLAnchorElement>) {
  return ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey;
}

function pideMenosMovimiento() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type Props = {
  // Enlace de "volver" que en el celular ocupa el lado izquierdo (en PC se muestra aparte, en la página).
  volver?: { href: string; texto: string };
  // WhatsApp del ícono de PC y del menú. En la ficha lleva el mensaje con la prenda; si no se pasa, el general.
  whatsappHref?: string;
};

// Encabezado de todas las páginas. En el celular el menú abre una pantalla completa y la barra se esconde al bajar
// (y reaparece al subir); en PC los enlaces van en línea y la barra queda fija.
export default function Encabezado({ volver, whatsappHref = WHATSAPP_HREF }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [escondido, setEscondido] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const estabaAbierto = useRef(false);
  const saltando = useRef(0);
  // Si la sección de destino reserva lugar para el encabezado (scroll-margin), tras el salto el encabezado se ve.
  const mostrarTrasSalto = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  const cerrar = useCallback(() => setAbierto(false), []);
  // El menú abierto ocupa una entrada del historial: «Atrás» lo cierra sin salir del sitio.
  const empujado = useCerrarConAtras(abierto, cerrar);

  // Celular: se esconde al bajar y vuelve al subir. En PC no se esconde nunca.
  useEffect(() => {
    let anterior = window.scrollY;
    let pendiente = 0;
    const revisar = () => {
      const y = window.scrollY;
      // === M09 === Justo después de saltar a una sección, el encabezado del celular queda escondido aunque el salto
      // haya sido hacia arriba: así no tapa el título de la sección.
      if (Date.now() - saltando.current < PAUSA_TRAS_SALTO_MS) {
        setEscondido(window.innerWidth < 1024 && y >= 80 && !mostrarTrasSalto.current);
        anterior = y;
        return;
      }
      if (window.innerWidth >= 1024 || y < 80) setEscondido(false);
      else if (y > anterior + 6) setEscondido(true);
      else if (y < anterior - 6) setEscondido(false);
      anterior = y;
    };
    const alMover = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(revisar);
    };
    window.addEventListener("scroll", alMover, { passive: true });
    return () => {
      cancelAnimationFrame(pendiente);
      window.removeEventListener("scroll", alMover);
    };
  }, []);

  useEffect(() => {
    if (!abierto) {
      // Al cerrar, el foco vuelve al botón "Menú".
      if (estabaAbierto.current) botonMenu.current?.focus();
      estabaAbierto.current = false;
      return;
    }
    estabaAbierto.current = true;
    const html = document.documentElement;
    const overflowAntes = html.style.overflow;
    html.style.overflow = "hidden"; // el fondo no se mueve mientras el menú está abierto
    botonCerrar.current?.focus();

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      // El foco da la vuelta dentro del menú.
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLES));
      if (items.length === 0) return;
      const primero = items[0];
      const ultimo = items[items.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };
    // Si se agranda la ventana hasta PC con el menú abierto, se cierra solo.
    const alCambiarTamano = window.matchMedia("(min-width: 1024px)");
    const alCruzar = (e: MediaQueryListEvent) => {
      if (e.matches) setAbierto(false);
    };
    document.addEventListener("keydown", alTeclear);
    alCambiarTamano.addEventListener("change", alCruzar);
    return () => {
      html.style.overflow = overflowAntes;
      document.removeEventListener("keydown", alTeclear);
      alCambiarTamano.removeEventListener("change", alCruzar);
    };
  }, [abierto]);

  // === M09 === Lleva a una sección del inicio sin recorrer todo lo de en medio y deja el foco en ella, así Tab
  // y el lector de pantalla siguen desde ahí.
  const saltarA = (destino: HTMLElement, suave: boolean) => {
    saltando.current = Date.now();
    // #coleccion reserva en el celular el alto del encabezado: si el encabezado se escondiera, quedaría una franja
    // con los botones del hero cortados. Las secciones sin reserva siguen con el encabezado escondido.
    const reserva = parseFloat(getComputedStyle(destino).scrollMarginTop) > 0;
    mostrarTrasSalto.current = reserva;
    if (reserva) setEscondido(false);
    if (suave) {
      destino.scrollIntoView({ behavior: pideMenosMovimiento() ? "auto" : "smooth", block: "start" });
    } else {
      const html = document.documentElement;
      const antes = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      destino.scrollIntoView({ block: "start" });
      html.style.scrollBehavior = antes;
    }
    destino.setAttribute("tabindex", "-1");
    destino.focus({ preventScroll: true });
  };

  // Sección del inicio a la que apunta un enlace, si ya estamos en el inicio.
  const seccionDe = (href: string) => {
    const id = href.split("#")[1];
    const destino = pathname === "/" && id ? document.getElementById(id) : null;
    return destino ? { id, destino } : null;
  };

  // Enlaces del menú del celular. En el inicio, el salto ocurre detrás del menú opaco y luego el menú se desvanece
  // sobre la sección; la entrada del menú en el historial pasa a ser /#seccion, así «Atrás» vuelve al inicio y no
  // reabre el menú. Desde otra página, se reemplaza la entrada del menú por la página de destino.
  const irA = (href: string) => (ev: ReactMouseEvent<HTMLAnchorElement>) => {
    if (esClicEspecial(ev)) return;
    ev.preventDefault();
    empujado.current = false;
    const seccion = seccionDe(href);
    if (!seccion) {
      setAbierto(false);
      router.replace(href);
      return;
    }
    // Sin copiar history.state: Next agrega lo suyo y sincroniza su URL.
    history.replaceState({}, "", `#${seccion.id}`);
    saltarA(seccion.destino, false);
    estabaAbierto.current = false; // el foco queda en la sección, no vuelve al botón «Menú»
    setSaliendo(true);
    window.setTimeout(
      () => {
        setSaliendo(false);
        setAbierto(false);
      },
      pideMenosMovimiento() ? 0 : SALIDA_MENU_MS,
    );
  };

  // Enlaces del encabezado de PC: en el inicio, el mismo salto (suave) con su entrada en el historial.
  const irEnPc = (href: string) => (ev: ReactMouseEvent<HTMLAnchorElement>) => {
    if (esClicEspecial(ev)) return;
    const seccion = seccionDe(href);
    if (!seccion) return; // desde otra página, la navegación normal de Next
    ev.preventDefault();
    // Como un enlace normal: la misma sección dos veces no agrega otra entrada al historial.
    if (window.location.hash !== `#${seccion.id}`) history.pushState(null, "", `#${seccion.id}`);
    saltarA(seccion.destino, true);
  };

  return (
    <>
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>
      <header className={`encabezado${escondido && (!abierto || saliendo) ? " encabezado--oculto" : ""}`}>
        <div className="encabezado__interior">
          {volver && (
            <Link href={volver.href} className="encabezado__volver">
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
                <path d="M17 6H1M5.5 1.5 1 6l4.5 4.5" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="encabezado__volver-texto">{volver.texto}</span>
            </Link>
          )}
          <nav className="encabezado__enlaces" aria-label="Principal">
            <ul>
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} onClick={irEnPc(e.href)}>
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="encabezado__marca" aria-label="Nirün, ir al inicio">
            {/* M05: eager y no priority, para no sumar un preload que compita con la foto principal */}
            <Image src="/logo-mark.png" alt="" width={32} height={21} sizes="32px" loading="eager" />
            <span className="wordmark">NIRÜN</span>
          </Link>

          <div className="encabezado__acciones">
            <TrackedLink
              href={CALENDLY_HREF}
              eventName="calendly_click"
              eventData={{ location: "header_desktop" }}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton--contorno boton--chico encabezado__agenda"
            >
              Agenda tu visita
            </TrackedLink>
            <TrackedLink
              href={whatsappHref}
              eventName="whatsapp_click"
              eventData={{ location: "header_desktop" }}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escríbenos por WhatsApp"
              className="encabezado__whatsapp"
            >
              <WhatsAppIcon color="currentColor" size={22} />
            </TrackedLink>
            <button
              ref={botonMenu}
              type="button"
              className="encabezado__menu"
              aria-haspopup="dialog"
              aria-expanded={abierto}
              aria-controls={abierto ? "menu-movil" : undefined}
              onClick={() => setAbierto(true)}
            >
              Menú
            </button>
          </div>
        </div>
      </header>

      {abierto && (
        <div
          ref={panel}
          id="menu-movil"
          className={`menu${saliendo ? " menu--saliendo" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <div className="menu__barra">
            <span className="wordmark menu__marca">NIRÜN</span>
            <button ref={botonCerrar} type="button" className="menu__cerrar" onClick={cerrar} aria-label="Cerrar menú">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 5 L19 19 M19 5 L5 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
              </svg>
            </button>
          </div>

          <nav aria-label="Menú principal">
            <ul className="menu__lista">
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} onClick={irA(e.href)}>
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu__pie">
            <TrackedLink
              href={CALENDLY_HREF}
              eventName="calendly_click"
              eventData={{ location: "menu" }}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton--marfil"
            >
              Agenda tu visita
            </TrackedLink>
            <TrackedLink
              href={whatsappHref}
              eventName="whatsapp_click"
              eventData={{ location: "menu" }}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton--contorno-marfil"
            >
              WhatsApp
            </TrackedLink>
            <TrackedLink
              href={INSTAGRAM_HREF}
              eventName="instagram_click"
              eventData={{ location: "menu" }}
              target="_blank"
              rel="noopener noreferrer"
              className="menu__instagram"
            >
              <InstagramIcon color="currentColor" size={20} />
              Instagram
            </TrackedLink>
          </div>
        </div>
      )}
    </>
  );
}
