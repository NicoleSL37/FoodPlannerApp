import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { PrimaryButton, Screen, ScreenHeader } from '../components';
import { clearLogs, getRecentLogs } from '../utils/logger';

const LEVELS = ['TODOS', 'INFO', 'WARN', 'ERROR', 'DEBUG'];

export default function DiagnosticsScreen({ navigation }) {
    const [logs, setLogs] = useState([]);
    const [levelFilter, setLevelFilter] = useState('TODOS');
    const version = Constants.expoConfig?.version || 'No disponible';
    const environment = typeof __DEV__ !== 'undefined' && __DEV__ ? 'Desarrollo' : 'Build';

    const refreshLogs = useCallback(async () => {
        setLogs(await getRecentLogs());
    }, []);

    useFocusEffect(useCallback(() => {
        refreshLogs();
    }, [refreshLogs]));

    const handleClearLogs = () => {
        Alert.alert('Borrar registro', '¿Quieres borrar los eventos recientes y los errores guardados?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Borrar',
                style: 'destructive',
                onPress: async () => {
                    await clearLogs();
                    await refreshLogs();
                },
            },
        ]);
    };

    const visibleLogs = levelFilter === 'TODOS' ? logs : logs.filter((entry) => entry.level === levelFilter);

    return (
        <Screen>
            <ScreenHeader title="Registro de eventos" onBack={() => navigation.goBack()} />
            <View style={styles.filterWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
                    {LEVELS.map((level) => (
                        <TouchableOpacity
                            key={level}
                            style={[styles.filter, levelFilter === level && styles.filterActive]}
                            onPress={() => setLevelFilter(level)}
                            accessibilityRole="button"
                        >
                            <Text style={[styles.filterText, levelFilter === level && styles.filterTextActive]}>{level}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <ScrollView contentContainerStyle={styles.logList} showsVerticalScrollIndicator={false}>
                {visibleLogs.length ? visibleLogs.map((entry, index) => (
                    <View key={`${entry.timestamp}-${entry.level}-${index}`} style={styles.logCard}>
                        <View style={styles.logHeader}>
                            <Text style={[styles.logLevel, styles[`level${entry.level}`]]}>{entry.level}</Text>
                            <Text style={styles.logModule}>{entry.module}</Text>
                        </View>
                        <Text style={styles.logMessage}>{entry.message}</Text>
                        <Text style={styles.logTime}>{new Date(entry.timestamp).toLocaleString('es-PE')}</Text>
                        {entry.details !== undefined && (
                            <Text style={styles.logDetails} numberOfLines={5}>
                                {typeof entry.details === 'string' ? entry.details : JSON.stringify(entry.details)}
                            </Text>
                        )}
                    </View>
                )) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No hay eventos para mostrar</Text>
                        <Text style={styles.emptyMessage}>Los avisos y errores aparecerán aquí mientras usas la aplicación.</Text>
                    </View>
                )}
            </ScrollView>
            <View style={styles.actions}>
                <PrimaryButton title="Borrar registro" icon="trash-2" onPress={handleClearLogs} />
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    filterWrapper: { paddingHorizontal: 20, paddingBottom: 8 },
    filters: { gap: 8, paddingVertical: 4 },
    filter: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, backgroundColor: colors.border },
    filterActive: { backgroundColor: colors.primary },
    filterText: { color: colors.text70, fontSize: 11, fontWeight: '700' },
    filterTextActive: { color: colors.white },
    logList: { paddingHorizontal: 20, paddingBottom: 12, gap: 10, flexGrow: 1 },
    logCard: { padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
    logHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logLevel: { fontSize: 10, fontWeight: '800' },
    levelINFO: { color: colors.primary },
    levelWARN: { color: colors.accent },
    levelERROR: { color: colors.danger },
    levelDEBUG: { color: colors.text50 },
    logModule: { fontSize: 11, fontWeight: '700', color: colors.text60 },
    logMessage: { marginTop: 6, fontSize: 12, color: colors.text, lineHeight: 17 },
    logTime: { marginTop: 5, fontSize: 10, color: colors.text50 },
    logDetails: { marginTop: 6, fontSize: 10, color: colors.text60 },
    emptyState: { alignItems: 'center', paddingVertical: 42, paddingHorizontal: 24 },
    emptyTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
    emptyMessage: { color: colors.text60, fontSize: 12, textAlign: 'center', marginTop: 5 },
    actions: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8 },
});
