import Image from "next/image";
import Link from "next/link";
import PrecioPiezas from "./PrecioPiezas";
import { fibraDe, fotosDe, tipoTarjetaDe, type Producto } from "./products";

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
  const sizes = "(min-width: 1024px) 22vw, (min-width: 768px) 23vw, 46vw";

  return (
    <Link href={`/prenda/${producto.slug}`} className="tarjeta">
      <div className="tarjeta__foto">
        {/* alt vacío: el enlace ya lee la fibra, el nombre, el tipo y el precio */}
        <Image src={portada} alt="" fill sizes={sizes} quality={70} priority={prioridad} className="tarjeta__img" />
        {/* Segunda foto: solo existe en pantallas con mouse (el CSS la oculta en el celular, así no se descarga). */}
        <Image src={segunda} alt="" fill sizes={sizes} quality={70} loading="lazy" className="tarjeta__img tarjeta__img--segunda" />
      </div>
      <p className="eyebrow tarjeta__fibra">{fibra.label}</p>
      <h3 className="tarjeta__nombre">{producto.nombreCorto}</h3>
      <p className="tarjeta__tipo">{tipoTarjetaDe(producto)}</p>
      <div className="tarjeta__precios">
        {/* Una sola línea de precio para todas. Sernaí Silk muestra sus dos piezas (sin "Desde": la foto es el conjunto). */}
        <p className="tarjeta__linea-precio">
          <span className="precio">
            <PrecioPiezas producto={producto} />
          </span>
          <span className="tarjeta__iva">IVA incluido</span>
        </p>
      </div>
    </Link>
  );
}
