# Mueve a la izquierda el acento agudo de á é í ó ú (minúsculas) en Cormorant Garamond (variable, woff2).
# Basado en mover_acentos.py del revisor de diseño. Uso: python parchear.py entrada.woff2 salida.woff2
import sys
from fontTools.ttLib import TTFont
DX = {"aacute": -45, "eacute": -60, "iacute": -58, "oacute": -55, "uacute": -50}
f = TTFont(sys.argv[1]); glyf = f["glyf"]
for nombre, dx in DX.items():
    g = glyf[nombre]; coords, ends, _ = g.getCoordinates(glyf)
    starts = [0] + [e + 1 for e in ends[:-1]]
    conts = [range(s, e + 1) for s, e in zip(starts, ends)]
    acento = max(conts, key=lambda c: min(coords[i][1] for i in c))  # el contorno más alto es el acento
    for i in acento: coords[i] = (coords[i][0] + dx, coords[i][1])
    g.coordinates = coords; g.recalcBounds(glyf)
f.flavor = "woff2"
f.save(sys.argv[2])
print("ok", sys.argv[2])
