import type { Metadata } from "next";
import Link from "next/link";
import Encabezado from "./Encabezado";
import TrackedLink from "./TrackedLink";
import { WHATSAPP_HREF } from "./links";

// M38: la 404 con su propio título y sin el canonical del inicio. Sin robots aquí: Next ya agrega
// <meta name="robots" content="noindex"> a toda respuesta 404, y así queda uno solo.
export const metadata: Metadata = {
  title: "Página no encontrada | Nirün",
  alternates: { canonical: null },
};

// Página 404: sobria, con el mismo encabezado del sitio.
export default function NotFound() {
  return (
    <>
      <Encabezado />
      <main id="contenido" tabIndex={-1} className="pagina-404">
        <div className="pagina-404__interior">
          <p className="eyebrow eyebrow--dorado">Error 404</p>
          <h1 className="titulo-seccion">Esta página no existe</h1>
          <p className="parrafo">Puede que el enlace haya cambiado.</p>
          <div className="pagina-404__botones">
            <Link href="/#coleccion" className="boton boton--tinta">
              Ver la colección
            </Link>
            <TrackedLink
              href={WHATSAPP_HREF}
              eventName="whatsapp_click"
              eventData={{ location: "404" }}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton--contorno"
            >
              WhatsApp
            </TrackedLink>
          </div>
        </div>
      </main>
    </>
  );
}
