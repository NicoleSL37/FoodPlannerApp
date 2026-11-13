import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_STORAGE_KEY = '@foodplanner/v1/diagnostic/error-logs';
const MAX_MEMORY_LOGS = 100;
const MAX_PERSISTED_ERRORS = 50;

let memoryLogs = [];
let persistedErrors = [];
let hydrationPromise;
let persistQueue = Promise.resolve();

export function maskEmail(value) {
    if (typeof value !== 'string') return value;
    return value.replace(/([A-Z0-9._%+-]{1,2})[A-Z0-9._%+-]*(@[A-Z0-9.-]+\.[A-Z]{2,})/gi, '$1***$2');
}

function sanitize(value, key = '') {
    if (/password|contraseña|token|secret|authorization|credential/i.test(key)) return '[oculto]';
    if (value instanceof Error) {
        return {
            name: value.name,
            message: maskEmail(value.message),
            stack: maskEmail(value.stack || ''),
        };
    }
    if (typeof value === 'string') return maskEmail(value);
    if (Array.isArray(value)) return value.map((item) => sanitize(item));
    if (value && typeof value === 'object') {
        return Object.fromEntries(Object.entries(value).map(([itemKey, item]) => [itemKey, sanitize(item, itemKey)]));
    }
    return value;
}

async function hydratePersistedErrors() {
    if (!hydrationPromise) {
        hydrationPromise = (async () => {
            try {
                const raw = await AsyncStorage.getItem(LOG_STORAGE_KEY);
                const parsed = raw ? JSON.parse(raw) : [];
                persistedErrors = Array.isArray(parsed)
                    ? parsed.filter((entry) => entry && entry.level === 'ERROR' && typeof entry.timestamp === 'string').slice(-MAX_PERSISTED_ERRORS)
                    : [];
            } catch {
                persistedErrors = [];
            }
        })();
    }
    return hydrationPromise;
}

function remember(event) {
    memoryLogs.push(event);
    if (memoryLogs.length > MAX_MEMORY_LOGS) memoryLogs = memoryLogs.slice(-MAX_MEMORY_LOGS);
}

function persistError(event) {
    persistQueue = persistQueue.then(async () => {
        await hydratePersistedErrors();
        persistedErrors = [...persistedErrors, event].slice(-MAX_PERSISTED_ERRORS);
        try {
            await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(persistedErrors));
        } catch {
            // El registro en memoria sigue disponible aunque falle la persistencia del diagnóstico.
        }
    });
}

function write(level, moduleName, message, details) {
    const timestamp = new Date().toISOString();
    const safeMessage = String(maskEmail(message));
    const safeDetails = details === undefined ? undefined : sanitize(details);
    const event = {
        timestamp,
        level,
        module: String(moduleName || 'app'),
        message: safeMessage,
        ...(safeDetails === undefined ? {} : { details: safeDetails }),
    };
    remember(event);

    const line = `[${timestamp}] [${level}] [${event.module}] ${safeMessage}`;
    const output = level === 'ERROR' ? console.error
        : level === 'WARN' ? console.warn
            : level === 'DEBUG' ? console.debug
                : console.info;
    if (safeDetails === undefined) output(line);
    else output(line, safeDetails);

    if (level === 'ERROR') persistError(event);
    return event;
}

export const logger = {
    info: (moduleName, message, details) => write('INFO', moduleName, message, details),
    warn: (moduleName, message, details) => write('WARN', moduleName, message, details),
    error: (moduleName, message, details) => write('ERROR', moduleName, message, details),
    debug: (moduleName, message, details) => {
        if (typeof __DEV__ !== 'undefined' && __DEV__) return write('DEBUG', moduleName, message, details);
        return undefined;
    },
};

export async function getRecentLogs() {
    await hydratePersistedErrors();
    await persistQueue;
    const merged = new Map();
    [...persistedErrors, ...memoryLogs].forEach((event) => {
        merged.set(`${event.timestamp}|${event.level}|${event.module}|${event.message}`, event);
    });
    return [...merged.values()].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, MAX_MEMORY_LOGS);
}

export async function clearLogs() {
    await hydratePersistedErrors();
    await persistQueue;
    memoryLogs = [];
    persistedErrors = [];
    try {
        await AsyncStorage.removeItem(LOG_STORAGE_KEY);
        return true;
    } catch {
        return false;
    }
}
