"use client";

import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { conUtm, medirCta, paginaDe } from "./medicion";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  eventName: string; // calendly_click, whatsapp_click o instagram_click (los nombres no cambian, para no cortar la serie)
  eventData?: Record<string, string>; // { location }: tampoco cambia
  children: ReactNode;
};

// Enlace de contacto que se mide (M22). Agrega la prenda desde la ruta sin cambiar ninguna llamada:
// - Vercel y Clarity reciben el evento con { location, prenda }.
// - Los enlaces de Calendly llevan UTM, para que Landa Brands vea qué reservas vienen de nirun.cl y de qué botón.
export default function TrackedLink({ href, eventName, eventData, children, onClick, ...props }: Props) {
  const { prenda } = paginaDe(usePathname());
  const location = eventData?.location ?? "-";

  const alTocar = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    medirCta(eventName, location, prenda, eventData);
  };

  return (
    <a {...props} href={conUtm(href, location, prenda)} onClick={alTocar}>
      {children}
    </a>
  );
}
