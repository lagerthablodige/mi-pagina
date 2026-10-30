import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Imagen para compartir el link (1200x630, ~150 KB): WhatsApp e Instagram descartan imágenes muy pesadas.
const OG_IMAGE = {
  url: "/og/nirun-og.jpg",
  width: 1200,
  height: 630,
  alt: "Abrigo cruzado Nirün en lana y yak, detalle del tejido",
  type: "image/jpeg",
};

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
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
      url: SITE,
      logo: `${SITE}/logo.png`,
      description:
        "Marca de ropa de lujo en cashmere, yak y baby camel de Mongolia, con certificación Mongolian Noble Fiber (MNF).",
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
      inLanguage: "es-CL",
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "ClothingStore",
      "@id": `${SITE}/#showroom`,
      name: "Nirün en el showroom de Landa Brands",
      url: SITE,
      image: `${SITE}/og/nirun-og.jpg`,
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
          urlTemplate: "https://calendly.com/ventas-landabrands/visita-al-showroom-de-landa-brands-cl",
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
    "Prendas de lujo en Baby Camel, Cashmere, Yak y Seda con certificación Mongolian Noble Fiber (MNF). Showroom en Vitacura, Santiago.",
  keywords: [
    "cashmere Chile",
    "baby camel",
    "yak",
    "ropa de lujo Santiago",
    "showroom Vitacura",
    "Nirün",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { "max-image-preview": "large" },
  },
  openGraph: {
    title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia",
    description:
      "Prendas de lujo elaboradas con fibras naturales de Mongolia. Showroom en Vitacura, Santiago.",
    url: "/",
    siteName: "Nirün",
    images: [OG_IMAGE],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia",
    description:
      "Prendas de lujo elaboradas con fibras naturales de Mongolia. Showroom en Vitacura, Santiago.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "yxccu0h8wm");
          `}
        </Script>
      </body>
    </html>
  );
}
