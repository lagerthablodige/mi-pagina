# Licencias de las fotos de ambiente (Mongolia)

Estas fotos están en `public/origen/` y se usan solo como ambiente en el inicio (sección Origen y capítulos de las fibras).
No son fotos de Nirün: ningún texto del sitio puede decir que muestran a los pastores, los animales o la producción de Nirün.

Las dos licencias (Pexels License y Unsplash License) permiten uso comercial gratis, permiten modificar las fotos y no exigen atribución.
Los originales están en `Escritorio\Nirun fotos Mongolia gratis\` junto con `LICENCIAS.csv`, de donde sale esta tabla.
Las copias del sitio se redimensionaron (2400 px de lado largo el paisaje, 1600 px los animales) y se guardaron en JPEG sin metadatos de cámara. Desde noviembre de 2026, las fotos tratadas llevan además el perfil sRGB incrustado (ver Regla de color).

| Archivo en el sitio | Archivo original | Fuente | Autor | URL |
|---|---|---|---|---|
| `public/origen/ger-amanecer.jpg` | `ger-solitaria-amanecer-pexels-arthouse-studio.jpg` | Pexels | ArtHouse Studio | https://www.pexels.com/photo/lonely-mongolian-yurt-in-countryside-during-sunrise-4321589/ |
| `public/origen/ger-amanecer-movil.jpg` | la misma de la ger (recorte) | Pexels | ArtHouse Studio | https://www.pexels.com/photo/lonely-mongolian-yurt-in-countryside-during-sunrise-4321589/ |
| `public/origen/yak.jpg` | `yak-pastando-unsplash-munkhuu.jpg` | Unsplash | Munkhuu | https://unsplash.com/photos/Df3flYKLXRQ |
| `public/origen/cabras.jpg` | `cabras-rebano-estepa-pexels-arthouse-studio.jpg` | Pexels | ArtHouse Studio | https://www.pexels.com/photo/herd-of-domestic-goats-on-pasture-4321308/ |
| `public/origen/camellos.jpg` | `camellos-bactrianos-manada-pexels-arthouse-studio.jpg` | Pexels | ArtHouse Studio | https://www.pexels.com/photo/herd-of-bactrian-camels-of-different-colors-in-desert-area-4321182/ |

## Cosas a tener presentes

- Foto de las cabras: la página de Pexels no indica el país. Se asumió Mongolia porque es del mismo autor y serie que otras fotos de cabras con pastor mongol. Por eso el pie de foto dice solo "Cabras de cachemira", sin lugar. Conviene verificarlo antes de ponerle un rótulo de país.
- Foto del yak: Unsplash la etiqueta como "Mongolian Yak", pero no indica la ubicación exacta.
- El pie de foto "Mongolia" bajo el paisaje de la ger es solo ambiente; no afirma que sea una ger de Nirün ni de sus proveedores.

## Cambios hechos a las fotos (noviembre de 2026)

- Las fotos de los animales (`yak.jpg`, `cabras.jpg`, `camellos.jpg`) llevan el mismo tratamiento de color para que se vean como una sola serie. Tienen menos saturación y el pasto verde pasó al caqui de la estepa. Los negros quedaron mate y las luces ya no llegan al blanco del papel. Con estas fotos se quita el filtro CSS que les bajaba la saturación; si quedara, se desaturarían dos veces.
- `ger-amanecer.jpg` no cambió de color. `ger-amanecer-movil.jpg` es un recorte vertical de esa misma foto (1200 x 1799 px, desde x = 1026), con la ger en el mismo lugar que se ve hoy en el celular. Así el celular no descarga la foto entera de 2400 px.
- Los dos cambios se hicieron con `scripts/tratar_fotos.py`, a partir de las copias del commit 35c2086.
- Se sacaron de `public/` las fotos antiguas sin licencia de `public/historia/` (una tenía el logo de otra marca) y `perros.png`. También los SVG de la plantilla de Next. `public/instagram/` y `public/nirun-instagram.jpg` tampoco van en el repositorio y están en `.gitignore`.

## Fotos de las prendas (sesión de estudio)

Son fotos propias de Nirün (`public/hero/` y `public/fibers/`). En noviembre de 2026 el muro gris del estudio, que se veía lila, pasó a gris cálido. Solo cambiaron los grises con tinte lila: el color de las prendas quedó igual (diferencia media menor a 1 ΔE, medida dentro de cada prenda). Algún accesorio de la producción con tono lila, como el pañuelo celeste o la cartera de cocodrilo, puede verse un poco más cálido en las sombras. Las portadas de Nomín negro (`_84A6395.jpg`) y Sernaí Silk (`_84A5995.jpg`) se recortaron un poco para sacar la junta oscura del muro del borde de arriba. La portada de playa de Nomín azul oscuro solo bajó el cielo quemado.

## Regla de color

- Toda foto nueva, recortada o armada se exporta en sRGB con su perfil incrustado. Algunas fotos de estudio llegaron en Adobe RGB (las del hero, Záya y Sernaí Silk): recortadas sin convertir, los colores se apagan.
- Para eso están `abrir_srgb` y `guardar_jpg` en `scripts/fotos_color.py`. Los scripts usan Python 3 con Pillow y numpy (`pip install pillow numpy`).
- Las imágenes para compartir (`public/og/`) se hacen con `python scripts/generar_og.py`. Cada prenda tiene un tríptico de 1200 x 630 px con su portada al centro, y el inicio usa las tres fotos del hero. Si se agrega una prenda en `app/products.ts`, se suma en `PRENDAS` y se vuelve a correr. Mientras no exista su imagen, la ficha usa la del inicio.
- Antes de cada deploy con fotos, correr `python scripts/revisar_fotos.py`. Falla si una foto trae otro perfil (Adobe RGB, P3) o si un JPG nuevo viene sin perfil. También falla si en `public/` queda algo que no sea .jpg o .png. Revisa solo lo que se publica (lo que sigue git y lo nuevo que `.gitignore` no excluye), así que lo ignorado, como `public/instagram/`, no cuenta.

## Fuentes tipográficas

Cormorant Garamond e Instrument Sans (SIL Open Font License 1.1) están en `app/fonts/`; ver `app/fonts/LEEME.txt`.
