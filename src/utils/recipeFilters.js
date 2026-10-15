// Mapea lo que el usuario elige en "Alergias" con el alérgeno que debe excluirse de las recetas.
const ALLERGY_TO_ALLERGEN = {
    'Sin Lactosa': 'Lactosa',
    'Sin Gluten': 'Gluten',
    'Nueces': 'Nueces',
    'Mariscos': 'Mariscos',
    'Huevos': 'Huevos',
};

const normalize = (text) =>
    text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

/**
 * Filtra recetas por categoría, texto de búsqueda, dieta y alergias del usuario.
 */
export function filterRecipes(recipes, { category = 'Todas', query = '', diet = 'Tradicional', allergies = [] } = {}) {
    const excluded = allergies.map((a) => ALLERGY_TO_ALLERGEN[a]).filter(Boolean);
    const q = normalize(query.trim());

    return recipes.filter((recipe) => {
        if (category !== 'Todas' && recipe.category !== category) return false;
        if (diet && diet !== 'Tradicional' && !recipe.diets.includes(diet)) return false;
        if (recipe.allergens.some((a) => excluded.includes(a))) return false;

        if (q) {
            const haystack = normalize([recipe.title, recipe.tag, recipe.category, ...recipe.ingredients].join(' '));
            if (!haystack.includes(q)) return false;
        }
        return true;
    });
}

// Texto corto para mostrar qué preferencias se están aplicando ('' si ninguna).
export function describePreferences(diet, allergies = []) {
    const parts = [];
    if (diet && diet !== 'Tradicional') parts.push(diet);
    const real = allergies.filter((a) => a !== 'Ninguna');
    parts.push(...real);
    return parts.join(' · ');
}
