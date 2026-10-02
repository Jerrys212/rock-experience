# Parte 2 — Debugging: revisión del componente `ContactForm`

## Código original

```jsx
import { useState } from "react";

export default function ContactForm() {
    const [email, setEmail] = useState("");

    const sendForm = async () => {
        const response = await fetch("https://api.example.com/contact", {
            method: "POST",
            body: JSON.stringify({ email: email }),
        });

        alert("Mensaje enviado");
    };

    return (
        <div>
            <input type="text" onChange={(e) => setEmail(e.target.value)} />

            <div onClick={sendForm}>Enviar</div>
        </div>
    );
}
```

## Resumen

El componente "funciona" en el caso ideal, pero tiene fallos serios:

- **Siempre muestra "Mensaje enviado"**, aunque el servidor devuelva un error.
- No es accesible por teclado ni para lectores de pantalla.
- No valida nada.
- Permite envíos duplicados.
- Probablemente el backend no pueda leer el body, porque falta el `Content-Type`.

---

## 1. Accesibilidad

- **El `<div onClick>` no es un botón.** No recibe foco con Tab, no responde a Enter ni a Espacio y los lectores de pantalla no lo anuncian como acción.
  → Usar `<button type="submit">`, que ya trae todo eso de forma nativa.
- **El input no tiene etiqueta.** Un lector de pantalla solo dice "campo de texto" y el usuario no sabe qué escribir.
  → Añadir un `<label htmlFor>` asociado al `id` del input y un `placeholder` con un ejemplo del formato esperado.
- **Falta `autoComplete="email"`.**
  → Añadirlo para que el navegador pueda autocompletar el correo.

## 2. HTML semántico

- **No hay `<form>`.** Pulsar Enter no envía, y se pierden la validación nativa y la semántica.
  → Envolver todo en `<form onSubmit={handleSubmit}>` y llamar a `e.preventDefault()`.
- **`type="text"` en lugar de `type="email"`.** Se pierden el teclado de email en móviles y la validación básica del navegador.
- **Faltan atributos** `name`, `id`, `required` y `maxLength`.
- **Los `div` genéricos no aportan estructura.** El `<form>` ya agrupa los campos.

## 3. React

- **Input semi-controlado.** Tiene `onChange` pero no `value`, así que el estado y lo que se ve pueden desincronizarse (por ejemplo, `setEmail("")` no vaciaría el campo).
  → Añadir `value={email}`.
- **`response` se declara y nunca se usa.** Es la pista de que no se comprueba el resultado de la petición.
- **Nombre del handler.** `sendForm` → `handleSubmit`, siguiendo la convención para handlers de eventos.

## 4. Validaciones

- **No se valida nada.** Se puede enviar el campo vacío o con solo espacios.
  → Definir un esquema con **Zod** que aplique `trim()` y exija que el campo no esté vacío, y validarlo con `safeParse` antes de enviar.
- **Los errores deben mostrarse junto al campo** y limpiarse cuando el usuario corrige.

```ts
const contactSchema = z.object({
    email: z.string().trim().min(1, "El correo es obligatorio."),
});
```

## 5. APIs

- **Falta `Content-Type: application/json`.** Sin él, `fetch` envía el body como `text/plain` y muchos backends (por ejemplo, Express con `express.json()`) recibirían un body vacío.
- **No se comprueba `response.ok`.** `fetch` **solo rechaza la promesa por errores de red**; un 400 o un 500 se resuelven "con éxito".
  → `if (!res.ok) throw new Error(...)`.
- **URL hardcodeada.**
  → Moverla a una variable de entorno (`import.meta.env.VITE_CONTACT_API_URL`).

## 6. Manejo de errores

- **No hay `try/catch`.** Un fallo de red, CORS o DNS produce una _unhandled promise rejection_ sin aviso al usuario.
- **Mensaje de éxito incondicional.** Es engañoso: el usuario cree que contactó y su mensaje se perdió.
  → Mostrar el mensaje de éxito solo si `res.ok`; si no, un mensaje de error claro.

## 7. Seguridad

- **Endpoint público sin protección anti-spam.**
  → Añadir un captcha (Turnstile, reCAPTCHA) para evitar que un bot lo inunde.
- **Envíos duplicados.** Con un doble clic se mandan varias peticiones.
  → Ignorar el envío si ya hay una petición en curso y deshabilitar el botón mientras tanto.
- **Sin autorización.** La petición no envía ningún token, así que cualquiera puede llamar al endpoint.
  → La API debería exigir un token de autorización (por ejemplo, `Authorization: Bearer <token>`).

## 8. UX

- **Sin feedback de carga.** → Mostrar "Enviando…" y deshabilitar el botón durante la petición.
- **El campo no se limpia tras el envío.** → Vaciar el formulario cuando la petición termina con éxito.
- **El botón no parece un botón.** Un `div` no tiene cursor pointer ni estilos de hover, foco o disabled.
  → Darle estilos propios de botón con Tailwind: color de fondo, `cursor-pointer`, `hover:`, `focus-visible:` y `disabled:`.

## 9. Performance

El impacto es menor, pero:

- **Re-render en cada tecla.** Irrelevante en un formulario tan pequeño; no hace falta `useCallback` ni `memo`. En formularios grandes, considerar inputs no controlados con `FormData` o React Hook Form.
- **Evitar peticiones inútiles** bloqueando el doble envío y abortando al desmontar.
- **Evitar peticiones con datos inválidos** gracias a la validación en el cliente, lo que ahorra carga al servidor.

## 10. Buenas prácticas

- **TypeScript** para tipar el payload, los eventos y la respuesta.
- **Tests** con React Testing Library y MSW: validación, éxito, error 500, error de red y doble clic.

---

## Versión corregida

```tsx
import { useState, type FormEvent } from "react";
import { z } from "zod";

const API_URL = import.meta.env.VITE_CONTACT_API_URL;

const contactSchema = z.object({
    email: z.string().trim().min(1, "El correo es obligatorio."),
});

export default function ContactForm() {
    const [email, setEmail] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isLoading) return;

        const result = contactSchema.safeParse({ email });
        if (!result.success) {
            setFieldError(result.error.issues[0].message);
            return;
        }

        setFieldError("");
        setMessage("");
        setIsLoading(true);

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });

            if (!res.ok) {
                throw new Error(`Error HTTP ${res.status}`);
            }

            setMessage("¡Gracias! Hemos recibido tu mensaje.");
            setEmail("");
        } catch {
            setMessage("No pudimos enviar el formulario. Inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="email">Correo electrónico</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError) setFieldError("");
                }}
            />
            {fieldError && <p className="text-sm text-red-600">{fieldError}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {isLoading ? "Enviando…" : "Enviar"}
            </button>

            {message && <p>{message}</p>}
        </form>
    );
}
```
