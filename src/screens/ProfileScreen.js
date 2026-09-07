import React, { useContext } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

export default function ProfileScreen({ navigation }) {
    const { userName, userEmail, dietaryPreference, allergies } = useContext(UserContext);

    const displayName = userName || 'Alex';
    const displayEmail = userEmail || 'alex@email.com';

    const displayInitials = displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    const handleLogout = () => {
        navigation.replace('Login');
    };

    const handleNavigateHistory = () => {
        navigation.navigate('History');
    };

    const handleNavigateDietPreferences = () => {
        navigation.navigate('DietaryPreferences');
    };

    const handleNavigateAllergies = () => {
        navigation.navigate('Allergies');
    };

    const handleNavigateSettings = () => {
        navigation.navigate('Settings');
    };

    return (
        <View style={styles.rootContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Superior */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Mi Perfil</Text>
                        <Text style={styles.headerSubtitle}>Gestiona tu cuenta y preferencias</Text>
                    </View>
                    <TouchableOpacity style={styles.settingsButton}>
                        <Feather name="settings" size={18} color="#3E2723" />
                    </TouchableOpacity>
                </View>

                {/* Tarjeta de Usuario */}
                <View style={styles.userCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{displayInitials}</Text>
                        <View style={styles.verifiedBadge}>
                            <Feather name="check" size={10} color="#FFF" />
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
                                <Feather name="camera" size={16} color="#84A98C" />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Historial de Preparaciones</Text>
                                <Text style={styles.menuSubtitle}>Fotos de tus recetas cocinadas</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="rgba(62, 39, 35, 0.4)" />
                        </TouchableOpacity>

                        {/* Preferencias de Dieta Dinámicas */}
                        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateDietPreferences}>
                            <View style={styles.menuIconBox}>
                                <Feather name="list" size={16} color="#84A98C" />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Preferencias de Dieta</Text>
                                <Text style={styles.menuSubtitle}>{dietaryPreference} seleccionada</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="rgba(62, 39, 35, 0.4)" />
                        </TouchableOpacity>

                        {/* Alergias Dinámicas */}
                        <TouchableOpacity style={styles.menuItem} onPress={handleNavigateAllergies}>
                            <View style={styles.menuIconBox}>
                                <Feather name="alert-triangle" size={16} color="#84A98C" />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Alergias e Intolerancias</Text>
                                <Text style={styles.menuSubtitle}>
                                    {Array.isArray(allergies) ? allergies.join(', ') : allergies}
                                </Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="rgba(62, 39, 35, 0.4)" />
                        </TouchableOpacity>

                        {/* Notificaciones */}
                        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleNavigateSettings}>
                            <View style={styles.menuIconBox}>
                                <Feather name="bell" size={16} color="#84A98C" />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Notificaciones</Text>
                                <Text style={styles.menuSubtitle}>Recordatorios de comida</Text>
                            </View>
                            <Feather name="chevron-right" size={18} color="rgba(62, 39, 35, 0.4)" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Botón de Cerrar Sesión */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Feather name="log-out" size={16} color="#E63946" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        width: '100%',
        maxWidth: 380,
        height: 800,
        minHeight: 800,
        maxHeight: 800,
        alignSelf: 'center',
        backgroundColor: '#FDFBF7',
        overflow: 'hidden',
    },
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
        color: '#3E2723',
        lineHeight: 28,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3E2723',
        opacity: 0.6,
        marginTop: 2,
    },
    settingsButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EAE6DF',
        borderWidth: 1,
        borderColor: '#DDD8CE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userCard: {
        marginHorizontal: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAE6DF',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#EAE6DF',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3E2723',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#84A98C',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    userName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#3E2723',
    },
    userEmail: {
        fontSize: 12,
        color: '#84A98C',
        fontWeight: '600',
        marginTop: 2,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#EAE6DF',
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
        color: '#3E2723',
    },
    statLabel: {
        fontSize: 10,
        color: 'rgba(62, 39, 35, 0.6)',
        fontWeight: '600',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: '#EAE6DF',
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeaderTitle: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(62, 39, 35, 0.5)',
        marginBottom: 8,
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    menuGroup: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAE6DF',
        borderRadius: 20,
        paddingHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#F4F1EA',
    },
    menuIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: 'rgba(132, 169, 140, 0.12)',
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
        color: '#3E2723',
    },
    menuSubtitle: {
        fontSize: 11,
        color: 'rgba(62, 39, 35, 0.6)',
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
        color: '#E63946',
        fontSize: 14,
        fontWeight: 'bold',
    },
});