import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [mealReminders, setMealReminders] = useState(true);

    return (
        <View style={styles.rootContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Superior */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => navigation.goBack()}
                    >
                        <Feather name="arrow-left" size={18} color="#3E2723" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerTitle}>Configuración</Text>
                        <Text style={styles.headerSubtitle}>Ajustes y notificaciones</Text>
                    </View>
                </View>

                {/* Grupo de Opciones */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeaderTitle}>PREFERENCIAS DE LA APP</Text>

                    <View style={styles.menuGroup}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuIconBox}>
                                <Feather name="bell" size={16} color="#84A98C" />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Notificaciones Push</Text>
                                <Text style={styles.menuSubtitle}>Recibe avisos de nuevas recetas</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: '#EAE6DF', true: '#84A98C' }}
                                thumbColor="#FFF"
                            />
                        </View>

                        <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                            <View style={styles.menuIconBox}>
                                <Feather name="clock" size={16} color="#84A98C" />
                            </View>
                            <View style={styles.menuTexts}>
                                <Text style={styles.menuTitle}>Recordatorios de Comida</Text>
                                <Text style={styles.menuSubtitle}>Avisos para tu plan semanal</Text>
                            </View>
                            <Switch
                                value={mealReminders}
                                onValueChange={setMealReminders}
                                trackColor={{ false: '#EAE6DF', true: '#84A98C' }}
                                thumbColor="#FFF"
                            />
                        </View>
                    </View>
                </View>

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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
        gap: 12,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EAE6DF',
        borderWidth: 1,
        borderColor: '#DDD8CE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3E2723',
    },
    headerSubtitle: {
        fontSize: 11,
        fontWeight: '600',
        color: '#3E2723',
        opacity: 0.6,
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
        paddingVertical: 14,
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
});