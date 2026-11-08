// Enlaces de contacto compartidos (inicio, fichas y página 404).
export const WHATSAPP_HREF =
  "https://wa.me/56990911592?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20atenci%C3%B3n%20personalizada%20para%20resolver%20algunas%20dudas.";
export const CALENDLY_HREF = "https://calendly.com/ventas-landabrands/visita-al-showroom-de-landa-brands-cl";

// WhatsApp con un mensaje precargado (mismo número que WHATSAPP_HREF), por ejemplo con el nombre de la prenda.
export const whatsappConMensaje = (mensaje: string) =>
  `https://wa.me/56990911592?text=${encodeURIComponent(mensaje)}`;

export const INSTAGRAM_HREF = "https://www.instagram.com/nirun.cl/";
export const INSTAGRAM_LANDA_HREF = "https://www.instagram.com/landa_brands/";
