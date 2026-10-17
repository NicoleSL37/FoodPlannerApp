import { useCallback, useEffect, useRef, useState } from 'react';
import { translateRecipe } from '../services/translationService';
import { loadTranslation, saveTranslation } from '../storage/translationStorage';

/**
 * Traducción al español de una receta ya cargada (título, ingredientes y pasos).
 * Devuelve { status: 'idle' | 'loading' | 'success' | 'error', error, data, showSpanish, translate, showOriginal }.
 *  - Al abrir la receta busca en la caché del celular; si ya estaba traducida no vuelve a gastar cupo.
 *  - `translate` pide la traducción (o solo la muestra si ya existe) y la guarda.
 */
export function useRecipeTranslation(recipe) {
    const id = recipe && !recipe.isPartial ? recipe.id : null;
    const [state, setState] = useState({ data: null, status: 'idle', error: '' });
    const [showSpanish, setShowSpanish] = useState(false);
    const currentId = useRef(id);
    currentId.current = id;

    // Al cambiar de receta: se reinicia y se busca una traducción guardada
    useEffect(() => {
        let cancelled = false;
        setState({ data: null, status: 'idle', error: '' });
        setShowSpanish(false);
        if (!id) return undefined;

        loadTranslation(recipe).then((saved) => {
            if (!cancelled && saved) setState({ data: saved, status: 'success', error: '' });
        });
        return () => {
            cancelled = true;
        };
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    const translate = useCallback(async () => {
        if (!id) return;
        if (state.data) {
            setShowSpanish(true);
            return;
        }
        setState({ data: null, status: 'loading', error: '' });
        try {
            const data = await translateRecipe(recipe);
            if (currentId.current !== id) return; // el usuario ya cambió de receta
            await saveTranslation(id, data);
            setState({ data, status: 'success', error: '' });
            setShowSpanish(true);
        } catch (error) {
            if (currentId.current !== id) return;
            setState({ data: null, status: 'error', error: error.message });
        }
    }, [id, recipe, state.data]);

    const showOriginal = useCallback(() => setShowSpanish(false), []);

    return { ...state, showSpanish: showSpanish && Boolean(state.data), translate, showOriginal };
}
