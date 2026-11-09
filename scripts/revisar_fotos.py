# Revision de las fotos de public/ antes de cada deploy con fotos. Termina con error si algo no cumple.
#
#   python scripts/revisar_fotos.py            (revisa public/)
#   python scripts/revisar_fotos.py <carpeta>
#
# Regla de color: toda foto nueva, recortada o armada se exporta convertida a sRGB y con el perfil sRGB incrustado
# (abrir_srgb y guardar_jpg de scripts/fotos_color.py). El perfil incrustado es la prueba de que se convirtio.
# Revisa solo lo que se publica: lo que sigue git en public/ mas lo nuevo que .gitignore no excluye (git ls-files).
# Lo ignorado (por ejemplo public/instagram/) nunca sube al sitio, asi que no se revisa ni hay que exportarlo.
# Revisa que:
#   1. En public/ solo haya .jpg y .png (nada de .webp de prueba, .svg de plantilla ni otros restos).
#   2. Ninguna imagen (.jpg o .png) traiga un perfil que no sea sRGB (por ejemplo Adobe RGB o Display P3).
#   3. Un JPG sin perfil sea uno de los de antes de la regla, sin cambios (lista LEGADO, con su huella SHA-256).
#      Un JPG sin perfil nuevo o modificado no se acepta: no hay forma de saber si sus valores son sRGB.
#      Los PNG (logos e iconos, no fotos de camara) pueden ir sin perfil: el navegador los lee como sRGB.
#   4. Los JPG esten en RGB (no CMYK).
#   5. Las imagenes para compartir (public/og) midan 1200x630 y pesen 300 KB o menos (WhatsApp no muestra las mas pesadas).
import hashlib
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image  # noqa: E402

from fotos_color import descripcion_perfil, es_srgb  # noqa: E402

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXTENSIONES = {".jpg", ".png"}
OG_TOPE = 300 * 1024

# JPG sin perfil anteriores a la regla de color, revisados a mano como sRGB. Si se cambia uno, se exporta con perfil.
LEGADO = {
    "og/nirun-og.jpg": "79ba35eb6d5c3dc0035299142fb9338b23ea0ef8ae367a46e144037764aeb435",
    "origen/ger-amanecer.jpg": "8953c5346b25b49c21d5e5c4febd6a4f75a71fa5476420aa18aef3934884e0d2",
}


def huella(ruta):
    h = hashlib.sha256()
    with open(ruta, "rb") as f:
        for bloque in iter(lambda: f.read(1 << 20), b""):
            h.update(bloque)
    return h.hexdigest()


def archivos_publicados(public):
    """Rutas relativas a public/ de lo que se publica: lo que sigue git (o esta en stage) mas lo nuevo sin agregar
    que .gitignore no excluye. Si la carpeta no esta en un repositorio git, se revisa todo lo que hay en el disco."""
    try:
        salida = subprocess.run(
            ["git", "-C", public, "ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", "."],
            capture_output=True,
            check=True,
        ).stdout
    except (OSError, subprocess.CalledProcessError):
        print("AVISO: la carpeta no esta en un repositorio git. Se revisa todo lo que hay en ella, tambien lo que no se publica.")
        return sorted(
            os.path.relpath(os.path.join(base, nombre), public).replace("\\", "/")
            for base, _, archivos in os.walk(public)
            for nombre in archivos
        )
    rutas = {r for r in salida.decode("utf-8").split("\0") if r}
    # Un archivo borrado del disco pero aun en el indice de git sale en la lista: no se publica, no se revisa.
    return sorted(r for r in rutas if os.path.isfile(os.path.join(public, r)))


def revisar(public):
    errores, n = [], 0
    for rel in archivos_publicados(public):
        ruta = os.path.join(public, rel)
        ext = os.path.splitext(rel)[1]
        if ext not in EXTENSIONES:
            errores.append(f"{rel}: en public/ solo van .jpg y .png. Sacarlo o convertirlo.")
            continue
        n += 1
        try:
            with Image.open(ruta) as im:
                icc, modo, tam, formato = im.info.get("icc_profile"), im.mode, im.size, im.format
        except OSError as e:
            errores.append(f"{rel}: no se puede abrir ({e}).")
            continue
        if (ext == ".jpg") != (formato == "JPEG"):
            errores.append(f"{rel}: la extension no calza con el formato real ({formato}).")
        if icc and not es_srgb(icc):
            errores.append(f"{rel}: trae perfil '{descripcion_perfil(icc)}'. Convertirla a sRGB con abrir_srgb y guardar_jpg.")
        elif not icc and ext == ".jpg" and LEGADO.get(rel) != huella(ruta):
            errores.append(
                f"{rel}: foto nueva o modificada sin perfil de color. Exportarla con abrir_srgb y guardar_jpg "
                "(scripts/fotos_color.py) para que salga en sRGB con su perfil."
            )
        if formato == "JPEG" and modo not in ("RGB", "L"):
            errores.append(f"{rel}: JPG en modo {modo}. Debe ser RGB.")
        if rel.startswith("og/"):
            if tam != (1200, 630):
                errores.append(f"{rel}: imagen para compartir de {tam[0]}x{tam[1]}. Debe medir 1200x630.")
            if os.path.getsize(ruta) > OG_TOPE:
                errores.append(f"{rel}: pesa {os.path.getsize(ruta) // 1024} KB. Para compartir, 300 KB o menos.")
    return n, errores


if __name__ == "__main__":
    carpeta = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "public")
    total, errores = revisar(carpeta)
    for e in errores:
        print("ERROR", e)
    if errores:
        print(f"\n{len(errores)} problema(s) en {total} fotos revisadas.")
        sys.exit(1)
    print(f"OK: {total} fotos revisadas (las que se publican), todas en sRGB y sin restos en public/.")
