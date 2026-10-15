import React, { createContext, useCallback, useMemo, useState } from 'react';

export const UserContext = createContext();

const DEFAULT_DIET = 'Tradicional';
const DEFAULT_ALLERGIES = ['Ninguna'];

export function UserProvider({ children }) {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [dietaryPreference, setDietaryPreference] = useState(DEFAULT_DIET);
    const [allergies, setAllergies] = useState(DEFAULT_ALLERGIES);
    const [favorites, setFavorites] = useState([]); // ids de recetas favoritas

    const toggleFavorite = useCallback((recipeId) => {
        setFavorites((prev) =>
            prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
        );
    }, []);

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
            resetUser,
        }),
        [userName, userEmail, dietaryPreference, allergies, favorites, toggleFavorite, resetUser]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
