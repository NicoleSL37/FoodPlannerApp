// Convierte lo que responde TheMealDB al formato de receta que usa la app.
//
// Receta de la app:
// { id, title, category, area, tag, icon, image, ingredients[], steps[],
//   diets (array | null), allergens (array | null), isPartial }
//
// TheMealDB NO entrega calorías, tiempo, porciones, dieta ni alérgenos.
// - Calorías, tiempo y porciones: no se inventan (no existen en la app).
// - Dieta y alérgenos: se ESTIMAN a partir de la categoría y de los ingredientes.
//   `null` significa "desconocido" (por ejemplo, en listas que no traen ingredientes).
import { categoryLabel } from '../data/categories';

const MEAT_CATEGORIES = ['Beef', 'Chicken', 'Lamb', 'Pork', 'Goat'];

const CATEGORY_ICONS = {
    Breakfast: 'coffee',
    Dessert: 'heart',
    Seafood: 'anchor',
    Vegan: 'feather',
    Vegetarian: 'feather',
    Chicken: 'zap',
    Beef: 'zap',
    Pork: 'zap',
    Lamb: 'zap',
    Goat: 'zap',
    Pasta: 'circle',
    Starter: 'sun',
    Side: 'sun',
    Miscellaneous: 'star',
};

export const iconForCategory = (category) => CATEGORY_ICONS[category] || 'coffee';

// Arma una expresión regular que reconoce cualquiera de las palabras (con "s" opcional al final).
const wordsRegex = (words) => new RegExp(`\\b(?:${words.join('|')})s?\\b`, 'i');

const MEAT_RE = wordsRegex([
    'beef', 'chicken', 'lamb', 'pork', 'bacon', 'ham', 'sausage', 'chorizo', 'salami', 'prosciutto',
    'pancetta', 'turkey', 'duck', 'goat', 'steak', 'veal', 'venison', 'rabbit', 'gammon', 'lard', 'suet',
]);
const SEAFOOD_WORDS = [
    'prawn', 'shrimp', 'crab', 'lobster', 'mussel', 'clam', 'oyster', 'scallop', 'squid', 'calamari',
    'crayfish', 'langoustine', 'cockle',
];
const FISH_RE = wordsRegex([
    ...SEAFOOD_WORDS, 'fish', 'salmon', 'tuna', 'cod', 'haddock', 'mackerel', 'sardine', 'anchovy',
    'anchovies', 'herring', 'trout', 'sea bass', 'tilapia',
]);

const SHELLFISH_RE = wordsRegex(SEAFOOD_WORDS);
const EGG_RE = wordsRegex(['egg', 'mayonnaise', 'meringue']);
// "Egg Plants" (berenjena) se escribe con la palabra "egg" pero no es huevo
const NOT_EGG_RE = /\begg ?plants?\b/gi;
const hasEgg = (text) => EGG_RE.test(text.replace(NOT_EGG_RE, ' '));
const NUT_RE = wordsRegex([
    'almond', 'walnut', 'cashew', 'hazelnut', 'pecan', 'pistachio', 'peanut', 'pine nut', 'macadamia', 'brazil nut',
]);

// Lácteos: primero se quitan las frases que NO son lácteas (leche de coco, mantequilla de maní, etc.)
const NOT_DAIRY_RE = /\b(?:coconut|almond|soy|soya|oat|rice|cashew) (?:milk|cream|yogh?urt)\b|\b(?:peanut|almond|cocoa|shea|apple) butter\b|\bbutter beans?\b|\bcream of tartar\b/gi;
const DAIRY_RE = wordsRegex([
    'milk', 'cheese', 'butter', 'cream', 'yogh?urt', 'parmesan', 'parmigiano', 'mozzarella', 'cheddar',
    'ricotta', 'feta', 'mascarpone', 'ghee', 'custard', 'paneer',
]);

// Gluten: primero se quitan las harinas y fideos que NO tienen gluten
const NOT_GLUTEN_RE = /\b(?:corn|rice|almond|coconut|chickpea|gram|tapioca|potato) flour\b|\brice (?:noodles?|vermicelli)\b|\bgluten[- ]free\b/gi;
const GLUTEN_RE = wordsRegex([
    'flour', 'bread', 'breadcrumb', 'panko', 'pasta', 'spaghetti', 'noodle', 'macaroni', 'penne', 'lasagn[ea]',
    'fettuccine', 'linguine', 'tagliatelle', 'couscous', 'barley', 'bulgur', 'semolina', 'wheat', 'soy sauce',
    'tortilla', 'pastry', 'biscuit', 'digestive', 'filo', 'pita', 'naan', 'oat', 'baguette', 'dough', 'croissant',
]);

