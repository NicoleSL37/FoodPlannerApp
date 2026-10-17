// Capa mínima sobre AsyncStorage: guarda y lee JSON sin que un error de lectura rompa la app.
import AsyncStorage from '@react-native-async-storage/async-storage';

/** Lee un valor JSON. Si no existe, está dañado o falla la lectura, devuelve `fallback`. */
export async function getJSON(key, fallback = null) {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
        console.warn(`[storage] No se pudo leer "${key}":`, error.message);
        return fallback;
    }
}

/** Guarda un valor como JSON. Devuelve true si se guardó. */
export async function setJSON(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`[storage] No se pudo guardar "${key}":`, error.message);
        return false;
    }
}

/** Borra una clave. Devuelve true si se borró. */
export async function removeKey(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.warn(`[storage] No se pudo borrar "${key}":`, error.message);
        return false;
    }
}
