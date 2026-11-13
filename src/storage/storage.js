// Capa mínima sobre AsyncStorage: guarda y lee JSON sin que un error de lectura rompa la app.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '../utils/logger';

/** Lee un valor JSON. Si no existe, está dañado o falla la lectura, devuelve `fallback`. */
export async function getJSON(key, fallback = null) {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
        logger.error('almacenamiento', 'No se pudo leer o decodificar un dato guardado; se usará el valor predeterminado.', error);
        return fallback;
    }
}

/** Guarda un valor como JSON. Devuelve true si se guardó. */
export async function setJSON(key, value) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        logger.error('almacenamiento', 'No se pudo guardar un dato en el almacenamiento local.', error);
        return false;
    }
}

/** Borra una clave. Devuelve true si se borró. */
export async function removeKey(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        logger.error('almacenamiento', 'No se pudo borrar un dato del almacenamiento local.', error);
        return false;
    }
}
