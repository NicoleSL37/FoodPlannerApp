import React, { useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { Screen, ScreenHeader } from '../components';

export default function SettingsScreen({ navigation }) {
    // Los ajustes viven en UserContext y se guardan en AsyncStorage (por usuario)
    const { settings, updateSetting } = useContext(UserContext);
    const { notifications, mealReminders } = settings;

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
                                <Text style={styles.menuSubtitle}>Recibe avisos de nuevas recetas</Text>
                            </View>
                            <Switch
                                value={notifications}
                                onValueChange={(value) => updateSetting('notifications', value)}
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
                                value={mealReminders && notifications}
                                onValueChange={(value) => updateSetting('mealReminders', value)}
                                disabled={!notifications}
                                trackColor={{ false: colors.border, true: colors.primary }}
                                thumbColor={colors.white}
                            />
                        </View>
                    </View>
                    <Text style={styles.hint}>
                        Tus preferencias se guardan en este celular. Los avisos se activarán en una próxima versión.
                    </Text>
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
    menuSubtitle: {
        fontSize: 11,
        color: colors.text60,
        marginTop: 1,
    },
});