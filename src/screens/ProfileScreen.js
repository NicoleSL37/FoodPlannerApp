import React, { useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { Screen } from '../components';

export default function ProfileScreen({ navigation }) {
    const { userName, userEmail, dietaryPreference, allergies, resetUser } = useContext(UserContext);

    const displayName = userName || 'Usuario';
    const displayEmail = userEmail || 'Sin correo registrado';

    const displayInitials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const handleLogout = () => {
        resetUser();
        // El Perfil vive dentro de las pestañas: reiniciamos el stack padre para volver al Login.
        const root = navigation.getParent() || navigation;
        root.reset({ index: 0, routes: [{ name: 'Login' }] });
    };

    const handleNavigateHistory = () => {
        navigation.navigate('History');
    };

    const handleNavigateDietPreferences = () => {
        navigation.navigate('DietaryPreferences', { mode: 'edit' });
    };

    const handleNavigateAllergies = () => {
        navigation.navigate('Allergies', { mode: 'edit' });
    };

    const handleNavigateSettings = () => {
        navigation.navigate('Settings');
    };

    return (
        <Screen>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Superior */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Mi Perfil</Text>
                        <Text style={styles.headerSubtitle}>Gestiona tu cuenta y preferencias</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Feather name="settings" size={18} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Tarjeta de Usuario */}
                <View style={styles.userCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{displayInitials}</Text>
                        <View style={styles.verifiedBadge}>
                            <Feather name="check" size={10} color={colors.white} />
                        </View>
                    </View>
                    <Text style={styles.userName}>{displayName}</Text>
                    <Text style={styles.userEmail}>{displayEmail}</Text>

                    {/* Estadísticas rápidas */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>14</Text>
                            <Text style={styles.statLabel}>Días activo</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>8</Text>
                            <Text style={styles.statLabel}>Planes hechos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statNumber}>2</Text>
                            <Text style={styles.statLabel}>Favoritos</Text>
                        </View>
                    </View>
                </View>

                {/* Sección Configuración de Alimentación */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeaderTitle}>CONFIGURACIÓN DE ALIMENTACIÓN</Text>

                    <View style={styles.menuGroup}>
                        {/* Historial */}
                        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateHistory}>
                            <View style={styles.menuIconBox}>
                                <Feather name="camera" size={16} color={colors.primary} />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Historial de Preparaciones</Text>
                                <Text style={styles.menuSubtitle}>Fotos de tus recetas cocinadas</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color={colors.text40} />
                        </TouchableOpacity>

                        {/* Preferencias de Dieta Dinámicas */}
                        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateDietPreferences}>
                            <View style={styles.menuIconBox}>
                                <Feather name="list" size={16} color={colors.primary} />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Preferencias de Dieta</Text>
                                <Text style={styles.menuSubtitle}>{dietaryPreference} seleccionada</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color={colors.text40} />
                        </TouchableOpacity>

                        {/* Alergias Dinámicas */}
                        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateAllergies}>
                            <View style={styles.menuIconBox}>
                                <Feather name="alert-triangle" size={16} color={colors.primary} />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Alergias e Intolerancias</Text>
                                <Text style={styles.menuSubtitle}>
                                    {Array.isArray(allergies) ? allergies.join(', ') : allergies}
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={18} color={colors.text40} />
                        </TouchableOpacity>

                        {/* Notificaciones */}
                        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleNavigateSettings}>
                            <View style={styles.menuIconBox}>
                                <Feather name="bell" size={16} color={colors.primary} />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Notificaciones</Text>
                                <Text style={styles.menuSubtitle}>Recordatorios de comida</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color={colors.text40} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botón de Cerrar Sesión */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Feather name="log-out" size={16} color={colors.danger} style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.text,
        lineHeight: 28,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text,
        opacity: 0.6,
        marginTop: 2,
    },
    settingsButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: colors.border,
        borderWidth: 1,
        borderColor: colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCard: {
        marginHorizontal: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    userName: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.text,
    },
    userEmail: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
        marginTop: 2,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderColor: colors.border,
        paddingTop: 16,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.text,
    },
    statLabel: {
        fontSize: 10,
        color: colors.text60,
        fontWeight: '600',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: colors.border,
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
        paddingVertical: 12,
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
    menuSubtitle: {
        fontSize: 11,
        color: colors.text60,
        marginTop: 1,
    },
    logoutButton: {
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: 'rgba(230, 57, 70, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(230, 57, 70, 0.2)',
        borderRadius: 16,
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        color: colors.danger,
        fontSize: 14,
        fontWeight: 'bold',
    },
});