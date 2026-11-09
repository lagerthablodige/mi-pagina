// Enlaces de contacto compartidos (inicio, fichas y página 404).
export const CALENDLY_HREF = "https://calendly.com/ventas-landabrands/agendar-visita";

// WhatsApp con un mensaje precargado, por ejemplo con el nombre de la prenda.
export const whatsappConMensaje = (mensaje: string) =>
  `https://wa.me/56990911592?text=${encodeURIComponent(mensaje)}`;

// Mensaje general (encabezado, menú, pie, inicio y 404): dice que viene de la web (M35).
// Va debajo de whatsappConMensaje a propósito: arriba, el módulo falla al cargar ("Cannot access before initialization").
export const WHATSAPP_HREF = whatsappConMensaje("Hola, vengo de nirun.cl y me gustaría recibir atención personalizada.");

export const INSTAGRAM_HREF = "https://www.instagram.com/nirun.cl/";
export const INSTAGRAM_LANDA_HREF = "https://www.instagram.com/landa_brands/";
