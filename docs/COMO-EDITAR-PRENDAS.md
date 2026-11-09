# Cómo editar las prendas de nirun.cl

Todos los datos de las prendas están en **un solo archivo**: `app/products.ts`.

Las fotos de cada prenda están en `app/fibersData.ts`.

Después de cada cambio:

1. Guarda el archivo.
2. Revisa que todo funcione con `npm run build`.
3. Publica como siempre: primero el respaldo, después el cambio.

---

## 1. Cambiar un precio

1. Abre `app/products.ts`.
2. Busca la prenda por su nombre. Por ejemplo, `slug: "bolomaa"`.
3. Busca la línea `precio:`.
4. Cambia el número.

Antes:

```ts
precio: 350000,
```

Después:

```ts
precio: 370000,
```

Reglas:

- El precio va **con IVA incluido**.
- Escribe el número **sin puntos** y **sin el signo $**. El sitio pone `$370.000` solo.
- No borres la coma del final.

**Sernaí Silk** tiene dos precios, uno por pieza: la chaqueta y la falda. Cada pieza tiene su propia línea `precio:`.

---

## 2. Marcar una talla vendida

Hay una sola unidad por talla. Cuando se vende una talla, se borra ese mismo día.

1. Abre `app/products.ts`.
2. Busca la prenda.
3. Busca la línea `tallas:`.
4. Borra la talla vendida, con sus comillas y su coma.

Antes:

```ts
tallas: ["S", "M", "L"],
```

Se vendió la M. Después:

```ts
tallas: ["S", "L"],
```

Si se venden **todas** las tallas de una prenda, no la borres. Pide ayuda antes de publicar.

Si vuelve a llegar una talla, escríbela otra vez en la lista, entre comillas.

---

## 3. Agregar una prenda nueva

### Paso 1: las fotos

1. Las fotos van en `public/fibras/<fibra>/<prenda>/`.
   Por ejemplo: `public/fibras/yak/khulan/_84A5137.jpg`.
2. Usa 4 fotos verticales (2:3), en formato `.jpg` y en color sRGB.

### Paso 2: avisar dónde están las fotos

1. Abre `app/fibersData.ts`.
2. Busca la fibra de la prenda: yak, cashmere o baby camel.
3. Copia una línea que empiece con `...g(` y cámbiala.

Ejemplo:

```ts
...g("yak", "Tuya", "tuya", [1111, 2222, 3333, 4444]),
```

- `"yak"`: la carpeta de la fibra.
- `"Tuya"`: el nombre de la prenda. Debe ser **igual** al `garment` del paso 3.
- `"tuya"`: la carpeta de las fotos.
- `[1111, 2222, ...]`: los números de las fotos `_84A1111.jpg`, `_84A2222.jpg`...

### Paso 3: los datos de la prenda

1. Abre `app/products.ts`.
2. Copia el bloque de una prenda parecida. Un bloque empieza con `simple({` y termina con `}),`.
3. Pégalo debajo y cambia los datos:

```ts
  simple({
    slug: "tuya",
    garment: "Tuya",
    nombreCorto: "Tuya",
    tipo: "Abrigo largo",
    portada: 0,
    segunda: 1,
    nombre: "Abrigo largo Tuya",
    material: "100% Yak",
    color: "Gris",
    tallas: ["S", "M", "L"],
    precio: 980000,
  }),
```

- `slug`: la dirección de la ficha, sin tildes ni espacios. Queda `nirun.cl/prenda/tuya`.
- `garment`: igual que en `fibersData.ts`.
- `nombreCorto`: el nombre que se ve en la tarjeta y en la ficha.
- `tipo`: qué prenda es.
- `portada`: qué foto va en la tarjeta. La primera foto es `0`, la segunda es `1`.
- `segunda`: la foto que aparece al pasar el mouse en el computador.
- `nombre`: el nombre completo.
- `material`, `color`, `tallas` y `precio`: los datos de la etiqueta y de la planilla.

Si la prenda es femenina (una chaqueta, una falda), agrega `lo: "la",`. Así el sitio dice «pruébatela».

### Paso 4: el orden

En `app/products.ts`, debajo de todas las prendas, hay dos listas:

- `ORDEN_COLECCION`: el orden de la colección.
- `ORDEN_FIBRAS`: el orden dentro de cada fibra.

Agrega el `slug` nuevo en las dos, entre comillas.

### Paso 5: revisar

1. Corre `npm run build`. No debe salir ningún error.
2. Mira la ficha nueva y la colección antes de publicar.

---

## Datos opcionales

Estos datos no son obligatorios. Si no están, el sitio usa uno automático.

| Dato | Para qué sirve | Si no está |
|---|---|---|
| `tipoTarjeta` | Tipo corto en la tarjeta | Usa `tipo` |
| `tituloSeo` | Título en Google | Nombre y fibra |
| `imagenCompartir` | Imagen al compartir por WhatsApp | `/og/prenda/<slug>.jpg`, o la imagen general |
| `alts` | Texto que describe cada foto | «Nombre, foto 1 de 4» |
| `descripcion` | Dos o tres líneas sobre la prenda | Todavía no se muestra en la ficha |
| `calce` | Estatura y talla de la modelo | Todavía no se muestra en la ficha |
| `largo`, `hechoEn`, `cuidado` | Datos de la etiqueta | Todavía no se muestra en la ficha |

Regla de oro: **escribe solo datos reales**. Si no estás seguro de un dato, déjalo afuera.

Obligatorio al agregar una prenda: en `app/medicion.ts` está la lista `FIBRA`. Agrega ahí el `slug` nuevo con su fibra. Si falta, las visitas a esa prenda se miden como página 404.

---

## 4. Cambiar una foto

Regla: **foto nueva = nombre de archivo nuevo**.

1. No reemplaces una foto con otra del mismo nombre.
2. Guarda la foto nueva con su propio número. Por ejemplo, `_84A9999.jpg`.
3. Cambia el número en `app/fibersData.ts`.
4. Si la prenda tiene `alts` en `app/products.ts`, cambia ahí también el nombre del archivo.

Las fotos grandes del inicio (`public/portada/`) siguen la misma regla. Su nombre está en `app/page.tsx` y en `app/sitemap.ts`: cámbialo en los dos.

Si cambias el ícono `app/apple-icon.png`, cópialo también a `public/apple-touch-icon.png` y a `public/apple-touch-icon-precomposed.png`. El iPhone pide esos dos archivos directo.

Por qué: los teléfonos y Vercel guardan las fotos en la memoria (la caché) hasta 30 días.
Si el nombre no cambia, una clienta puede seguir viendo la foto vieja.

Lo mismo vale para la imagen para compartir de una prenda (`public/og/prenda/`).
Si la cambias, guárdala con otro nombre (por ejemplo, `khulan-2.jpg`) y escríbelo en la prenda:
`imagenCompartir: "/og/prenda/khulan-2.jpg",`.