const joinNames = (names) => names.join(' | ').toLowerCase();

const hasDairy = (text) => DAIRY_RE.test(text.replace(NOT_DAIRY_RE, ' '));
const hasGluten = (text) => GLUTEN_RE.test(text.replace(NOT_GLUTEN_RE, ' '));

/** Alérgenos estimados a partir de los nombres de los ingredientes. */
export function inferAllergens(ingredientNames) {
    const text = joinNames(ingredientNames);
    const found = [];
    if (hasDairy(text)) found.push('Lactosa');
    if (hasGluten(text)) found.push('Gluten');
    if (hasEgg(text)) found.push('Huevos');
    if (SHELLFISH_RE.test(text)) found.push('Mariscos');
    if (NUT_RE.test(text)) found.push('Nueces');
    return found;
}

/** Dietas compatibles estimadas con la categoría y los ingredientes. */
export function inferDiets(category, ingredientNames) {
    if (category === 'Vegan') return ['Tradicional', 'Pescatariano', 'Vegetariano', 'Vegano'];

    const text = joinNames(ingredientNames);
    const forcedVegetarian = category === 'Vegetarian';
    const hasMeat = !forcedVegetarian && (MEAT_CATEGORIES.includes(category) || MEAT_RE.test(text));
    const hasSeafood = !forcedVegetarian && (category === 'Seafood' || FISH_RE.test(text));
    const hasAnimalProduct = hasDairy(text) || hasEgg(text) || /\b(?:honey|gelatin[e]?)\b/i.test(text);

    const diets = ['Tradicional'];
    if (!hasMeat) diets.push('Pescatariano');
    if (!hasMeat && !hasSeafood) diets.push('Vegetariano');
    if (!hasMeat && !hasSeafood && !hasAnimalProduct) diets.push('Vegano');
    return diets;
}

/** Dietas estimadas solo con la categoría (para listas sin ingredientes). null = desconocido. */
export function inferDietsFromCategory(category) {
    if (category === 'Vegan') return ['Tradicional', 'Pescatariano', 'Vegetariano', 'Vegano'];
    if (category === 'Vegetarian') return ['Tradicional', 'Pescatariano', 'Vegetariano'];
    if (category === 'Seafood') return ['Tradicional', 'Pescatariano'];
    if (MEAT_CATEGORIES.includes(category)) return ['Tradicional'];
    return null;
}

/** Convierte el texto de instrucciones de la API en una lista de pasos. */
export function splitInstructions(text) {
    if (!text || !text.trim()) return [];

    let steps = text
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        // quita líneas como "STEP 1" o "1" y numeraciones como "1. " o "2) "
        .filter((line) => !/^(?:step\s*)?\d+[.):]?$/i.test(line))
        .map((line) => line.replace(/^(?:step\s*)?\d+[.):]\s+/i, ''));

    // Si todo vino en un solo párrafo largo, lo partimos por oraciones (2 por paso)
    if (steps.length === 1 && steps[0].length > 220) {
        const sentences = steps[0].match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [steps[0]];
        const grouped = [];
        for (let i = 0; i < sentences.length; i += 2) {
            grouped.push(sentences.slice(i, i + 2).join('').trim());
        }
        steps = grouped;
    }
    return steps;
}

/** Receta completa (search.php y lookup.php). */
export function mapMealToRecipe(meal) {
    const ingredientNames = [];
    const ingredients = [];
    for (let i = 1; i <= 20; i += 1) {
        const name = String(meal[`strIngredient${i}`] || '').trim();
        if (!name) continue;
        const measure = String(meal[`strMeasure${i}`] || '').trim();
        ingredientNames.push(name);
        ingredients.push(measure ? `${measure} ${name}` : name);
    }

    const category = meal.strCategory || '';
    return {
        id: String(meal.idMeal),
        title: meal.strMeal || 'Receta sin nombre',
        category,
        area: meal.strArea || '',
        tag: meal.strArea || categoryLabel(category),
        icon: iconForCategory(category),
        image: meal.strMealThumb || null,
        ingredients,
        steps: splitInstructions(meal.strInstructions),
        diets: inferDiets(category, ingredientNames),
        allergens: inferAllergens(ingredientNames),
        isPartial: false,
    };
}

/** Receta parcial (filter.php solo trae id, nombre y foto). */
export function mapSummaryToRecipe(item, category) {
    return {
        id: String(item.idMeal),
        title: item.strMeal || 'Receta sin nombre',
        category,
        area: '',
        tag: '',
        icon: iconForCategory(category),
        image: item.strMealThumb || null,
        ingredients: [],
        steps: [],
        diets: inferDietsFromCategory(category),
        allergens: null,
        isPartial: true,
    };
}
