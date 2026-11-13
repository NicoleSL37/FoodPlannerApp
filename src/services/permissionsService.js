import { Linking, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { getJSON, setJSON } from '../storage/storage';
import { logger } from '../utils/logger';

const warn = (action, error) => logger.warn('permisos', action, error);
const permissionLabel = (kind) => kind === 'camera' ? 'cámara' : 'notificaciones';
const isExpoGo = Constants.executionEnvironment === 'storeClient' && Constants.appOwnership === 'expo';

function logPermissionResult(kind, permission, action) {
    const status = permission?.status ?? 'desconocido';
    const canAskAgain = typeof permission?.canAskAgain === 'boolean' ? permission.canAskAgain : 'desconocido';
    logger.debug('permisos', `${permissionLabel(kind)} status=${status} canAskAgain=${canAskAgain} accion=${action}`);
}

function logPermissionStatus(kind, status, action) {
    const message = `Permiso de ${permissionLabel(kind)}: ${status} (acción ${action}).`;
    if (status === 'granted') logger.info('permisos', message);
    else if (status === 'denied' || status === 'blocked' || status === 'unavailable') logger.warn('permisos', message);
    else logger.debug('permisos', message);
}

function logUnavailable(kind, permission, action) {
    warn(`${permissionLabel(kind)} devolvió un estado no válido en ${action}`, permission);
}

const REQUESTED_KEYS = {
    camera: '@foodplanner/v1/permissions/camera-requested',
    notifications: '@foodplanner/v1/permissions/notifications-requested',
};

function normalizePermission(permission, kind) {
    if (!permission || typeof permission.status !== 'string') return 'unavailable';
    if (kind === 'notifications' && isExpoGo && permission.status === 'undetermined') return 'unavailable';

    if (kind === 'notifications' && Platform.OS === 'ios') {
        const iosStatus = permission.ios?.status;
        if ([
            Notifications.IosAuthorizationStatus.AUTHORIZED,
            Notifications.IosAuthorizationStatus.PROVISIONAL,
            Notifications.IosAuthorizationStatus.EPHEMERAL,
        ].includes(iosStatus)) return 'granted';
        if (iosStatus === Notifications.IosAuthorizationStatus.NOT_DETERMINED) return 'undetermined';
        if (iosStatus === Notifications.IosAuthorizationStatus.DENIED) {
            return permission.canAskAgain === false ? 'blocked' : 'denied';
        }
    }

    if (permission.granted || permission.status === 'granted') return 'granted';
    if (permission.status === 'undetermined') return 'undetermined';
    if (permission.status === 'denied') return permission.canAskAgain === false ? 'blocked' : 'denied';
    return 'unavailable';
}

async function createAndroidNotificationChannel() {
    if (Platform.OS !== 'android') return true;
    try {
        await Notifications.setNotificationChannelAsync('recordatorios-comidas', {
            name: 'Recordatorios de comidas',
            importance: Notifications.AndroidImportance.HIGH,
        });
        return true;
    } catch (error) {
        warn('No se pudo preparar el canal de notificaciones', error);
        return false;
    }
}

async function readPermission(kind) {
    if (kind === 'camera') return Camera.getCameraPermissionsAsync();
    if (kind === 'notifications') return Notifications.getPermissionsAsync();
    throw new Error(`Tipo de permiso desconocido: ${kind}`);
}

async function wasPermissionRequested(kind) {
    return (await getJSON(REQUESTED_KEYS[kind], false)) === true;
}

async function markPermissionRequested(kind) {
    const saved = await setJSON(REQUESTED_KEYS[kind], true);
    if (!saved) warn(`No se pudo guardar que ya se solicitó el permiso de ${kind}`, new Error('No se pudo guardar en el almacenamiento local.'));
}

export async function checkPermission(kind) {
    try {
        const permission = await readPermission(kind);
        logPermissionResult(kind, permission, 'check');
        const status = normalizePermission(permission, kind);
        if (status === 'unavailable') logUnavailable(kind, permission, 'check');
        const finalStatus = status === 'denied' && await wasPermissionRequested(kind) ? 'blocked' : status;
        logPermissionStatus(kind, finalStatus, 'check');
        return finalStatus;
    } catch (error) {
        logPermissionResult(kind, null, 'check');
        logger.error('permisos', `No se pudo consultar el permiso de ${kind}.`, error);
        return 'unavailable';
    }
}

export async function requestPermission(kind) {
    let permissionForLog = null;
    try {
        if (kind === 'notifications') await createAndroidNotificationChannel();

        const beforePermission = await readPermission(kind);
        permissionForLog = beforePermission;
        const beforeStatus = normalizePermission(beforePermission, kind);
        const alreadyRequested = await wasPermissionRequested(kind);
        if (beforeStatus === 'granted') {
            logPermissionResult(kind, beforePermission, 'request');
            logPermissionStatus(kind, 'granted', 'request');
            return 'granted';
        }
        if (beforeStatus === 'blocked' || (beforeStatus === 'denied' && alreadyRequested)) {
            logPermissionResult(kind, beforePermission, 'request');
            logPermissionStatus(kind, 'blocked', 'request');
            return 'blocked';
        }

        let result;
        if (kind === 'camera') {
            result = await Camera.requestCameraPermissionsAsync();
        } else if (kind === 'notifications') {
            result = await Notifications.requestPermissionsAsync({
                ios: { allowAlert: true, allowBadge: false, allowSound: true },
            });
        } else throw new Error(`Tipo de permiso desconocido: ${kind}`);

        permissionForLog = result;
        logPermissionResult(kind, result, 'request');
        await markPermissionRequested(kind);
        const requestedStatus = normalizePermission(result, kind);
        if (requestedStatus === 'unavailable') logUnavailable(kind, result, 'request');
        const finalStatus = requestedStatus === 'denied' && beforeStatus === 'denied' ? 'blocked' : requestedStatus;
        logPermissionStatus(kind, finalStatus, 'request');
        return finalStatus;
    } catch (error) {
        logPermissionResult(kind, permissionForLog, 'request');
        logger.error('permisos', `No se pudo solicitar el permiso de ${kind}.`, error);
        return 'unavailable';
    }
}

export async function openAppSettings() {
    try {
        await Linking.openSettings();
        return true;
    } catch (error) {
        warn('No se pudieron abrir los ajustes del dispositivo', error);
        return false;
    }
}
