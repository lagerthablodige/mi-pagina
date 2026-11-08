import Image from "next/image";
import NewsletterForm from "./NewsletterForm";
import TrackedLink from "./TrackedLink";
import { CALENDLY_HREF, INSTAGRAM_HREF, WHATSAPP_HREF } from "./links";

// Pie de página (fondo tinta). Lleva espacio abajo en el celular para que la barra fija no tape nada.
export default function Pie() {
  return (
    <footer className="pie fondo-oscuro">
      <div className="pie__interior">
        <Image src="/logo-mark.png" alt="" width={64} height={42} sizes="64px" className="pie__nudo" />
        <p className="pie__frase">Mongolia como origen. El lujo como visión.</p>

        <div className="pie__correo">
          <p className="eyebrow pie__correo-titulo">Déjanos tu correo</p>
          <NewsletterForm />
        </div>

        <ul className="pie__enlaces">
          <li>
            <a href={INSTAGRAM_HREF} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <TrackedLink
              href={WHATSAPP_HREF}
              eventName="whatsapp_click"
              eventData={{ location: "footer" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </TrackedLink>
          </li>
          <li>
            <TrackedLink
              href={CALENDLY_HREF}
              eventName="calendly_click"
              eventData={{ location: "footer" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Agenda tu visita
            </TrackedLink>
          </li>
        </ul>

        <p className="pie__legal">© 2026 Nirün</p>
      </div>
    </footer>
  );
}
