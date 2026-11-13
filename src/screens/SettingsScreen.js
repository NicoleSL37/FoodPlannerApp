import React, { useCallback, useContext, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Switch,
    Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { PrimaryButton, Screen, ScreenHeader } from '../components';
import usePermission from '../hooks/usePermission';
import { scheduleTestNotification } from '../services/notificationService';

export default function SettingsScreen({ navigation }) {
    
    // Los ajustes viven en UserContext y se guardan en AsyncStorage (por usuario)
    const { settings, userEmail, updateSetting } = useContext(UserContext);
    const { notifications, mealReminders } = settings;
    const { status: permissionStatus, request, openSettings, isLoading, refresh } = usePermission('notifications');
    const notificationsGranted = permissionStatus === 'granted';
    const notificationRequestInProgress = useRef(false);
    const unavailableNoticeShown = useRef(false);
    const isExpoGo = Constants.executionEnvironment === 'storeClient' && Constants.appOwnership === 'expo';

    useFocusEffect(useCallback(() => {
        refresh();
    }, [refresh]));

    const handleOpenSettings = useCallback(async () => {
        const opened = await openSettings();
        if (!opened) Alert.alert('No se pudieron abrir los ajustes', 'Activa el permiso de notificaciones desde los ajustes del dispositivo.');
    }, [openSettings]);

    useEffect(() => {
        if (notificationRequestInProgress.current || isLoading || !notifications || notificationsGranted || permissionStatus === 'undetermined') return;
        updateSetting('notifications', false);
        updateSetting('mealReminders', false);
        if (permissionStatus === 'unavailable') {
            if (!unavailableNoticeShown.current) {
                unavailableNoticeShown.current = true;
                Alert.alert(
                    'Permiso de notificaciones',
                    'No se pudo verificar el permiso en este entorno. Revisa los ajustes de la app e inténtalo de nuevo con el build de la app.',
                    [
                        { text: 'Abrir ajustes', onPress: handleOpenSettings },
                        { text: 'Cerrar', style: 'cancel' },
                    ]
                );
            }
            return;
        }
        Alert.alert('Notificaciones desactivadas', 'El permiso del sistema no está concedido. Puedes volver a activarlo cuando quieras.');
    }, [handleOpenSettings, isLoading, notifications, notificationsGranted, permissionStatus, updateSetting]);

    const handleEnableNotifications = useCallback(async () => {
        if (isLoading) return;
        if (permissionStatus === 'granted') {
            updateSetting('notifications', true);
            return;
        }

        notificationRequestInProgress.current = true;
        let result;
        try {
            result = await request();
        } finally {
            notificationRequestInProgress.current = false;
        }
        if (result === 'granted') {
            updateSetting('notifications', true);
            return;
        }

        updateSetting('notifications', false);
        updateSetting('mealReminders', false);
        if (result === 'unavailable') {
            unavailableNoticeShown.current = true;
            Alert.alert(
                'Permiso de notificaciones',
                'No se pudo verificar el permiso en este entorno. Revisa los ajustes de la app e inténtalo de nuevo con el build de la app.',
                [
                    { text: 'Abrir ajustes', onPress: handleOpenSettings },
                    { text: 'Cerrar', style: 'cancel' },
                ]
            );
            return;
        }
        Alert.alert(
            'Permiso de notificaciones',
            result === 'undetermined'
                ? 'FoodPlanner necesita permiso para enviarte recordatorios de las comidas planificadas.'
                : 'El permiso no está concedido. Puedes volver a intentarlo o activarlo desde los ajustes del dispositivo.',
            [
                { text: 'Ahora no', style: 'cancel' },
                {
                    text: 'Volver a intentar',
                    onPress: handleEnableNotifications,
                },
                {
                    text: 'Abrir ajustes',
                    onPress: handleOpenSettings,
                },
            ]
        );
    }, [handleOpenSettings, isLoading, permissionStatus, request, updateSetting]);

    const handleNotificationsChange = (value) => {
        if (!value) {
            updateSetting('notifications', false);
            updateSetting('mealReminders', false);
            return;
        }
        handleEnableNotifications();
    };

    const handleTestNotification = async () => {
        const identifier = await scheduleTestNotification(userEmail);
        Alert.alert(
            identifier ? 'Notificación programada' : 'No se pudo programar',
            identifier ? 'Recibirás una notificación de prueba en unos segundos.' : 'Verifica el permiso de notificaciones e inténtalo de nuevo.'
        );
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <ScreenHeader
                    title="Configuración"
                    subtitle="Ajustes y notificaciones"
                    onBack={() => navigation.goBack()}
                />

                {/* Grupo de Opciones */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeaderTitle}>PREFERENCIAS DE LA APP</Text>

                    <View style={styles.menuGroup}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIconBox}>
                                <Feather name="bell" size={16} color={colors.primary} />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Notificaciones Push</Text>
                                <Text style={styles.menuSubtitle}>Permite enviar recordatorios de las comidas planificadas</Text>
                            </View>
                            <Switch
                                value={notifications && notificationsGranted}
                                onValueChange={handleNotificationsChange}
                                disabled={isLoading}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor={colors.white}
                            />
                        </View>

                        <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                            <View style={styles.menuIconBox}>
                                <Feather name="clock" size={16} color={colors.primary} />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Recordatorios de Comida</Text>
                                <Text style={styles.menuSubtitle}>Avisos para tu plan semanal</Text>
                            </View>
                            <Switch
                                value={mealReminders && notifications && notificationsGranted}
                                onValueChange={(value) => updateSetting('mealReminders', Boolean(value && notifications && notificationsGranted))}
                                disabled={!notifications || !notificationsGranted || isLoading}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor={colors.white}
                            />
                        </View>
                    </View>
                    <Text style={styles.hint}>
                        Los recordatorios llegan 15 minutos antes de la hora de cada comida planificada.
                    </Text>
                    <PrimaryButton
                        title="Enviar notificación de prueba"
                        icon="bell"
                        onPress={handleTestNotification}
                        disabled={!notificationsGranted || isLoading}
                        style={styles.testButton}
                    />
                    {isExpoGo && (
                        <Text style={styles.expoGoHint}>
                            En Expo Go las notificaciones tienen limitaciones. Prueba en el build de la app.
                        </Text>
                    )}
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeaderTitle}>DIAGNÓSTICO</Text>
                    <View style={styles.menuGroup}>
                        <View style={styles.diagnosticInfo}>
                            <Text style={styles.menuTitle}>Versión {Constants.expoConfig?.version || 'No disponible'}</Text>
                            <Text style={styles.menuSubtitle}>
                                Entorno: {typeof __DEV__ !== 'undefined' && __DEV__ ? 'Desarrollo' : 'Build'}
                            </Text>
                        </View>
                        <Text style={styles.hint}>El registro oculta los datos sensibles.</Text>
                        <PrimaryButton
                            title="Ver registro de eventos"
                            icon="activity"
                            onPress={() => navigation.navigate('Diagnostics')}
                            style={styles.diagnosticButton}
                        />
                    </View>
                </View>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 30,
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeaderTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: colors.text50,
        marginBottom: 8,
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    menuGroup: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderColor: colors.surfaceMuted,
    },
    menuIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    menuTexts: {
        flex: 1,
    },
    menuTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.text,
    },
    hint: {
        fontSize: 11,
        color: colors.text50,
        marginTop: 10,
        marginLeft: 4,
    },
    testButton: {
        marginTop: 12,
    },
    expoGoHint: {
        fontSize: 10,
        color: colors.text50,
        marginTop: 5,
        marginLeft: 4,
    },
    menuSubtitle: {
        fontSize: 11,
        color: colors.text60,
        marginTop: 1,
    },
    diagnosticInfo: {
        paddingTop: 14,
    },
    diagnosticButton: {
        marginTop: 12,
        marginBottom: 14,
    },
});
