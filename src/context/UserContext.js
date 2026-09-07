import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [userName, setUserName] = useState('Alex');
    const [userEmail, setUserEmail] = useState('alex@email.com');
    const [dietaryPreference, setDietaryPreference] = useState('Tradicional');
    const [allergies, setAllergies] = useState(['Ninguna']);

    return (
        <UserContext.Provider value={{
            userName,
            setUserName,
            userEmail,
            setUserEmail,
            dietaryPreference,
            setDietaryPreference,
            allergies,
            setAllergies,
        }}>
            {children}
        </UserContext.Provider>
    );
}