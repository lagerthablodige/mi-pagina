# Herramientas de color para las fotos de nirun.cl (las usan tratar_fotos.py, generar_og.py y revisar_fotos.py).
#
# Regla de color: toda foto nueva, recortada o armada (por ejemplo, las imagenes para compartir) se abre con
# abrir_srgb() y se guarda con guardar_jpg(). Asi sale convertida a sRGB y con el perfil sRGB incrustado,
# que es la marca que revisar_fotos.py usa para saber que la conversion se hizo.
# Las sesiones de estudio traen fotos en Adobe RGB (1998): si se recortan sin convertir, el navegador las lee
# como sRGB y los colores salen apagados (el rosado de Sernai Silk perdia un 25% de croma).
#
# Los tratamientos (quitar_lila, techo_luces, gradar_banco) vienen de la revision de color de noviembre de 2026.
#
# Requiere Python 3 con Pillow y numpy (pip install pillow numpy).
import io
import struct

import numpy as np
from PIL import Image, ImageCms


def _perfil_srgb():
    # Pillow escribe la fecha y hora de creacion en el encabezado del perfil (bytes 24 a 35). Se fija una fecha
    # para que correr un script dos veces sobre las mismas fotos de exactamente el mismo archivo (y git no vea cambios).
    datos = bytearray(ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes())
    datos[24:36] = struct.pack(">6H", 2026, 11, 8, 0, 0, 0)
    return bytes(datos)


PERFIL_SRGB = _perfil_srgb()

# --- sRGB <-> Lab (D65), vectorizado -------------------------------------------------------------
_M = np.array([[0.4124564, 0.3575761, 0.1804375], [0.2126729, 0.7151522, 0.0721750], [0.0193339, 0.1191920, 0.9503041]])
_MI = np.linalg.inv(_M)
_WP = np.array([0.95047, 1.0, 1.08883])


def a_lineal(u8):
    c = u8 / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def a_u8(lin):
    lin = np.clip(lin, 0, 1)
    c = np.where(lin <= 0.0031308, lin * 12.92, 1.055 * lin ** (1 / 2.4) - 0.055)
    return np.clip(np.round(c * 255), 0, 255).astype(np.uint8)


def lineal_a_lab(lin):
    xyz = (lin @ _M.T) / _WP
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    return np.stack([116 * f[..., 1] - 16, 500 * (f[..., 0] - f[..., 1]), 200 * (f[..., 1] - f[..., 2])], -1)


def lab_a_lineal(lab):
    fy = (lab[..., 0] + 16) / 116
    fx = fy + lab[..., 1] / 500
    fz = fy - lab[..., 2] / 200

    def inv(f):
        return np.where(f**3 > 0.008856, f**3, (f - 16 / 116) / 7.787)

    return (np.stack([inv(fx), inv(fy), inv(fz)], -1) * _WP) @ _MI.T


def a_lab(im):
    return lineal_a_lab(a_lineal(np.asarray(im.convert("RGB")).astype(float)))


def desde_lab(lab):
    return Image.fromarray(a_u8(lab_a_lineal(lab)))


# --- abrir y guardar ------------------------------------------------------------------------------
def descripcion_perfil(icc):
    if not icc:
        return ""
    return ImageCms.getProfileDescription(ImageCms.ImageCmsProfile(io.BytesIO(icc))).strip()


def es_srgb(icc):
    return "srgb" in descripcion_perfil(icc).lower()


def abrir_srgb(ruta):
    """Abre una foto y la devuelve en RGB con valores sRGB. Si trae perfil (Adobe RGB, P3...), la convierte."""
    im = Image.open(ruta)
    icc = im.info.get("icc_profile")
    im = im.convert("RGB")
    if icc and not es_srgb(icc):
        im = ImageCms.profileToProfile(
            im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), ImageCms.createProfile("sRGB"), outputMode="RGB"
        )
    return im


def codificar_jpg(im, calidad):
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=calidad, subsampling="4:2:0", optimize=True, progressive=True, icc_profile=PERFIL_SRGB)
    return buf.getvalue()


