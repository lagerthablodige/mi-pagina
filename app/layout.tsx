import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import Aparicion from "./Aparicion";
import EtiquetasClarity from "./EtiquetasClarity";
import { IMAGEN_GENERAL, OPEN_GRAPH_GENERAL } from "./compartir";
import "./globals.css";

// Títulos y wordmark: Cormorant Garamond. Texto, etiquetas, precios y botones: Instrument Sans.
// Los archivos están en app/fonts (ver LEEME.txt). Se usan locales porque next/font/google falla en este
// proyecto: Google Fonts ahora entrega las fuentes con una dirección que Next 15.5 no entiende (build con webpack)
// y el AVG de este PC corta la descarga (build con turbopack).
const cormorant = localFont({
  src: [{ path: "./fonts/cormorant-garamond-latin.woff2", weight: "300 700", style: "normal" }],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

// La cursiva se usa en el Origen y en «Sobre el …» de cada ficha (M28): no se precarga.
const cormorantCursiva = localFont({
  src: [{ path: "./fonts/cormorant-garamond-italic-latin.woff2", weight: "400", style: "italic" }],
  variable: "--font-cormorant-cursiva",
  display: "swap",
  preload: false,
  adjustFontFallback: "Times New Roman",
});

const instrument = localFont({
  src: [{ path: "./fonts/instrument-sans-latin.woff2", weight: "400 700", style: "normal" }],
  variable: "--font-instrument",
  display: "swap",
  adjustFontFallback: "Arial",
});

// Imagen para compartir el sitio (1200x630, ~150 KB): ver app/compartir.ts.
// public/og/nirun-og.jpg (la anterior) se queda en public para no romper las vistas previas ya compartidas.
const OG_IMAGE = IMAGEN_GENERAL;

export const viewport: Viewport = {
  themeColor: "#faf8f4",
  viewportFit: "cover", // para que env(safe-area-inset-bottom) funcione en la barra fija
  // M34: el sitio es solo claro; así el modo oscuro forzado de Android no invierte los colores.
  colorScheme: "only light",
};

// Datos estructurados para Google: marca, sitio y showroom (sin calle exacta: no inventar datos).
const SITE = "https://www.nirun.cl";
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Nirün",
      // Sin diéresis también, para que Google no confunda la marca al autocompletar.
      alternateName: ["Nirun", "nirun.cl"],
      url: SITE,
      logo: `${SITE}/logo.png`,
      description:
        "Marca de ropa de lujo en cashmere, yak y baby camel de Mongolia.",
      sameAs: ["https://www.instagram.com/nirun.cl/"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: "+56990911592",
        availableLanguage: "es",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "Nirün",
      alternateName: ["Nirun", "nirun.cl"],
      inLanguage: "es-CL",
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "ClothingStore",
      "@id": `${SITE}/#showroom`,
      name: "Nirün en el showroom de Landa Brands",
      url: SITE,
      image: `${SITE}${IMAGEN_GENERAL.url}`,
      description:
        "Prendas de cashmere, yak y baby camel de Mongolia para probar en persona en el showroom de Landa Brands, en Vitacura. Solo con cita.",
      telephone: "+56990911592",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Vitacura",
        addressRegion: "Región Metropolitana de Santiago",
        addressCountry: "CL",
      },
      areaServed: "Santiago, Chile",
      brand: { "@id": `${SITE}/#organization` },
      parentOrganization: { "@id": `${SITE}/#organization` },
      sameAs: ["https://www.instagram.com/nirun.cl/", "https://www.instagram.com/landa_brands/"],
      potentialAction: {
        "@type": "ReserveAction",
        name: "Agenda tu visita al showroom",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://calendly.com/ventas-landabrands/agendar-visita",
          actionPlatform: ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"],
        },
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nirun.cl"),
  title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia en Santiago",
  description:
    "Abrigos y prendas de lujo en yak, cashmere y baby camel de Mongolia. Pruébatelos con cita en el showroom de Landa Brands, en Vitacura, Santiago.",
  keywords: [
    "cashmere Chile",
    "baby camel",
    "yak",
    "ropa de lujo Santiago",
    "showroom Vitacura",
    "Nirün",
  ],
  // Sin canonical aquí: cada página declara el suyo (el inicio en app/page.tsx, las fichas en su generateMetadata).
  // Si estuviera aquí, una página nueva heredaría el canonical del inicio y quedaría fuera de Google.
  // Sin index/follow: es lo que Google hace por defecto, y así la 404 no queda con dos meta robots que se contradicen.
  robots: {
    googleBot: { "max-image-preview": "large" },
  },
  // Sin url en openGraph, por la misma razón que el canonical: las páginas nuevas no deben heredar la del inicio.
  // El inicio declara la suya en app/page.tsx (con el mismo OPEN_GRAPH_GENERAL de app/compartir.ts).
  openGraph: OPEN_GRAPH_GENERAL,
  twitter: {
    card: "summary_large_image",
    title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia",
    description:
      "Abrigos y prendas en yak, cashmere y baby camel, fibras nobles de Mongolia. Pruébatelos con cita en Vitacura.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${cormorant.variable} ${cormorantCursiva.variable} ${instrument.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Aparicion />
        <EtiquetasClarity />
        <Analytics />
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            if (location.hostname.endsWith("nirun.cl")) {
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "yxccu0h8wm");
            }
          `}
        </Script>
      </body>
    </html>
  );
}
