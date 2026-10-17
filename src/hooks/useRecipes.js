import { useCallback, useEffect, useState } from 'react';
import { getRecipeById, getRecipesByCategory, searchRecipes } from '../services/recipesService';

/**
 * Lista de recetas: si hay `query` busca por nombre, si no trae la categoría.
 * Devuelve { recipes, status: 'loading' | 'success' | 'error', error, reload }.
 */
export function useRecipes({ category, query }) {
    const [state, setState] = useState({ recipes: [], status: 'loading', error: '' });
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false; // evita actualizar el estado si la pantalla cambió de búsqueda o se cerró
        setState((prev) => ({ ...prev, status: 'loading', error: '' }));

        const request = query ? searchRecipes(query) : getRecipesByCategory(category);
        request
            .then((recipes) => {
                if (!cancelled) setState({ recipes, status: 'success', error: '' });
            })
            .catch((error) => {
                if (!cancelled) setState({ recipes: [], status: 'error', error: error.message });
            });

        return () => {
            cancelled = true;
        };
    }, [category, query, reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { ...state, reload };
}

/**
 * Una receta por id. `initialRecipe` permite mostrar al instante lo que ya se conoce
 * (nombre y foto de la lista) mientras llegan los ingredientes y los pasos.
 */
export function useRecipe(id, initialRecipe) {
    const needsFetch = !initialRecipe || initialRecipe.isPartial;
    const [state, setState] = useState({
        recipe: initialRecipe || null,
        status: needsFetch ? 'loading' : 'success',
        error: '',
    });
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!needsFetch) return undefined;

        let cancelled = false;
        setState((prev) => ({ ...prev, status: 'loading', error: '' }));

        getRecipeById(id)
            .then((recipe) => {
                if (!cancelled) setState({ recipe, status: 'success', error: '' });
            })
            .catch((error) => {
                if (!cancelled) setState((prev) => ({ ...prev, status: 'error', error: error.message }));
            });

        return () => {
            cancelled = true;
        };
    }, [id, needsFetch, reloadKey]);

    const reload = useCallback(() => setReloadKey((key) => key + 1), []);

    return { ...state, reload };
}
