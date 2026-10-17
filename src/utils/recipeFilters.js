// Mapea lo que el usuario elige en "Alergias" con el alérgeno que debe evitarse.
const ALLERGY_TO_ALLERGEN = {
    'Sin Lactosa': 'Lactosa',
    'Sin Gluten': 'Gluten',
    'Nueces': 'Nueces',
    'Mariscos': 'Mariscos',
    'Huevos': 'Huevos',
};

// La API no da carbohidratos, así que "Keto" no se puede verificar y no se filtra.
const UNVERIFIABLE_DIETS = ['Tradicional', 'Keto'];

/**
 * Filtra recetas según la dieta y las alergias del usuario.
 * Si una receta no trae el dato (diets/allergens = null), no se excluye: se avisa en su detalle.
 */
export function filterRecipes(recipes, { diet = 'Tradicional', allergies = [] } = {}) {
    const excluded = allergies.map((a) => ALLERGY_TO_ALLERGEN[a]).filter(Boolean);
    const checkDiet = diet && !UNVERIFIABLE_DIETS.includes(diet);

    return recipes.filter((recipe) => {
        if (checkDiet && Array.isArray(recipe.diets) && !recipe.diets.includes(diet)) return false;
        if (Array.isArray(recipe.allergens) && recipe.allergens.some((a) => excluded.includes(a))) return false;
        return true;
    });
}

/** Alérgenos de la receta que coinciden con las alergias del usuario. */
export function getAllergyConflicts(recipeAllergens, userAllergies = []) {
    if (!Array.isArray(recipeAllergens)) return [];
    const excluded = userAllergies.map((a) => ALLERGY_TO_ALLERGEN[a]).filter(Boolean);
    return recipeAllergens.filter((a) => excluded.includes(a));
}

// Texto corto para mostrar qué preferencias se aplican, por ejemplo "Vegano · Sin Lactosa, Gluten" ('' si ninguna).
export function describePreferences(diet, allergies = []) {
    const parts = [];
    if (diet && diet !== 'Tradicional') parts.push(diet);
    const avoided = allergies.map((a) => ALLERGY_TO_ALLERGEN[a]).filter(Boolean);
    if (avoided.length > 0) parts.push(`Sin ${avoided.join(', ')}`);
    return parts.join(' · ');
}
