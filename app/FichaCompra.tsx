"use client";

import Link from "next/link";
import { useState } from "react";
import BarraFija from "./BarraFija";
import TrackedLink from "./TrackedLink";
import { WhatsAppIcon } from "./Iconos";
import { CALENDLY_HREF, whatsappConMensaje } from "./links";
import { mensajeWhatsApp, precioCLP, type Pieza, type Producto } from "./products";

type Props = {
  producto: Producto;
  fibraLabel: string; // "YAK"
  fibraNombre: string; // "Yak"
  fibraIntro: string;
};

// Selector de talla con botones tipo radio (se maneja con teclado y lo lee el lector de pantalla).
function SelectorTalla({
  grupo,
  tallas,
  valor,
  alElegir,
}: {
  grupo: string;
  tallas: string[];
  valor: string | undefined;
  alElegir: (talla: string) => void;
}) {
  return (
    <fieldset className="tallas">
      <legend className="eyebrow tallas__titulo">Talla</legend>
      <div className="tallas__lista">
        {tallas.map((talla) => (
          <label key={talla} className="talla">
            <input type="radio" name={grupo} value={talla} checked={valor === talla} onChange={() => alElegir(talla)} />
            <span>{talla}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="dato">
      <dt className="eyebrow">{etiqueta}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Precio({ pieza }: { pieza: Pieza }) {
  return (
    <p className="ficha__precio">
      <span className="precio precio--grande">{precioCLP(pieza.precio)}</span>
      <span className="ficha__iva">IVA incluido</span>
    </p>
  );
}

// Datos de compra de la ficha: precio, color, talla y botones. Guarda la talla elegida y la usa en WhatsApp.
export default function FichaCompra({ producto, fibraLabel, fibraNombre, fibraIntro }: Props) {
  const [tallas, setTallas] = useState<Record<string, string>>({});
  const unaPieza = producto.piezas.length === 1;
  const waHref = whatsappConMensaje(mensajeWhatsApp(producto, tallas));
  const elegir = (pieza: Pieza) => (talla: string) => setTallas((t) => ({ ...t, [pieza.nombre]: talla }));

  return (
    <>
      <div className="ficha__info">
        <p className="eyebrow ficha__fibra">{fibraLabel}</p>
        <h1 className="ficha__titulo">{producto.nombreCorto}</h1>
        <p className="ficha__tipo">{producto.tipo}</p>

        {unaPieza ? (
          <>
            <Precio pieza={producto.piezas[0]} />
            <dl className="datos">
              <Dato etiqueta="Material">{producto.piezas[0].material}</Dato>
              <Dato etiqueta="Color">
                {producto.piezas[0].color}
                {producto.otroColor && (
                  <Link href={`/prenda/${producto.otroColor.slug}`} className="ficha__otro-color">
                    También en {producto.otroColor.color}
                  </Link>
                )}
              </Dato>
              {producto.piezas[0].tallas.length === 1 && <Dato etiqueta="Talla">{producto.piezas[0].tallas[0]}</Dato>}
            </dl>
            {producto.piezas[0].tallas.length > 1 && (
              <SelectorTalla
                grupo="talla"
                tallas={producto.piezas[0].tallas}
                valor={tallas[producto.piezas[0].nombre]}
                alElegir={elegir(producto.piezas[0])}
              />
            )}
          </>
        ) : (
          <>
            <p className="ficha__nota">Dos piezas que se venden por separado. Cada una tiene su precio.</p>
            {producto.piezas.map((pieza, i) => (
              <section key={pieza.nombre} className="ficha__pieza" aria-labelledby={`pieza-${i}`}>
                <h2 id={`pieza-${i}`} className="ficha__pieza-nombre">
                  {pieza.nombre}
                </h2>
                <Precio pieza={pieza} />
                <dl className="datos">
                  <Dato etiqueta="Material">{pieza.material}</Dato>
                  <Dato etiqueta="Color">{pieza.color}</Dato>
                </dl>
                {pieza.tallas.length > 1 ? (
                  <SelectorTalla grupo={`talla-${i}`} tallas={pieza.tallas} valor={tallas[pieza.nombre]} alElegir={elegir(pieza)} />
                ) : (
                  <dl className="datos">
                    <Dato etiqueta="Talla">{pieza.tallas[0]}</Dato>
                  </dl>
                )}
              </section>
            ))}
          </>
        )}

        <div className="ficha__botones">
          <TrackedLink
            href={CALENDLY_HREF}
            eventName="calendly_click"
            eventData={{ location: `prenda_${producto.slug}` }}
            target="_blank"
            rel="noopener noreferrer"
            className="boton boton--tinta"
          >
            Agenda tu visita para probártela
          </TrackedLink>
          <TrackedLink
            href={waHref}
            eventName="whatsapp_click"
            eventData={{ location: `prenda_${producto.slug}` }}
            target="_blank"
            rel="noopener noreferrer"
            className="boton boton--contorno"
          >
            <WhatsAppIcon color="currentColor" size={20} />
            Consultar por WhatsApp
          </TrackedLink>
        </div>

        <section className="ficha__bloque" aria-labelledby="como-comprar">
          <h2 id="como-comprar" className="eyebrow">
            Cómo comprar
          </h2>
          <p className="parrafo">Pruébala en el showroom de Landa Brands, Vitacura, solo con cita, o escríbenos por WhatsApp.</p>
        </section>

        <section className="ficha__bloque" aria-labelledby="sobre-fibra">
          <h2 id="sobre-fibra" className="eyebrow">
            Sobre el {fibraNombre}
          </h2>
          <p className="parrafo">{fibraIntro}</p>
        </section>
      </div>

      <BarraFija
        modo="ficha"
        whatsappHref={waHref}
        ubicacionAgenda={`prenda_sticky_${producto.slug}`}
        ubicacionWhatsapp={`prenda_sticky_${producto.slug}`}
      />
    </>
  );
}
