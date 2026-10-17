import { useEffect, useState } from 'react';

/**
 * Devuelve `value` solo después de que deja de cambiar durante `delay` ms.
 * Se usa en el buscador para no llamar a la API en cada letra que se escribe.
 */
export default function useDebouncedValue(value, delay = 500) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer); // limpieza: cancela el temporizador anterior
    }, [value, delay]);

    return debounced;
}
