import Image from "next/image";
import NewsletterForm from "./NewsletterForm";
import TrackedLink from "./TrackedLink";
import { CALENDLY_HREF, INSTAGRAM_HREF, WHATSAPP_HREF } from "./links";

type Props = {
  // En la ficha lleva el mensaje con la prenda; si no se pasa, el general.
  whatsappHref?: string;
};

// Pie de página (fondo tinta). En el celular la barra fija se esconde antes de que entre el pie (ver BarraFija),
// así que el pie no reserva espacio para ella.
export default function Pie({ whatsappHref = WHATSAPP_HREF }: Props) {
  return (
    <footer className="pie fondo-oscuro">
      <div className="pie__interior">
        <Image src="/logo-mark.png" alt="" width={64} height={42} sizes="64px" className="pie__nudo" />
        <p className="pie__frase">Mongolia como origen. El lujo como visión.</p>

        <div className="pie__correo" id="correo">
          <p className="eyebrow pie__correo-titulo">Déjanos tu correo</p>
          <NewsletterForm />
        </div>

        <ul className="pie__enlaces">
          <li>
            <TrackedLink
              href={INSTAGRAM_HREF}
              eventName="instagram_click"
              eventData={{ location: "footer" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </TrackedLink>
          </li>
          <li>
            <TrackedLink
              href={whatsappHref}
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

        {/* Solo datos ya publicados. El año sale de la fecha del build: se actualiza solo con el próximo deploy.
            En el celular el © va en su propia línea y el punto medio de antes se esconde (M33). Los espacios
            duros (\u00a0) dejan cada «·» pegado a la palabra anterior y el © junto al año y a Nirün. */}
        <p className="pie__legal">
          <span className="pie__legal-texto">
            {"Showroom Landa Brands, Vitacura\u00a0· Solo con cita"}
            <span className="pie__legal-sep">{"\u00a0· "}</span>
            <span className="pie__legal-copy">{`©\u00a0${new Date().getFullYear()}\u00a0Nirün`}</span>
          </span>
        </p>
      </div>
    </footer>
  );
}
