// Qué se guarda en el celular y con qué claves.
//
//  - sesión:       { name, email } del usuario que inició sesión (para no pedir login cada vez)
//  - datos usuario: dieta, alergias, favoritos y recetas vistas, separados por correo
//                   (si cierras sesión y entras otra persona, no ve tus favoritos; si vuelves a entrar tú, los recuperas)
import { getJSON, setJSON, removeKey } from './storage';
import { DIET_OPTIONS, ALLERGY_OPTIONS, DEFAULT_DIET, DEFAULT_ALLERGIES } from '../data/preferences';

const PREFIX = '@foodplanner/v1';
const SESSION_KEY = `${PREFIX}/session`;
const userKey = (email) => `${PREFIX}/user/${String(email).trim().toLowerCase()}`;

export const MAX_VIEWED = 20;

export const DEFAULT_USER_DATA = {
    dietaryPreference: DEFAULT_DIET,
    allergies: DEFAULT_ALLERGIES,
    favorites: [],
    viewed: [],
};

// ---------- validación de lo que se lee ----------
// Lo guardado puede estar dañado o venir de una versión vieja de la app: nunca se confía en él tal cual.

const isRecipe = (r) => r && typeof r === 'object' && typeof r.id === 'string' && typeof r.title === 'string';

const cleanRecipe = (r) => ({
    ...r,
    category: typeof r.category === 'string' ? r.category : '',
    area: typeof r.area === 'string' ? r.area : '',
    tag: typeof r.tag === 'string' ? r.tag : '',
    icon: typeof r.icon === 'string' ? r.icon : 'coffee',
    image: typeof r.image === 'string' ? r.image : null,
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    steps: Array.isArray(r.steps) ? r.steps : [],
    diets: Array.isArray(r.diets) ? r.diets : null,
    allergens: Array.isArray(r.allergens) ? r.allergens : null,
    isPartial: Boolean(r.isPartial),
});

const cleanRecipes = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list.filter(isRecipe).filter((r) => (seen.has(r.id) ? false : seen.add(r.id))).map(cleanRecipe);
};

export function normalizeUserData(raw) {
    const data = raw && typeof raw === 'object' ? raw : {};
    const allergies = Array.isArray(data.allergies) ? data.allergies.filter((a) => ALLERGY_OPTIONS.includes(a)) : [];

    return {
        dietaryPreference: DIET_OPTIONS.includes(data.dietaryPreference) ? data.dietaryPreference : DEFAULT_DIET,
        allergies: allergies.length > 0 ? allergies : DEFAULT_ALLERGIES,
        favorites: cleanRecipes(data.favorites),
        viewed: cleanRecipes(data.viewed).slice(0, MAX_VIEWED),
    };
}

// ---------- sesión ----------

export async function loadSession() {
    const session = await getJSON(SESSION_KEY, null);
    const valid = session && typeof session.email === 'string' && session.email.trim() && typeof session.name === 'string';
    return valid ? { name: session.name, email: session.email } : null;
}

export const saveSession = (session) => setJSON(SESSION_KEY, { name: session.name, email: session.email });
export const clearSession = () => removeKey(SESSION_KEY);

// ---------- datos del usuario ----------

export async function loadUserData(email) {
    return normalizeUserData(await getJSON(userKey(email), null));
}

export const saveUserData = (email, data) => setJSON(userKey(email), data);
