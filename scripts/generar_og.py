# Imagenes para compartir de nirun.cl (vista previa en WhatsApp, Instagram, iMessage y Facebook): 1200x630, JPG <= 150 KB.
#
#   python scripts/generar_og.py                      (lee public/ y escribe en public/og/)
#   python scripts/generar_og.py <public> <salida>
#
# Formato triptico: tres fotos verticales completas, separadas por filetes de 3 px color tinta, como el hero de PC.
# La foto del centro es la portada de la prenda: si WhatsApp recorta al cuadrado del centro, se ve la portada entera.
# Sin precios ni textos, asi no queda desfasada si cambia un precio.
# Las fotos se abren con abrir_srgb (las de estudio pueden venir en Adobe RGB) y se guardan en sRGB con perfil.
# Si se agrega una prenda en app/products.ts, sumarla en PRENDAS y volver a correr el script.
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image  # noqa: E402

from fotos_color import abrir_srgb, guardar_jpg  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
FILETE = 3
TINTA = (26, 26, 26)
PANEL = (W - 2 * FILETE) // 3  # 398
TOPE = 150_000  # bytes

# izquierda, centro (portada), derecha. Rutas relativas a public/.
F = "fibras"
PRENDAS = {
    "khulan": [f"{F}/yak/khulan/_84A5147.jpg", f"{F}/yak/khulan/_84A5137.jpg", f"{F}/yak/khulan/_84A5228.jpg"],
    "nomin-azul-oscuro": [f"{F}/yak/nomin-azul/_84A4609.jpg", f"{F}/yak/nomin-azul/playa-portada.jpg", f"{F}/yak/nomin-azul/_84A4773.jpg"],
    "nomin-negro": [f"{F}/yak/nomin-negro/_84A6480.jpg", f"{F}/yak/nomin-negro/_84A6395.jpg", f"{F}/yak/nomin-negro/_84A6582.jpg"],
    "zaya": [f"{F}/cashmere/zaya/_84A4954.jpg", f"{F}/cashmere/zaya/_84A4890.jpg", f"{F}/cashmere/zaya/_84A5104.jpg"],
    "bolomaa": [f"{F}/baby-camel/bolomaa/_84A5572.jpg", f"{F}/baby-camel/bolomaa/_84A5651.jpg", f"{F}/baby-camel/bolomaa/_84A5765.jpg"],
    "erdene": [f"{F}/baby-camel/erdene/_84A6318.jpg", f"{F}/baby-camel/erdene/_84A5968.jpg", f"{F}/baby-camel/erdene/_84A6178.jpg"],
    "sernai": [f"{F}/baby-camel/sernai/_84A5841.jpg", f"{F}/baby-camel/sernai/_84A5877.jpg", f"{F}/baby-camel/sernai/_84A5826.jpg"],
    "sernai-silk": [f"{F}/baby-camel/sernai-silk/_84A6029.jpg", f"{F}/baby-camel/sernai-silk/_84A5995.jpg", f"{F}/baby-camel/sernai-silk/_84A6248.jpg"],
}
# Inicio: las mismas tres fotos del hero de PC, en el mismo orden.
INICIO = ["portada/cardigan.jpg", "portada/columnas.jpg", "portada/rocas.jpg"]


def panel(public, ruta):
    im = abrir_srgb(os.path.join(public, ruta))
    # Alto completo (la prenda entera se ve) y recorte lateral centrado.
    im = im.resize((round(im.width * H / im.height), H), Image.LANCZOS)
    x = (im.width - PANEL) // 2
    return im.crop((x, 0, x + PANEL, H))


def triptico(public, rutas):
    lienzo = Image.new("RGB", (W, H), TINTA)
    for n, r in enumerate(rutas):
        lienzo.paste(panel(public, r), (n * (PANEL + FILETE), 0))
    return lienzo


def slugs_del_catalogo():
    try:
        with open(os.path.join(RAIZ, "app", "products.ts"), encoding="utf-8") as f:
            return set(re.findall(r'^\s+slug: "([^"]+)"', f.read(), re.M))
    except OSError:
        return set()


def main(public, salida):
    os.makedirs(os.path.join(salida, "prenda"), exist_ok=True)
    q, peso = guardar_jpg(triptico(public, INICIO), os.path.join(salida, "nirun-og-v2.jpg"), TOPE, 84, 60)
    print(f"nirun-og-v2.jpg  q{q}  {peso // 1024} KB")
    for slug, rutas in PRENDAS.items():
        q, peso = guardar_jpg(triptico(public, rutas), os.path.join(salida, "prenda", f"{slug}.jpg"), TOPE, 84, 60)
        print(f"prenda/{slug}.jpg  q{q}  {peso // 1024} KB")
    faltan = slugs_del_catalogo() - set(PRENDAS)
    if faltan:
        print("Aviso: estas prendas de products.ts no tienen imagen propia (usan la del inicio):", ", ".join(sorted(faltan)))


if __name__ == "__main__":
    publico = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "public")
    main(publico, sys.argv[2] if len(sys.argv) > 2 else os.path.join(publico, "og"))