def guardar_jpg(im, destino, tope_bytes=None, calidad_max=90, calidad_min=70):
    """Guarda en JPEG sRGB (con perfil). Usa la calidad mas alta que no pase de tope_bytes. Devuelve (calidad, bytes)."""
    datos, q = codificar_jpg(im, calidad_max), calidad_max
    if tope_bytes is not None and len(datos) > tope_bytes:
        bajo, alto, mejor = calidad_min, calidad_max - 1, None
        while bajo <= alto:
            medio = (bajo + alto) // 2
            prueba = codificar_jpg(im, medio)
            if len(prueba) <= tope_bytes:
                mejor, bajo = (medio, prueba), medio + 1
            else:
                alto = medio - 1
        if mejor is None:
            raise SystemExit(f"{destino}: ni con calidad {calidad_min} baja de {tope_bytes} bytes")
        q, datos = mejor
    with open(destino, "wb") as f:
        f.write(datos)
    return q, len(datos)


def por_franjas(im, fn, paso=400):
    """Aplica fn por franjas horizontales, para no llenar la memoria con fotos de 4000x6000."""
    W, H = im.size
    out = Image.new("RGB", (W, H))
    for y in range(0, H, paso):
        out.paste(fn(im.crop((0, y, W, min(H, y + paso)))), (0, y))
    return out


# --- tratamientos ---------------------------------------------------------------------------------
def quitar_lila(im, h_centro=315, lleno=22, cero=42, c_lleno=6.0, c_cero=13.0, objetivo=(0.5, 1.3)):
    """Muro del estudio: solo los grises con tinte lila (tono 273-357 grados, croma < 13) pasan a gris calido.
    Los rosados de las prendas (tono 0-30) y todo lo que tiene color quedan igual. La luminancia no cambia."""
    lab = a_lab(im)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    h = np.degrees(np.arctan2(b, a)) % 360
    dh = np.abs(((h - h_centro) + 180) % 360 - 180)
    w = np.clip(1 - (dh - lleno) / (cero - lleno), 0, 1)
    w *= np.clip((c_cero - C) / (c_cero - c_lleno), 0, 1)
    w *= np.clip((L - 12) / 10, 0, 1)  # los negros profundos (ruido) no se tocan
    lab[..., 1] = a * (1 - w) + objetivo[0] * w
    lab[..., 2] = b * (1 - w) + objetivo[1] * w
    return desde_lab(lab)


def techo_luces(im, inicio=78.0, techo=91.0):
    """Hombro suave en las luces: nada pasa de L*=techo, asi un cielo quemado no se funde con el papel."""
    lab = a_lab(im)
    L = lab[..., 0]
    r = techo - inicio
    lab[..., 0] = np.where(L > inicio, inicio + r * (1 - np.exp(-np.clip(L - inicio, 0, None) / r)), L)
    w = np.clip((L - inicio) / (100 - inicio), 0, 1)
    lab[..., 2] = lab[..., 2] * (1 - w) + 1.5 * w
    return desde_lab(lab)


def gradar_banco(im, sat=0.55, sat_verde=0.30, tono_h=78, tono_c=3.0, negro=7.0, blanco=91.0):
    """Fotos de Mongolia (banco de imagenes): un mismo grado para todas. Menos saturacion, el pasto verde
    pasa al caqui seco de la estepa, un viraje leve hacia el dorado del sitio, negros mate y luces hasta L*91."""
    lab = a_lab(im)
    L, a, b = lab[..., 0], lab[..., 1], lab[..., 2]
    C = np.hypot(a, b)
    h = np.degrees(np.arctan2(b, a)) % 360
    w_verde = np.clip(1 - np.abs(h - 120) / 35, 0, 1)
    C2 = C * (sat * (1 - w_verde) + sat_verde * w_verde)
    h2 = h + (88 - h) * 0.5 * w_verde
    a2 = C2 * np.cos(np.radians(h2))
    b2 = C2 * np.sin(np.radians(h2))
    peso = np.clip(1 - (L / 100) ** 2, 0.25, 1)
    a2 += tono_c * np.cos(np.radians(tono_h)) * peso
    b2 += tono_c * np.sin(np.radians(tono_h)) * peso
    L2 = negro + (blanco - negro) * (L / 100)
    return desde_lab(np.stack([L2, a2, b2], -1))
