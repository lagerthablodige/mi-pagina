import type { Metadata } from "next";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nirun.cl"),
  title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia en Santiago",
  description:
    "Prendas de lujo elaboradas con Baby Camel, Cashmere, Yak y Seda, con certificación Mongolian Noble Fiber (MNF). Disponibles en el showroom de Landa Brands, Vitacura, Santiago.",
  keywords: [
    "cashmere Chile",
    "baby camel",
    "yak",
    "ropa de lujo Santiago",
    "showroom Vitacura",
    "Nirün",
  ],
  icons: {
    icon: "/logo.png?v=2",
  },
  openGraph: {
    title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia",
    description:
      "Prendas de lujo elaboradas con fibras naturales de Mongolia. Showroom en Vitacura, Santiago.",
    url: "https://www.nirun.cl",
    siteName: "Nirün",
    images: ["/fibers/collage/khulan_detail.jpg"],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nirün | Cashmere, Yak y Baby Camel de Mongolia",
    description:
      "Prendas de lujo elaboradas con fibras naturales de Mongolia. Showroom en Vitacura, Santiago.",
    images: ["/fibers/collage/khulan_detail.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
