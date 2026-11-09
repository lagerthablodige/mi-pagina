# Tratamiento de color de las fotos del sitio (M21 y M26, noviembre de 2026). Se corre UNA vez sobre los originales.
#
#   python scripts/tratar_fotos.py <public con los originales> <public de destino> [parte de la ruta ...]
#   (con partes de ruta, solo trata las fotos cuya ruta contenga alguna; por ejemplo: playa-portada)
#
# Los originales sin tratar estan en el commit 35c2086. Para sacarlos a una carpeta aparte:
#   git archive 35c2086 public | tar -x -C <carpeta>
# No correrlo dos veces sobre las mismas fotos: el grado de las fotos de Mongolia se sumaria.
#
# 1) Fotos de estudio (public/hero y public/fibers): el muro gris lila pasa a gris calido con quitar_lila.
#    Las prendas no cambian de color. Dos portadas se recortan para sacar la junta oscura del muro del borde de arriba.
#    La portada de Nomin azul (playa) es de exterior y no tiene el muro lila: solo se baja el cielo quemado con techo_luces.
#    (quitar_lila ahi solo movia el azul del abrigo: deltaE 1,05 en la prenda, sobre el limite de 1).
# 2) Fotos de Mongolia (public/origen): yak, cabras y camellos con el mismo grado (gradar_banco).
#    La ger al amanecer no se toca. Se agrega un recorte vertical de la ger para el celular.
# Toda foto sale en sRGB con perfil y nunca pesa mas que su original.
import glob
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fotos_color import abrir_srgb, gradar_banco, guardar_jpg, por_franjas, quitar_lila, techo_luces  # noqa: E402

# Recortes (x0, y0, x1, y1) en pixeles del original, para sacar la junta del muro del borde superior. Quedan en 2:3.
RECORTES = {
    "fibers/yak/nomin-negro/_84A6395.jpg": (25, 75, 1974, 2999),  # 1949x2924
    "fibers/baby-camel/sernai-silk/_84A5995.jpg": (32, 88, 1640, 2500),  # 1608x2412
}
CIELO = {"fibers/yak/nomin-azul/playa-portada.jpg"}
BANCO = ["origen/yak.jpg", "origen/cabras.jpg", "origen/camellos.jpg"]
# Ger para el celular: el mismo centro que mostraba object-position 80% (x = 1626 en la foto de 2400 px).
GER = "origen/ger-amanecer.jpg"
GER_MOVIL = "origen/ger-amanecer-movil.jpg"
GER_CAJA = (1026, 0, 2226, 1799)


def main(origen, destino, solo=()):
    if os.path.abspath(origen) == os.path.abspath(destino):
        raise SystemExit("El origen y el destino deben ser carpetas distintas (el tratamiento no se puede repetir).")

    def guardar(im, rel, calidad_max=90, tope_de=None):
        dst = os.path.join(destino, rel)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        tope = os.path.getsize(os.path.join(origen, tope_de or rel))
        q, peso = guardar_jpg(im, dst, tope_bytes=tope, calidad_max=calidad_max)
        print(f"{rel:48s} {im.size[0]}x{im.size[1]}  q{q}  {tope // 1024:>5} KB -> {peso // 1024:>5} KB")

    estudio = sorted(
        os.path.relpath(p, origen).replace("\\", "/")
        for p in glob.glob(os.path.join(origen, "hero", "*.jpg"))
        + glob.glob(os.path.join(origen, "fibers", "**", "*.jpg"), recursive=True)
    )
    if solo:
        estudio = [r for r in estudio if any(s in r for s in solo)]
    for rel in estudio:
        im = abrir_srgb(os.path.join(origen, rel))
        if rel in RECORTES:
            im = im.crop(RECORTES[rel])
        if rel in CIELO:
            im = por_franjas(im, techo_luces)
        else:
            im = por_franjas(im, quitar_lila)
        guardar(im, rel)

    for rel in BANCO:
        if solo and not any(s in rel for s in solo):
            continue
        guardar(gradar_banco(abrir_srgb(os.path.join(origen, rel))), rel)

    if solo and not any(s in GER_MOVIL for s in solo):
        return
    ger = abrir_srgb(os.path.join(origen, GER)).crop(GER_CAJA)
    guardar(ger, GER_MOVIL, calidad_max=85, tope_de=GER)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit("uso: python scripts/tratar_fotos.py <public con los originales> <public de destino>")
    main(sys.argv[1], sys.argv[2], tuple(sys.argv[3:]))
