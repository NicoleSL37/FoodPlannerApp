import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toPlanMeal } from '../utils/plan';
import { File } from 'expo-file-system';
import * as notificationService from '../services/notificationService';
import { logger, maskEmail } from '../utils/logger';
import {
    DEFAULT_USER_DATA,
    MAX_HISTORY,
    MAX_VIEWED,
    clearSession,
    loadSession,
    loadUserData,
    saveSession,
    saveUserData,
} from '../storage/userStorage';

export const UserContext = createContext();

export function UserProvider({ children }) {
    // isHydrated: ya se leyó del celular la sesión y los datos guardados
    const [isHydrated, setIsHydrated] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [dietaryPreference, setDietaryPreference] = useState(DEFAULT_USER_DATA.dietaryPreference);
    const [allergies, setAllergies] = useState(DEFAULT_USER_DATA.allergies);
    const [favorites, setFavorites] = useState(DEFAULT_USER_DATA.favorites); // recetas favoritas (objetos completos)
    const [viewed, setViewed] = useState(DEFAULT_USER_DATA.viewed); // recetas vistas recientemente
    const [plan, setPlan] = useState(DEFAULT_USER_DATA.plan); // plan semanal: { fecha: { comida: receta } }
    const [history, setHistory] = useState(DEFAULT_USER_DATA.history); // preparaciones registradas
    const [settings, setSettings] = useState(DEFAULT_USER_DATA.settings); // notificaciones y recordatorios

    // Si el usuario inicia o cierra sesión antes de que termine la lectura inicial, esa lectura no debe pisar su acción
    const authChanged = useRef(false);

    const applyUserData = useCallback((data) => {
        setDietaryPreference(data.dietaryPreference);
        setAllergies(data.allergies);
        setFavorites(data.favorites);
        setViewed(data.viewed);
        setPlan(data.plan);
        setHistory(data.history);
        setSettings(data.settings);
    }, []);

    // 1) Al abrir la app: recuperar la sesión y los datos de ese usuario
    useEffect(() => {
        let cancelled = false;

        (async () => {
            const session = await loadSession();
            if (session) {
                const data = await loadUserData(session.email);
                if (cancelled) return;
                if (authChanged.current) {
                    setIsHydrated(true);
                    return;
                }
                setUserName(session.name);
                setUserEmail(session.email);
                applyUserData(data);
                logger.info('app', `Sesión recuperada para ${maskEmail(session.email)}.`);
                void notificationService.rescheduleAll(session.email, data.plan, data.history, data.settings);
            }
            if (!cancelled) setIsHydrated(true);
        })();

        return () => {
            cancelled = true;
        };
    }, [applyUserData]);

    // 2) Guardar la sesión cada vez que cambia (o borrarla al cerrar sesión)
    useEffect(() => {
        if (!isHydrated) return;
        if (userEmail) {
            saveSession({ name: userName, email: userEmail });
        } else {
            clearSession();
        }
    }, [isHydrated, userName, userEmail]);

    // 3) Guardar los datos del usuario cada vez que cambian
    useEffect(() => {
        if (!isHydrated || !userEmail) return;
        saveUserData(userEmail, { dietaryPreference, allergies, favorites, viewed, plan, history, settings });
    }, [isHydrated, userEmail, dietaryPreference, allergies, favorites, viewed, plan, history, settings]);

    /**
     * Inicia sesión. Si el correo ya usó la app, recupera sus favoritos y preferencias.
     * Con isNewAccount (registro) se empieza desde cero.
     */
    const signIn = useCallback(
        async ({ name, email, isNewAccount = false }) => {
            authChanged.current = true;
            const cleanEmail = email.trim();
            const data = isNewAccount ? DEFAULT_USER_DATA : await loadUserData(cleanEmail);
            if (userEmail && userEmail.trim().toLowerCase() !== cleanEmail.toLowerCase()) {
                await notificationService.cancelAllReminders(userEmail);
            }
            // Todo junto: así el guardado automático nunca ve un estado a medias
            setUserName(name);
            setUserEmail(cleanEmail);
            applyUserData(data);
            logger.info('app', `Sesión iniciada para ${maskEmail(cleanEmail)}.`);
            void notificationService.rescheduleAll(cleanEmail, data.plan, data.history, data.settings);
        },
        [applyUserData, userEmail]
    );

    // Cierra sesión. Los datos siguen guardados en el celular para cuando vuelvas a entrar.
    const signOut = useCallback(() => {
        authChanged.current = true;
        logger.info('app', `Sesión cerrada para ${maskEmail(userEmail)}.`);
        void notificationService.cancelAllReminders(userEmail);
        setUserName('');
        setUserEmail('');
        applyUserData(DEFAULT_USER_DATA);
    }, [applyUserData, userEmail]);

    // Agrega o quita una receta de favoritos (se guarda la receta completa para mostrarla sin internet)
    const toggleFavorite = useCallback((recipe) => {
        setFavorites((prev) =>
            prev.some((r) => r.id === recipe.id) ? prev.filter((r) => r.id !== recipe.id) : [...prev, recipe]
        );
    }, []);

    const isFavorite = useCallback((id) => favorites.some((r) => r.id === id), [favorites]);

    // Registra una receta vista: queda primera de la lista, sin repetirse
    const addViewed = useCallback((recipe) => {
        setViewed((prev) => [recipe, ...prev.filter((r) => r.id !== recipe.id)].slice(0, MAX_VIEWED));
    }, []);

    const clearViewed = useCallback(() => setViewed([]), []);

    // Asigna una receta a una comida de un día (si ya había una, la reemplaza)
    const setMeal = useCallback((key, slotId, recipe) => {
        const plannedRecipe = toPlanMeal(recipe);
        setPlan((prev) => ({ ...prev, [key]: { ...prev[key], [slotId]: plannedRecipe } }));
        const alreadyCompleted = history.some((entry) => entry.source === 'plan' && entry.planKey === key && entry.slotId === slotId);
        if (!userEmail || !settings.notifications || !settings.mealReminders || alreadyCompleted) return;
        void notificationService.scheduleMealReminder({ userEmail, dateKey: key, slotId, recipe: plannedRecipe });
    }, [history, settings, userEmail]);

    // Registra una preparación en el historial (queda primera, con fecha y hora actuales)
    const addHistory = useCallback((entry) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const photoUri = typeof entry.photoUri === 'string' ? entry.photoUri : null;
        setHistory((prev) => [{
            id,
            createdAt: new Date().toISOString(),
            ...entry,
            photoUri,
            hasPhoto: Boolean(entry.hasPhoto || photoUri),
        }, ...prev].slice(0, MAX_HISTORY));
        if (entry.source === 'plan' && entry.planKey && entry.slotId && userEmail) {
            void notificationService.cancelMealReminder(userEmail, entry.planKey, entry.slotId);
        }
    }, [userEmail]);

    const removeHistory = useCallback((id) => {
        const entry = history.find((item) => item.id === id);
        if (entry?.photoUri) {
            try {
                new File(entry.photoUri).delete();
            } catch (error) {
                logger.warn('camara', 'No se pudo borrar el archivo de la foto.', error);
            }
        }
        setHistory((prev) => prev.filter((h) => h.id !== id));
        const anotherCompletionExists = history.some((item) => item.id !== id && item.source === 'plan'
            && item.planKey === entry?.planKey && item.slotId === entry?.slotId);
        if (entry?.source === 'plan' && entry.planKey && entry.slotId && userEmail && settings.notifications && settings.mealReminders && !anotherCompletionExists) {
            const recipe = plan[entry.planKey]?.[entry.slotId];
            if (recipe) void notificationService.scheduleMealReminder({ userEmail, dateKey: entry.planKey, slotId: entry.slotId, recipe });
        }
    }, [history, plan, settings, userEmail]);

    // Cambia un ajuste (por ejemplo updateSetting('notifications', false)); se guarda solo
    const updateSetting = useCallback((key, value) => {
        const safeValue = key === 'mealReminders' && value ? Boolean(settings.notifications) : value;
        const nextSettings = { ...settings, [key]: safeValue };
        setSettings((prev) => ({ ...prev, [key]: safeValue }));
        if (!userEmail) return;
        if ((key === 'notifications' && !safeValue) || (key === 'mealReminders' && !safeValue)) {
            void notificationService.cancelAllReminders(userEmail);
        } else if (nextSettings.notifications && nextSettings.mealReminders) {
            void notificationService.rescheduleAll(userEmail, plan, history, nextSettings);
        }
    }, [history, plan, settings, userEmail]);

    // Quita la receta de una comida; si el día queda vacío, se borra del plan
    const removeMeal = useCallback((key, slotId) => {
        setPlan((prev) => {
            const day = { ...prev[key] };
            delete day[slotId];
            const next = { ...prev };
            if (Object.keys(day).length > 0) next[key] = day;
            else delete next[key];
            return next;
        });
        if (userEmail) void notificationService.cancelMealReminder(userEmail, key, slotId);
    }, [userEmail]);

    const value = useMemo(
        () => ({
            isHydrated,
            userName,
            userEmail,
            dietaryPreference,
            setDietaryPreference,
            allergies,
            setAllergies,
            favorites,
            toggleFavorite,
            isFavorite,
            viewed,
            addViewed,
            clearViewed,
            plan,
            history,
            settings,
            updateSetting,
            addHistory,
            removeHistory,
            setMeal,
            removeMeal,
            signIn,
            signOut,
        }),
        [
            isHydrated, userName, userEmail, dietaryPreference, allergies, favorites, viewed, plan, history, settings,
            updateSetting, toggleFavorite, isFavorite, addViewed, clearViewed, setMeal, removeMeal, addHistory, removeHistory, signIn, signOut,
        ]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
