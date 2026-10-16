import React, { createContext, useCallback, useMemo, useState } from 'react';

export const UserContext = createContext();

const DEFAULT_DIET = 'Tradicional';
const DEFAULT_ALLERGIES = ['Ninguna'];

export function UserProvider({ children }) {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [dietaryPreference, setDietaryPreference] = useState(DEFAULT_DIET);
    const [allergies, setAllergies] = useState(DEFAULT_ALLERGIES);
    const [favorites, setFavorites] = useState([]); // recetas favoritas (objetos completos)

    // Agrega o quita una receta de favoritos (se guarda la receta completa para mostrarla sin internet)
    const toggleFavorite = useCallback((recipe) => {
        setFavorites((prev) =>
            prev.some((r) => r.id === recipe.id) ? prev.filter((r) => r.id !== recipe.id) : [...prev, recipe]
        );
    }, []);

    const isFavorite = useCallback((id) => favorites.some((r) => r.id === id), [favorites]);

    // Cierra sesión: deja todo el estado del usuario como al inicio.
    const resetUser = useCallback(() => {
        setUserName('');
        setUserEmail('');
        setDietaryPreference(DEFAULT_DIET);
        setAllergies(DEFAULT_ALLERGIES);
        setFavorites([]);
    }, []);

    const value = useMemo(
        () => ({
            userName,
            setUserName,
            userEmail,
            setUserEmail,
            dietaryPreference,
            setDietaryPreference,
            allergies,
            setAllergies,
            favorites,
            toggleFavorite,
            isFavorite,
            resetUser,
        }),
        [userName, userEmail, dietaryPreference, allergies, favorites, toggleFavorite, isFavorite, resetUser]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
