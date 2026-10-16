// Caché de traducciones en el celular: cada receta se traduce una sola vez (el servicio gratuito tiene cupo diario).
// v2: se cambió la clave para descartar traducciones antiguas de peor calidad.
// Es de todo el dispositivo (no por usuario): la traducción de una receta es la misma para cualquiera.
import { getJSON, setJSON } from './storage';

const key = (id) => `@foodplanner/v2/translations/${id}`;

const isStringList = (list) => Array.isArray(list) && list.every((item) => typeof item === 'string' && item.trim());

/** Devuelve la traducción guardada solo si es válida y coincide con la receta (mismos ingredientes y pasos). */
export async function loadTranslation(recipe) {
    const saved = await getJSON(key(recipe.id), null);
    const valid =
        saved &&
        typeof saved.title === 'string' && saved.title.trim() &&
        isStringList(saved.ingredients) && saved.ingredients.length === recipe.ingredients.length &&
        isStringList(saved.steps) && saved.steps.length === recipe.steps.length;
    return valid ? { title: saved.title, ingredients: saved.ingredients, steps: saved.steps } : null;
}

export const saveTranslation = (id, translation) => setJSON(key(id), translation);
