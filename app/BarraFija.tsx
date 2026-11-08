"use client";

import { useEffect, useState } from "react";
import TrackedLink from "./TrackedLink";
import { CALENDLY_HREF } from "./links";
import { WhatsAppIcon } from "./Iconos";

type Props = {
  // En el inicio aparece sola cuando el hero sale de la pantalla; en la ficha se ve siempre.
  modo: "inicio" | "ficha";
  whatsappHref: string;
  ubicacionAgenda: string; // eventData.location de Calendly
  ubicacionWhatsapp: string; // eventData.location de WhatsApp
};

// Barra fija inferior del celular: Agenda tu visita + WhatsApp. En PC no existe.
export default function BarraFija({ modo, whatsappHref, ubicacionAgenda, ubicacionWhatsapp }: Props) {
  const [visible, setVisible] = useState(modo === "ficha");

  useEffect(() => {
    if (modo !== "inicio") return;
    const hero = document.getElementById("inicio");
    if (!hero) {
      setVisible(true);
      return;
    }
    // Aparece cuando el hero ya quedó arriba, fuera de la pantalla.
    const observador = new IntersectionObserver(
      ([entrada]) => setVisible(!entrada.isIntersecting && entrada.boundingClientRect.bottom <= 0),
      { threshold: 0 }
    );
    observador.observe(hero);
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
        className="boton boton--marfil barra-fija__agenda"
      >
        Agenda tu visita
      </TrackedLink>
      <TrackedLink
        href={whatsappHref}
        eventName="whatsapp_click"
        eventData={{ location: ubicacionWhatsapp }}
        target="_blank"
        rel="noopener noreferrer"
        className="boton boton--contorno-marfil barra-fija__whatsapp"
      >
        <WhatsAppIcon color="currentColor" size={20} />
        WhatsApp
      </TrackedLink>
    </div>
  );
}
