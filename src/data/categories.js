// Categorías de TheMealDB (el valor es lo que espera la API; la etiqueta es lo que ve el usuario).
export const CATEGORIES = [
    { value: 'Breakfast', label: 'Desayuno' },
    { value: 'Chicken', label: 'Pollo' },
    { value: 'Beef', label: 'Res' },
    { value: 'Pork', label: 'Cerdo' },
    { value: 'Lamb', label: 'Cordero' },
    { value: 'Goat', label: 'Cabra' },
    { value: 'Seafood', label: 'Pescados y mariscos' },
    { value: 'Pasta', label: 'Pasta' },
    { value: 'Vegetarian', label: 'Vegetariano' },
    { value: 'Vegan', label: 'Vegano' },
    { value: 'Starter', label: 'Entrada' },
    { value: 'Side', label: 'Acompañamiento' },
    { value: 'Dessert', label: 'Postre' },
    { value: 'Miscellaneous', label: 'Variado' },
];

export const DEFAULT_CATEGORY = 'Breakfast';

// "Dessert" -> "Postre". Si la categoría no está en la lista, se devuelve tal cual.
export const categoryLabel = (value) => {
    const found = CATEGORIES.find((c) => c.value === value);
    return found ? found.label : value || '';
};
