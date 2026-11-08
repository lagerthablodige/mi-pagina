"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import TrackedLink from "./TrackedLink";
import { CALENDLY_HREF, INSTAGRAM_HREF, WHATSAPP_HREF } from "./links";
import { InstagramIcon, WhatsAppIcon } from "./Iconos";

const ENLACES = [
  { href: "/#coleccion", texto: "Colección" },
  { href: "/#fibras", texto: "Las fibras" },
  { href: "/#origen", texto: "Origen" },
  { href: "/#showroom", texto: "Showroom" },
];

const FOCUSABLES = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

// Encabezado de todas las páginas. En el celular el menú abre una pantalla completa; en PC los enlaces van en línea.
export default function Encabezado() {
  const [abierto, setAbierto] = useState(false);
  const botonMenu = useRef<HTMLButtonElement>(null);
  const botonCerrar = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const estabaAbierto = useRef(false);

  const cerrar = useCallback(() => setAbierto(false), []);

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

  return (
    <>
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>
      <header className="encabezado">
        <div className="encabezado__interior">
          <nav className="encabezado__enlaces" aria-label="Principal">
            <ul>
              {ENLACES.map((e) => (
                <li key={e.href}>
                  <Link href={e.href}>{e.texto}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link href="/" className="encabezado__marca" aria-label="Nirün, ir al inicio">
            <Image src="/logo-mark.png" alt="" width={32} height={21} sizes="32px" />
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
              href={WHATSAPP_HREF}
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
              aria-controls="menu-movil"
              onClick={() => setAbierto(true)}
            >
              Menú
            </button>
          </div>
        </div>
      </header>

      {abierto && (
        <div ref={panel} id="menu-movil" className="menu" role="dialog" aria-modal="true" aria-label="Menú">
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
                  <Link href={e.href} onClick={cerrar}>
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
              href={WHATSAPP_HREF}
              eventName="whatsapp_click"
              eventData={{ location: "menu" }}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton--contorno-marfil"
            >
              <WhatsAppIcon color="currentColor" size={20} />
              WhatsApp
            </TrackedLink>
            <a href={INSTAGRAM_HREF} target="_blank" rel="noopener noreferrer" className="menu__instagram">
              <InstagramIcon color="currentColor" size={20} />
              Instagram
            </a>
          </div>
        </div>
      )}
    </>
  );
}
