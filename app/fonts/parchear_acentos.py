# Corrige la posición del acento agudo de á é í ó ú (minúsculas) en Cormorant Garamond (variable, woff2).
# Basado en mover_acentos.py del revisor de diseño. Necesita fonttools y brotli.
#
# Uso: python parchear_acentos.py ORIGINAL_DE_GOOGLE.woff2 salida.woff2
#
# IMPORTANTE: la entrada tiene que ser SIEMPRE el archivo ORIGINAL de Google Fonts, nunca el del sitio (que ya está
# parchado). El original está guardado junto a este script, en
#   original-google/cg-var-google.woff2
# (SHA-256 d80df8ff5aecd299a61549f9e29ab1ed0b9b05f4ea71d50fe978e07d5240b235). Si se perdiera, LEEME.txt explica cómo
# volver a bajarlo. El script revisa la é antes de tocar nada y se detiene si el acento ya parece corrido.
#
# Corrimientos en unidades de la fuente (1000 por eme), medidos contra la letra base y contra Georgia, Garamond y
# Book Antiqua: la á del original ya está bien (0); é, í, ó y ú quedaban corridas a la derecha.
import hashlib
import sys

from fontTools.ttLib import TTFont

DX = {"aacute": 0, "eacute": -60, "iacute": -30, "oacute": -33, "uacute": -18}
SHA_GOOGLE = "d80df8ff5aecd299a61549f9e29ab1ed0b9b05f4ea71d50fe978e07d5240b235"


def contornos(glyf, nombre):
    g = glyf[nombre]
    coords, ends, _ = g.getCoordinates(glyf)
    starts = [0] + [e + 1 for e in ends[:-1]]
    return g, coords, [range(s, e + 1) for s, e in zip(starts, ends)]


def acento_de(coords, conts):
    return max(conts, key=lambda c: min(coords[i][1] for i in c))  # el contorno más alto es el acento


def desvio_e(glyf):
    # Centro del acento de la é menos centro de la e. En el original es cerca de +68; ya parchada queda cerca de +8.
    _, coords, conts = contornos(glyf, "eacute")
    ac = acento_de(coords, conts)
    xa = [coords[i][0] for i in ac]
    xb = [coords[i][0] for c in conts if c is not ac for i in c]
    return (min(xa) + max(xa)) / 2 - (min(xb) + max(xb)) / 2


if len(sys.argv) != 3:
    sys.exit("Uso: python parchear_acentos.py ORIGINAL_DE_GOOGLE.woff2 salida.woff2")

with open(sys.argv[1], "rb") as a:
    sha = hashlib.sha256(a.read()).hexdigest()
if sha != SHA_GOOGLE:
    print("Aviso: la entrada no es la copia conocida del original de Google (puede ser otra descarga).")

f = TTFont(sys.argv[1])
glyf = f["glyf"]
d = desvio_e(glyf)
if d < 40:
    sys.exit(f"Alto: el acento de la é ya está corrido ({d:+.0f}). Esta fuente ya fue parchada; parte del original de Google.")

for nombre, dx in DX.items():
    if not dx:
        continue
    g, coords, conts = contornos(glyf, nombre)
    for i in acento_de(coords, conts):
        coords[i] = (coords[i][0] + dx, coords[i][1])
    g.coordinates = coords
    g.recalcBounds(glyf)

f.flavor = "woff2"
f.save(sys.argv[2])
print("ok", sys.argv[2])
