import Image from "next/image";
import Link from "next/link";
import { etiquetaPieza, fibraDe, fotosDe, precioCLP, type Producto } from "./products";

type Props = {
  producto: Producto;
  prioridad?: boolean; // foto cargada de inmediato (solo si la tarjeta está en la primera pantalla)
};

// Tarjeta de prenda: la foto manda; debajo, fibra, nombre, tipo y precio. Toda la tarjeta enlaza a la ficha.
export default function TarjetaPrenda({ producto, prioridad = false }: Props) {
  const fotos = fotosDe(producto);
  const fibra = fibraDe(producto);
  const portada = fotos[producto.portada];
  const segunda = fotos[producto.segunda];
  // "Nomín · Azul oscuro": el nombre va en el título y el color pasa a la línea del tipo
  const [nombre, variante] = producto.nombreCorto.split(" · ");
  const color = producto.otroColor ? ` ${producto.piezas[0].color.toLowerCase()}` : "";
  const sizes = "(min-width: 1024px) 22vw, (min-width: 768px) 23vw, 46vw";

  return (
    <Link href={`/prenda/${producto.slug}`} className="tarjeta">
      <div className="tarjeta__foto">
        <Image
          src={portada}
          alt={`${producto.nombre}${color}, foto de portada`}
          fill
          sizes={sizes}
          quality={70}
          priority={prioridad}
          className="tarjeta__img"
        />
        {/* Segunda foto: solo existe en pantallas con mouse (el CSS la oculta en el celular, así no se descarga). */}
        <Image src={segunda} alt="" fill sizes={sizes} quality={70} loading="lazy" className="tarjeta__img tarjeta__img--segunda" />
      </div>
      <p className="eyebrow tarjeta__fibra">{fibra.label}</p>
      <h3 className="tarjeta__nombre">{nombre}</h3>
      <p className="tarjeta__tipo">{variante ? `${variante} · ${producto.tipo}` : producto.tipo}</p>
      <div className="tarjeta__precios">
        {producto.piezas.length === 1 ? (
          // Una sola pieza: el precio y "IVA incluido" van juntos (en dos líneas si no caben)
          <p className="tarjeta__linea-precio">
            <span className="precio">{precioCLP(producto.piezas[0].precio)}</span>
            <span className="tarjeta__iva">IVA incluido</span>
          </p>
        ) : (
          <>
            {producto.piezas.map((pieza) => (
              <p key={pieza.nombre} className="precio">
                <span className="precio__pieza">{etiquetaPieza(pieza)}</span> {precioCLP(pieza.precio)}
              </p>
            ))}
            <p className="tarjeta__iva">IVA incluido</p>
          </>
        )}
      </div>
    </Link>
  );
}
