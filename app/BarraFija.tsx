"use client";

import { useEffect, useState } from "react";
import TrackedLink from "./TrackedLink";
import { CALENDLY_HREF } from "./links";
import { WhatsAppIcon } from "./Iconos";

type Props = {
  // Inicio y ficha usan la misma barra; solo cambian los bloques que, si se ven, la esconden.
  modo: "inicio" | "ficha";
  whatsappHref: string;
  ubicacionAgenda: string; // eventData.location de Calendly
  ubicacionWhatsapp: string; // eventData.location de WhatsApp
};

// Bloques de la página que ya tienen los mismos botones: mientras alguno se ve, la barra no se muestra.
const BLOQUES_CON_BOTONES = [".hero__botones", ".showroom__botones", ".ficha__botones", ".pie"];

// Barra fija inferior del celular: Agenda tu visita + WhatsApp. En PC no existe.
export default function BarraFija({ modo, whatsappHref, ubicacionAgenda, ubicacionWhatsapp }: Props) {
  // Antes de saber qué se ve, en la ficha ya se muestra y en el inicio no (el hero trae sus botones).
  const [visible, setVisible] = useState(modo === "ficha");

  useEffect(() => {
    const bloques = BLOQUES_CON_BOTONES.flatMap((sel) => Array.from(document.querySelectorAll(sel)));
    if (bloques.length === 0) {
      setVisible(true);
      return;
    }
    const viendose = new Set<Element>();
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) viendose.add(entrada.target);
          else viendose.delete(entrada.target);
        }
        setVisible(viendose.size === 0);
      },
      { threshold: 0 }
    );
    bloques.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [modo]);

  return (
    <div className={`barra-fija${visible ? " barra-fija--visible" : ""}`} data-modo={modo} inert={!visible}>
      <TrackedLink
        href={CALENDLY_HREF}
        eventName="calendly_click"
        eventData={{ location: ubicacionAgenda }}
        target="_blank"
        rel="noopener noreferrer"
        className="boton boton--tinta barra-fija__agenda"
      >
        Agenda tu visita
      </TrackedLink>
      <TrackedLink
        href={whatsappHref}
        eventName="whatsapp_click"
        eventData={{ location: ubicacionWhatsapp }}
        target="_blank"
        rel="noopener noreferrer"
        className="boton boton--contorno barra-fija__whatsapp"
      >
        <WhatsAppIcon color="currentColor" size={20} />
        WhatsApp
      </TrackedLink>
    </div>
  );
}
