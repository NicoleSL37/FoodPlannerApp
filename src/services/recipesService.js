// Único lugar de la app que habla con la API de recetas (TheMealDB).
// Las pantallas nunca llaman a fetch directamente: usan estas funciones (o los hooks de src/hooks).
import { mapMealToRecipe, mapSummaryToRecipe } from '../utils/mealMapper';

// 1 = clave pública de pruebas de TheMealDB
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const TIMEOUT_MS = 10000;

export class ApiError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request(path) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let response;
    try {
        response = await fetch(`${BASE_URL}/${path}`, { signal: controller.signal });
    } catch (error) {
        if (error && error.name === 'AbortError') {
            throw new ApiError('La solicitud tardó demasiado. Revisa tu conexión e inténtalo de nuevo.');
        }
        throw new ApiError('No se pudo conectar. Revisa tu conexión a internet.');
    } finally {
        clearTimeout(timer);
    }

    if (!response.ok) {
        throw new ApiError(`El servidor respondió con un error (${response.status}).`);
    }

    try {
        return await response.json();
    } catch (error) {
        throw new ApiError('Recibimos una respuesta inválida del servidor.');
    }
}

// La API devuelve { meals: null } o { meals: "None Found" } cuando no hay resultados
const toArray = (data) => (data && Array.isArray(data.meals) ? data.meals : []);

/** Busca recetas por nombre. Devuelve recetas completas (con ingredientes y pasos). */
export async function searchRecipes(query) {
    const data = await request(`search.php?s=${encodeURIComponent(query)}`);
    return toArray(data).map(mapMealToRecipe);
}

/** Lista las recetas de una categoría. Devuelve recetas parciales (id, nombre y foto). */
export async function getRecipesByCategory(category) {
    const data = await request(`filter.php?c=${encodeURIComponent(category)}`);
    return toArray(data).map((meal) => mapSummaryToRecipe(meal, category));
}

/** Trae una receta completa por id. */
export async function getRecipeById(id) {
    const data = await request(`lookup.php?i=${encodeURIComponent(id)}`);
    const [meal] = toArray(data);
    if (!meal) throw new ApiError('No encontramos esta receta.');
    return mapMealToRecipe(meal);
}
