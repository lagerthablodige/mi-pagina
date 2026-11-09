import { Fragment } from "react";
import { etiquetaPieza, precioCLP, type Producto } from "./products";

// Precio en una sola línea, igual que precioEnLinea() de products.ts: "$980.000" o "Chaqueta $450.000 · Falda $250.000".
// Sin "Desde": la foto de Sernaí Silk muestra el conjunto y un "Desde" se leería como su precio.
// Cada pieza va entera ("Chaqueta $450.000"). En la tarjeta y el índice, bajo 1280 px, cada pieza va en su línea y el
// punto medio se esconde (globals.css, bloque M10): así nunca queda colgando al final de una línea.
export default function PrecioPiezas({ producto }: { producto: Producto }) {
  if (producto.piezas.length === 1) return <>{precioCLP(producto.piezas[0].precio)}</>;
  return (
    <>
      {producto.piezas.map((pieza, i) => (
        <Fragment key={pieza.nombre}>
          {i > 0 && <span className="precio__sep"> · </span>}
          <span className="precio__parte">
            <span className="precio__pieza">{etiquetaPieza(pieza)}</span> {precioCLP(pieza.precio)}
          </span>
        </Fragment>
      ))}
    </>
  );
}
