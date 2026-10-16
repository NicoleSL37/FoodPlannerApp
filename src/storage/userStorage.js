// Qué se guarda en el celular y con qué claves.
//
//  - sesión:       { name, email } del usuario que inició sesión (para no pedir login cada vez)
//  - datos usuario: dieta, alergias, favoritos, recetas vistas, plan semanal, historial de preparaciones y ajustes, separados por correo
//                   (si cierras sesión y entras otra persona, no ve tus favoritos; si vuelves a entrar tú, los recuperas)
import { getJSON, setJSON, removeKey } from './storage';
import { MEAL_SLOTS } from '../data/mealSlots';
import { DIET_OPTIONS, ALLERGY_OPTIONS, DEFAULT_DIET, DEFAULT_ALLERGIES } from '../data/preferences';

const PREFIX = '@foodplanner/v1';
const SESSION_KEY = `${PREFIX}/session`;
const userKey = (email) => `${PREFIX}/user/${String(email).trim().toLowerCase()}`;

export const MAX_VIEWED = 20;
export const MAX_HISTORY = 100;

export const DEFAULT_USER_DATA = {
    dietaryPreference: DEFAULT_DIET,
    allergies: DEFAULT_ALLERGIES,
    favorites: [],
    viewed: [],
    plan: {}, // { 'AAAA-MM-DD': { desayuno: receta, almuerzo: receta, ... } }
    history: [], // preparaciones registradas, la más reciente primero
    settings: { notifications: true, mealReminders: true }, // preferencias de Configuración
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

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/;

// Plan: solo se aceptan fechas válidas y comidas conocidas; cada receta se reduce a los campos mínimos.
const cleanPlan = (raw) => {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
    const plan = {};
    Object.entries(raw).forEach(([key, day]) => {
        if (!DATE_KEY.test(key) || !day || typeof day !== 'object') return;
        const meals = {};
        MEAL_SLOTS.forEach(({ id }) => {
            const meal = day[id];
            if (isRecipe(meal)) {
                meals[id] = {
                    id: meal.id,
                    title: meal.title,
                    image: typeof meal.image === 'string' ? meal.image : null,
                    category: typeof meal.category === 'string' ? meal.category : '',
                    icon: typeof meal.icon === 'string' ? meal.icon : 'coffee',
                };
            }
        });
        if (Object.keys(meals).length > 0) plan[key] = meals;
    });
    return plan;
};

const HISTORY_SOURCES = ['plan', 'free']; // plan = completada desde el Plan, free = cocina libre

// Historial: solo entradas con los campos mínimos válidos, sin ids repetidos y con tope de tamaño.
const cleanHistory = (list) => {
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list
        .filter((h) =>
            h && typeof h === 'object' &&
            typeof h.id === 'string' && typeof h.title === 'string' &&
            typeof h.createdAt === 'string' && !Number.isNaN(Date.parse(h.createdAt)) &&
            HISTORY_SOURCES.includes(h.source)
        )
        .filter((h) => (seen.has(h.id) ? false : seen.add(h.id)))
        .map((h) => ({
            id: h.id,
            recipeId: typeof h.recipeId === 'string' ? h.recipeId : '',
            title: h.title,
            category: typeof h.category === 'string' ? h.category : '',
            image: typeof h.image === 'string' ? h.image : null,
            source: h.source,
            createdAt: h.createdAt,
            planKey: typeof h.planKey === 'string' && DATE_KEY.test(h.planKey) ? h.planKey : null,
            slotId: MEAL_SLOTS.some((slot) => slot.id === h.slotId) ? h.slotId : null,
            hasPhoto: Boolean(h.hasPhoto),
        }))
        .slice(0, MAX_HISTORY);
};

// Ajustes: solo booleanos; lo que falte o venga mal toma el valor por defecto.
const cleanSettings = (raw) => {
    const data = raw && typeof raw === 'object' ? raw : {};
    const defaults = DEFAULT_USER_DATA.settings;
    return {
        notifications: typeof data.notifications === 'boolean' ? data.notifications : defaults.notifications,
        mealReminders: typeof data.mealReminders === 'boolean' ? data.mealReminders : defaults.mealReminders,
    };
};

export function normalizeUserData(raw) {
    const data = raw && typeof raw === 'object' ? raw : {};
    const allergies = Array.isArray(data.allergies) ? data.allergies.filter((a) => ALLERGY_OPTIONS.includes(a)) : [];

    return {
        dietaryPreference: DIET_OPTIONS.includes(data.dietaryPreference) ? data.dietaryPreference : DEFAULT_DIET,
        allergies: allergies.length > 0 ? allergies : DEFAULT_ALLERGIES,
        favorites: cleanRecipes(data.favorites),
        viewed: cleanRecipes(data.viewed).slice(0, MAX_VIEWED),
        plan: cleanPlan(data.plan),
        history: cleanHistory(data.history),
        settings: cleanSettings(data.settings),
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
