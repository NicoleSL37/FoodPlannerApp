import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { MEAL_SLOTS } from '../data/mealSlots';
import { getMealDateTime } from '../utils/plan';
import * as permissionsService from './permissionsService';
import { logger } from '../utils/logger';

export const REMINDER_MINUTES_BEFORE = 15;
export const NOTIFICATION_CHANNEL_ID = 'recordatorios-comidas';
const log = (level, message, details) => logger[level]('notificaciones', message, details);

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
    log('error', 'No se pudo configurar la presentación en primer plano.', error);
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
        log('warn', 'No se pudo preparar el canal de recordatorios; se continuará con la programación.', error);
        return false;
    }
}

async function getScheduledForUser(userEmail) {
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const email = String(userEmail).trim().toLowerCase();
    return all.filter((item) => String(item.content?.data?.userEmail || '').trim().toLowerCase() === email);
}

export function getMealReminderDate(dateKey, slotId) {
    const slot = MEAL_SLOTS.find((item) => item.id === slotId);
    if (!slot) throw new Error(`Comida desconocida: ${slotId}`);
    const mealDate = getMealDateTime(dateKey, slotId);
    if (!mealDate) throw new Error(`Fecha u hora inválida para ${dateKey}|${slotId}.`);
    mealDate.setMinutes(mealDate.getMinutes() - REMINDER_MINUTES_BEFORE);
    return mealDate;
}

async function cancelScheduledReminder(userEmail, dateKey, slotId) {
    const reminderKey = makeReminderKey(userEmail, dateKey, slotId);
    const scheduled = await getScheduledForUser(userEmail);
    const matches = scheduled.filter((item) => item.content?.data?.reminderKey === reminderKey);
    for (const item of matches) {
        await Notifications.cancelScheduledNotificationAsync(item.identifier);
    }
    if (matches.length) log('info', `Recordatorios cancelados para ${dateKey}|${slotId}: ${matches.length}.`);
    return matches.length;
}

export async function scheduleMealReminder({ userEmail, dateKey, slotId, recipe }) {
    try {
        if (!userEmail || !dateKey || !slotId || !recipe) return null;
        const reminderKey = makeReminderKey(userEmail, dateKey, slotId);
        await cancelScheduledReminder(userEmail, dateKey, slotId);
        if (await permissionsService.checkPermission('notifications') !== 'granted') return null;

        const slot = MEAL_SLOTS.find((item) => item.id === slotId);
        const date = getMealReminderDate(dateKey, slotId);
        if (date.getTime() <= Date.now()) {
            log('info', `Recordatorio omitido por hora pasada: ${dateKey}|${slotId}.`);
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
        log('info', `Recordatorio programado: ${dateKey}|${slotId}.`);
        return identifier;
    } catch (error) {
        log('error', 'No se pudo programar el recordatorio de comida.', error);
        return null;
    }
}

export async function cancelMealReminder(userEmail, dateKey, slotId) {
    try {
        const count = await cancelScheduledReminder(userEmail, dateKey, slotId);
        log('info', `Cancelación individual completada para ${dateKey}|${slotId}: ${count}.`);
        return true;
    } catch (error) {
        log('error', `No se pudo cancelar el recordatorio ${dateKey}|${slotId}.`, error);
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
        }
        log('info', `Total de recordatorios cancelados: ${reminders.length}.`);
        return reminders.length;
    } catch (error) {
        log('error', 'No se pudieron cancelar los recordatorios del usuario.', error);
        return 0;
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
        let scheduledCount = 0;
        let completedCount = 0;
        let pastCount = 0;
        for (const [dateKey, meals] of Object.entries(plan || {})) {
            for (const slot of MEAL_SLOTS) {
                const recipe = meals?.[slot.id];
                if (!recipe) continue;
                if (completed.has(`${dateKey}|${slot.id}`)) {
                    completedCount += 1;
                    continue;
                }
                if (getMealReminderDate(dateKey, slot.id).getTime() <= Date.now()) pastCount += 1;
                const identifier = await scheduleMealReminder({ userEmail, dateKey, slotId: slot.id, recipe });
                if (identifier) scheduledCount += 1;
            }
        }
        log('info', `Sincronización terminada: ${scheduledCount} programados, ${completedCount} omitidos por preparación registrada, ${pastCount} omitidos por hora pasada.`);
    } catch (error) {
        log('error', 'No se pudieron sincronizar los recordatorios del plan.', error);
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
        log('info', `Notificación de prueba programada (identificador ${identifier}).`);
        return identifier;
    } catch (error) {
        log('error', 'No se pudo programar la notificación de prueba.', error);
        return null;
    }
}
