// Utilidades del plan semanal: fechas (clave AAAA-MM-DD en hora local) y receta compacta.
import { MEAL_SLOTS } from '../data/mealSlots';

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/** Clave de un día en hora local, por ejemplo "2026-10-16". Es la clave del plan guardado. */
export function dateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

/** Días para el calendario: `before` días atrás y `after` días adelante, empezando en hoy. */
export function buildDays(before = 3, after = 14) {
    const today = new Date();
    const days = [];
    for (let i = -before; i <= after; i++) {
        const current = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
        days.push({
            key: dateKey(current),
            day: DAY_NAMES[current.getDay()],
            date: String(current.getDate()),
            isToday: i === 0,
        });
    }
    return days;
}

/** "Hoy", "Mañana" o "Lun 19" a partir de una clave AAAA-MM-DD. */
export function formatDayLabel(key) {
    const [y, m, d] = key.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const today = new Date();
    const diff = Math.round((date - new Date(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    return `${DAY_NAMES[date.getDay()]} ${d}`;
}

/** Del plan solo se guarda lo necesario para mostrar la tarjeta; el detalle completo se pide a la API. */
export const toPlanMeal = (recipe) => ({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image || null,
    category: recipe.category || '',
    icon: recipe.icon || 'coffee',
});

/** Cuántas de las comidas del día ya tienen receta. */
export const countPlanned = (dayPlan) => MEAL_SLOTS.filter((slot) => dayPlan && dayPlan[slot.id]).length;

const MONTH_NAMES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "Hoy, 08:30 AM", "Ayer, 08:30 AM" o "16 oct, 08:30 AM" a partir de una fecha ISO (sin depender del idioma del celular). */
export function formatTimestamp(iso) {
    const date = new Date(iso);
    const hours = date.getHours();
    const time = `${String(hours % 12 || 12).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${hours < 12 ? 'AM' : 'PM'}`;
    const today = new Date();
    const diff = Math.round(
        (new Date(today.getFullYear(), today.getMonth(), today.getDate()) -
            new Date(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000
    );
    if (diff === 0) return `Hoy, ${time}`;
    if (diff === 1) return `Ayer, ${time}`;
    return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}, ${time}`;
}
