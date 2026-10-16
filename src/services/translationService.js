// Traducción automática inglés → español con la API gratuita de MyMemory (sin clave).
// Límites del servicio: 500 bytes por solicitud y 5000 caracteres al día por IP sin correo (50 000 con correo).
// Por eso se traduce solo cuando el usuario lo pide y el resultado se guarda en el celular (storage/translationStorage.js).

import { applyGlossary, protectTerms, restoreTerms, parseIngredient, buildIngredient, normalizeName, ingredientOverride } from '../utils/translationGlossary';

const BASE_URL = 'https://api.mymemory.translated.net/get';
const TIMEOUT_MS = 10000;
const MAX_BYTES = 450; // margen bajo el límite de 500 bytes de la API

// Opcional: un correo propio sube el límite diario de 5000 a 50 000 caracteres. Déjalo vacío si no lo usas.
export const CONTACT_EMAIL = '';

const QUOTA_MESSAGE = 'Se agotó el límite diario de traducciones gratuitas. Inténtalo de nuevo mañana.';

export class TranslationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TranslationError';
    }
}

/** Bytes que ocupa un texto en UTF-8 (la API mide en bytes, no en caracteres). */
export function byteLength(text) {
    let bytes = 0;
    for (const char of text) {
        const code = char.codePointAt(0);
        bytes += code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
    }
    return bytes;
}

// La API a veces devuelve entidades HTML (&#39;, &quot;...)
const decodeEntities = (text) =>
    text
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');

async function request(text) {
    const params =
        `q=${encodeURIComponent(text)}&langpair=${encodeURIComponent('en|es')}` +
        (CONTACT_EMAIL ? `&de=${encodeURIComponent(CONTACT_EMAIL)}` : '');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response;
    try {
        response = await fetch(`${BASE_URL}?${params}`, { signal: controller.signal });
    } catch (error) {
        if (error && error.name === 'AbortError') {
            throw new TranslationError('La traducción tardó demasiado. Revisa tu conexión e inténtalo de nuevo.');
        }
        throw new TranslationError('No se pudo conectar al traductor. Revisa tu conexión a internet.');
    } finally {
        clearTimeout(timer);
    }

    if (response.status === 429) throw new TranslationError(QUOTA_MESSAGE);

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new TranslationError('El traductor devolvió una respuesta inválida.');
    }

    const translated = data && data.responseData ? data.responseData.translatedText : null;
    // Al agotar el cupo, la API responde con 429 o con un texto de advertencia en lugar de la traducción
    if ((data && data.quotaFinished) || Number(data && data.responseStatus) === 429 || /MYMEMORY WARNING/i.test(translated || '')) {
        throw new TranslationError(QUOTA_MESSAGE);
    }
    if (Number(data && data.responseStatus) !== 200 || typeof translated !== 'string') {
        throw new TranslationError('No se pudo traducir la receta. Inténtalo de nuevo.');
    }
    return decodeEntities(translated);
}

// Parte un texto largo por palabras (solo se usa si una sola oración supera el límite)
function splitLong(text) {
    const parts = [];
    let current = '';
    for (const word of text.split(/\s+/)) {
        const next = current ? `${current} ${word}` : word;
        if (current && byteLength(next) > MAX_BYTES) {
            parts.push(current);
            current = word;
        } else {
            current = next;
        }
    }
    if (current) parts.push(current);
    return parts;
}

/** Parte un texto en trozos de máximo MAX_BYTES, cortando por oraciones. */
export function chunkText(text) {
    const sentences = text.match(/[^.!?]+(?:[.!?]+|$)\s*/g) || [text];
    const chunks = [];
    let current = '';
    const flush = () => {
        if (current.trim()) chunks.push(current.trim());
        current = '';
    };
    for (const sentence of sentences) {
        if (byteLength(sentence) > MAX_BYTES) {
            flush();
            chunks.push(...splitLong(sentence.trim()));
        } else {
            if (byteLength(current + sentence) > MAX_BYTES) flush();
            current += sentence;
        }
    }
    flush();
    return chunks;
}

// Traduce un trozo aplicando el glosario culinario y protegiendo nombres propios.
// Si el traductor altera un marcador protegido, se reintenta ese trozo sin protección.
async function translateChunk(chunk) {
    const prepared = applyGlossary(chunk);
    const { text, terms } = protectTerms(prepared);
    const translated = await request(text);
    if (terms.length === 0) return translated;
    const restored = restoreTerms(translated, terms);
    return restored !== null ? restored : request(prepared);
}

/** Traduce un texto (por trozos si es largo), en orden y de uno en uno para no saturar el servicio. */
export async function translateText(text) {
    if (!text || !text.trim()) return text;
    const parts = [];
    for (const chunk of chunkText(text)) {
        parts.push(await translateChunk(chunk));
    }
    return parts.join(' ');
}

/**
 * Traduce una lista de frases cortas (ingredientes) agrupándolas en pocas solicitudes, separadas por salto de línea.
 * Si la API no devuelve la misma cantidad de líneas, esa tanda se traduce una por una.
 */
export async function translateList(items) {
    const result = [];
    let batch = [];

    const run = async () => {
        if (batch.length === 0) return;
        const lines = (await translateChunk(batch.join('\n'))).split(/\r?\n/).map((line) => line.trim());
        if (lines.length === batch.length && lines.every(Boolean)) {
            result.push(...lines);
        } else {
            for (const item of batch) result.push(await translateText(item));
        }
        batch = [];
    };

    for (const item of items) {
        if (byteLength(item) > MAX_BYTES) {
            await run();
            result.push(await translateText(item));
        } else {
            if (byteLength([...batch, item].join('\n')) > MAX_BYTES) await run();
            batch.push(item);
        }
    }
    await run();
    return result;
}

/**
 * Traduce los ingredientes cuidando la cantidad: "1 knob Butter" → "1 trozo de mantequilla".
 * La cantidad y la unidad se traducen con un diccionario local; solo el nombre va al traductor.
 */
export async function translateIngredients(ingredients) {
    const parsed = ingredients.map(parseIngredient);
    const names = ingredients.map((text, index) => (parsed[index] ? parsed[index].name : text));
    const overrides = names.map(ingredientOverride);
    // Solo se envían a la API los nombres sin traducción fija
    const pending = names.filter((_, index) => !overrides[index]);
    const translatedPending = await translateList(pending);
    let next = 0;
    const translatedNames = names.map((_, index) => (overrides[index] ? overrides[index].name : translatedPending[next++]));
    return ingredients.map((text, index) => {
        const name = translatedNames[index] || text;
        if (overrides[index] && parsed[index]) return buildIngredient(parsed[index], name, overrides[index].unit);
        // Sin cantidad ("Salt", "To serve Butter"): solo se normalizan las mayúsculas
        return parsed[index] ? buildIngredient(parsed[index], name) : capitalizeFirst(normalizeName(name));
    });
}

const capitalizeFirst = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

/**
 * Traduce ingredientes y pasos de una receta completa.
 * El título NO se traduce: es el nombre propio del plato ("Dutch poffertjes") y la traducción automática lo deforma.
 */
export async function translateRecipe(recipe) {
    const ingredients = await translateIngredients(recipe.ingredients);
    const steps = [];
    for (const step of recipe.steps) {
        steps.push(await translateText(step));
    }
    return { title: recipe.title, ingredients, steps };
}
