import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { MEAL_SLOTS } from '../data/mealSlots';
import * as permissionsService from './permissionsService';

export const REMINDER_MINUTES_BEFORE = 15;
export const NOTIFICATION_CHANNEL_ID = 'recordatorios-comidas';
const log = (message, error) => {
    if (error) console.warn(`[notificaciones] ${message}`, error);
    else console.warn(`[notificaciones] ${message}`);
};

try {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });
} catch (error) {
    log('No se pudo configurar la presentación en primer plano.', error);
}
const makeReminderKey = (email, dateKey, slotId) => `${String(email).trim().toLowerCase()}|${dateKey}|${slotId}`;

async function ensureAndroidChannel() {
    if (Platform.OS !== 'android') return false;
    try {
        await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
            name: 'Recordatorios de comidas',
            importance: Notifications.AndroidImportance.HIGH,
        });
        return true;
    } catch (error) {
        log('No se pudo preparar el canal de recordatorios; se continuará con la programación.', error);
        return false;
    }
}

async function getScheduledForUser(userEmail) {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const email = String(userEmail).trim().toLowerCase();
    return all.filter((item) => String(item.content?.data?.userEmail || '').trim().toLowerCase() === email);
}

function buildReminderDate(dateKey, slotId) {
    const slot = MEAL_SLOTS.find((item) => item.id === slotId);
    if (!slot) throw new Error(`Comida desconocida: ${slotId}`);
    const dateParts = dateKey.split('-').map(Number);
    if (dateParts.length !== 3 || dateParts.some(Number.isNaN)) throw new Error(`Fecha inválida: ${dateKey}`);
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.defaultTime);
    if (!match) throw new Error(`Hora inválida para ${slotId}: ${slot.defaultTime}`);
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === 'PM') hour += 12;
    const mealDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hour, Number(match[2]), 0, 0);
    mealDate.setMinutes(mealDate.getMinutes() - REMINDER_MINUTES_BEFORE);
    return { date: mealDate, slot };
}

async function cancelScheduledReminder(userEmail, dateKey, slotId) {
    const reminderKey = makeReminderKey(userEmail, dateKey, slotId);
    const scheduled = await getScheduledForUser(userEmail);
    const matches = scheduled.filter((item) => item.content?.data?.reminderKey === reminderKey);
    for (const item of matches) {
        await Notifications.cancelScheduledNotificationAsync(item.identifier);
        log(`Recordatorio cancelado: ${reminderKey}`);
    }
    return matches.length;
}

export async function scheduleMealReminder({ userEmail, dateKey, slotId, recipe }) {
    try {
        if (!userEmail || !dateKey || !slotId || !recipe) return null;
        const reminderKey = makeReminderKey(userEmail, dateKey, slotId);
        await cancelScheduledReminder(userEmail, dateKey, slotId);
        if (await permissionsService.checkPermission('notifications') !== 'granted') return null;

        const { date, slot } = buildReminderDate(dateKey, slotId);
        if (date.getTime() <= Date.now()) {
            log(`Recordatorio omitido por hora pasada: ${reminderKey}`);
            return null;
        }

        const channelReady = await ensureAndroidChannel();
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: `Hora de tu ${slot.id}`,
                body: `Hoy toca: ${recipe.title || 'tu receta planificada'}. ¡Manos a la cocina!`,
                data: {
                    recipeId: String(recipe.id || ''),
                    dateKey,
                    slotId,
                    userEmail: String(userEmail).trim().toLowerCase(),
                    reminderKey,
                },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date,
                ...(channelReady ? { channelId: NOTIFICATION_CHANNEL_ID } : {}),
            },
        });
        log(`Recordatorio programado: ${reminderKey} (identificador ${identifier})`);
        return identifier;
    } catch (error) {
        log('No se pudo programar el recordatorio de comida.', error);
        return null;
    }
}

export async function cancelMealReminder(userEmail, dateKey, slotId) {
    try {
        const count = await cancelScheduledReminder(userEmail, dateKey, slotId);
        if (!count) log(`No había recordatorio para cancelar: ${makeReminderKey(userEmail, dateKey, slotId)}`);
        return true;
    } catch (error) {
        log(`No se pudo cancelar el recordatorio ${dateKey}|${slotId}.`, error);
        return false;
    }
}

export async function cancelAllReminders(userEmail) {
    try {
        if (!userEmail) return true;
        const scheduled = await getScheduledForUser(userEmail);
        const reminders = scheduled.filter((item) => typeof item.content?.data?.reminderKey === 'string');
        for (const item of reminders) {
            await Notifications.cancelScheduledNotificationAsync(item.identifier);
            log(`Recordatorio cancelado: ${item.content.data.reminderKey}`);
        }
        return true;
    } catch (error) {
        log('No se pudieron cancelar los recordatorios del usuario.', error);
        return false;
    }
}

export async function rescheduleAll(userEmail, plan, history, settings) {
    try {
        await cancelAllReminders(userEmail);
        if (!userEmail || !settings?.notifications || !settings?.mealReminders) return;
        if (await permissionsService.checkPermission('notifications') !== 'granted') return;

        const completed = new Set((Array.isArray(history) ? history : [])
            .filter((entry) => entry.source === 'plan' && entry.planKey && entry.slotId)
            .map((entry) => `${entry.planKey}|${entry.slotId}`));
        for (const [dateKey, meals] of Object.entries(plan || {})) {
            for (const slot of MEAL_SLOTS) {
                const recipe = meals?.[slot.id];
                if (!recipe || completed.has(`${dateKey}|${slot.id}`)) continue;
                await scheduleMealReminder({ userEmail, dateKey, slotId: slot.id, recipe });
            }
        }
    } catch (error) {
        log('No se pudieron sincronizar los recordatorios del plan.', error);
    }
}

export async function scheduleTestNotification(userEmail) {
    try {
        if (await permissionsService.checkPermission('notifications') !== 'granted') return null;
        const channelReady = await ensureAndroidChannel();
        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Notificación de prueba',
                body: 'Las notificaciones de FoodPlanner están listas.',
                data: { userEmail: String(userEmail || '').trim().toLowerCase(), kind: 'test' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: new Date(Date.now() + 5000),
                ...(channelReady ? { channelId: NOTIFICATION_CHANNEL_ID } : {}),
            },
        });
        log(`Notificación de prueba programada (identificador ${identifier}).`);
        return identifier;
    } catch (error) {
        log('No se pudo programar la notificación de prueba.', error);
        return null;
    }
}
