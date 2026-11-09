import { Fragment } from "react";
import { etiquetaPieza, precioCLP, type Producto } from "./products";

// Precio en una sola línea, igual que precioEnLinea() de products.ts: "$980.000" o "Chaqueta $450.000 · Falda $250.000".
// Sin "Desde": la foto de Sernaí Silk muestra el conjunto y un "Desde" se leería como su precio.
// Cada pieza va entera ("Chaqueta $450.000"): si la línea no cabe, se corta solo entre piezas.
export default function PrecioPiezas({ producto }: { producto: Producto }) {
  if (producto.piezas.length === 1) return <>{precioCLP(producto.piezas[0].precio)}</>;
  return (
    <>
      {producto.piezas.map((pieza, i) => (
        <Fragment key={pieza.nombre}>
          {i > 0 && " · "}
          <span className="precio__parte">
            {etiquetaPieza(pieza)} {precioCLP(pieza.precio)}
          </span>
        </Fragment>
      ))}
    </>
  );
}
