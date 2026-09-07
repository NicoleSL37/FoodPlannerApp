import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

// 1. GENERADOR DE FECHAS
const generateDates = () => {
    const dates = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const today = new Date();

    for (let i = -3; i <= 15; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);
        
        dates.push({
            day: dayNames[currentDate.getDay()],
            date: currentDate.getDate().toString(),
            fullDate: currentDate.toDateString(), // Usaremos esto como ID para buscar en la base de datos
            isToday: i === 0
        });
    }
    return dates;
};

// 2. SIMULADOR DE API / BASE DE DATOS
// Más adelante, en lugar de leer esto, harás un "fetch" a tu API usando el 'fullDate'.
const getMealsFromAPI = (fullDate) => {
    const today = new Date().toDateString();
    
    const mockDatabase = {
        [today]: { // El día de hoy tiene datos
            desayuno: { name: 'Bowl de Avena con Frutas y Chía', kcal: 320, time: '15 min', icon: 'cafe-outline' },
            almuerzo: { name: 'Tostadas de Aguacate y Huevo Poché', kcal: 450, time: '20 min', icon: 'restaurant-outline' },
            cena: null,
            snack: { name: 'Smoothie Verde Detox con Espinacas', kcal: 180, time: '5 min', icon: 'water-outline' }
        }
        // Los demás días devolverán 'undefined', por lo que saldrán vacíos listos para planear
    };

    return mockDatabase[fullDate] || { desayuno: null, almuerzo: null, cena: null, snack: null };
};

// 3. ESTRUCTURA DE TUS COMIDAS
const MEAL_SLOTS = [
    { id: 'desayuno', title: 'DESAYUNO', defaultTime: '08:30 AM', icon: 'cafe-outline' },
    { id: 'almuerzo', title: 'ALMUERZO', defaultTime: '01:30 PM', icon: 'restaurant-outline' },
    { id: 'cena', title: 'CENA', defaultTime: '08:00 PM', icon: 'moon-outline' },
    { id: 'snack', title: 'SNACK', defaultTime: '05:00 PM', icon: 'water-outline' },
];


export default function PlanScreen({ navigation }) {
    const [days, setDays] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [dailyPlan, setDailyPlan] = useState({}); // Aquí guardaremos las comidas del día seleccionado
    const scrollViewRef = useRef(null);

    // Carga inicial del calendario
    useEffect(() => {
        const generatedDays = generateDates();
        setDays(generatedDays);
        
        const todayIndex = generatedDays.findIndex(d => d.isToday);
        if (todayIndex !== -1) {
            setSelectedDate(generatedDays[todayIndex].fullDate);
            
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({ x: todayIndex * 60 - 40, animated: true });
            }, 100);
        }
    }, []);

    // Cada vez que seleccionas un día diferente, "llamamos a la API"
    useEffect(() => {
        if (selectedDate) {
            // AQUÍ CONECTARÁS TU API EN EL FUTURO:
            // const data = await fetch(`tu-api.com/planes?fecha=${selectedDate}`);
            // setDailyPlan(data);
            
            const data = getMealsFromAPI(selectedDate);
            setDailyPlan(data);
        }
    }, [selectedDate]);

    const handleComplete = () => {
        navigation.navigate('PreparationRecord');
    };

    return (
        <View style={styles.rootContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Plan Semanal</Text>
                        <Text style={styles.subtitle}>Organiza tus comidas</Text>
                    </View>
                    <View style={styles.weekBadge}>
                        <Feather name="calendar" size={12} color="#84A98C" />
                        <Text style={styles.weekBadgeText}>Semana Actual</Text>
                    </View>
                </View>

                {/* Calendario Dinámico */}
                <View style={styles.calendarContainer}>
                    <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
                        {days.map((item, index) => {
                            const isActive = selectedDate === item.fullDate;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedDate(item.fullDate)}
                                    style={[styles.dayCard, isActive ? styles.dayCardActive : styles.dayCardInactive]}
                                >
                                    <Text style={[styles.dayName, isActive ? styles.dayNameActive : styles.dayNameInactive]}>{item.day}</Text>
                                    <Text style={[styles.dayDate, isActive ? styles.dayDateActive : styles.dayDateInactive]}>{item.date}</Text>
                                    {isActive && <View style={styles.activeDot} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Resumen Nutricional */}
                <View style={styles.nutritionSummary}>
                    <View style={styles.nutritionLeft}>
                        <View style={styles.nutritionIconBox}>
                            <Ionicons name="flame" size={16} color="#84A98C" />
                        </View>
                        <View>
                            <Text style={styles.nutritionLabel}>Meta Calórica Diaria</Text>
                            <Text style={styles.nutritionValue}>1,480 / 1,800 kcal</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionPercentageBox}>
                        <Text style={styles.nutritionPercentageText}>82%</Text>
                    </View>
                </View>

                {/* Lista de Comidas Renderizada Dinámicamente */}
                <View style={styles.mealsContainer}>
                    {MEAL_SLOTS.map((slot) => {
                        const mealData = dailyPlan[slot.id]; // Buscamos si hay comida asignada a este slot

                        return (
                            <View key={slot.id} style={styles.mealSection}>
                                <View style={styles.mealHeader}>
                                    <Text style={styles.mealTitle}>{slot.title}</Text>
                                    <Text style={mealData ? styles.mealTime : styles.mealTimeEmpty}>
                                        {mealData ? slot.defaultTime : 'Sin asignar'}
                                    </Text>
                                </View>

                                {mealData ? (
                                    /* TARJETA LLENA */
                                    <View style={styles.mealCard}>
                                        <View style={styles.mealCardLeft}>
                                            <View style={styles.mealIconBox}>
                                                <Ionicons name={mealData.icon || slot.icon} size={20} color="#84A98C" />
                                            </View>
                                            <View style={styles.mealInfo}>
                                                <Text style={styles.mealName} numberOfLines={1}>{mealData.name}</Text>
                                                <View style={styles.mealMeta}>
                                                    <Text style={styles.mealMetaText}>🔥 {mealData.kcal} kcal</Text>
                                                    <Text style={styles.mealMetaDot}>•</Text>
                                                    <Text style={styles.mealMetaTime}>{mealData.time}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete}>
                                            <Feather name="check-circle" size={14} color="#84A98C" />
                                            <Text style={styles.completeBtnText}>Completar</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    /* TARJETA VACÍA */
                                    <TouchableOpacity style={styles.emptyMealCard} onPress={() => alert(`Explorar recetas para ${slot.title}`)}>
                                        <View style={styles.emptyIconBox}>
                                            <Feather name="plus" size={16} color="#84A98C" />
                                        </View>
                                        <Text style={styles.emptyMealText}>Añadir {slot.title}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1, 
        backgroundColor: '#FDFBF7',
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
    },
    scrollContent: {
        paddingBottom: 120, 
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 28,
        paddingBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#3E2723',
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#84A98C',
        marginTop: 4,
    },
    weekBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(234, 230, 223, 0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(132, 169, 140, 0.2)',
        gap: 6,
    },
    weekBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#3E2723',
    },
    calendarContainer: {
        marginTop: 8,
        marginBottom: 20,
    },
    calendarScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    dayCard: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 50,
        paddingVertical: 10,
        paddingHorizontal: 8,
        borderRadius: 16,
    },
    dayCardInactive: {
        backgroundColor: '#EAE6DF',
    },
    dayCardActive: {
        backgroundColor: '#84A98C',
        shadowColor: '#84A98C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    dayName: {
        fontSize: 11,
        fontWeight: '600',
    },
    dayNameInactive: {
        color: 'rgba(62, 39, 35, 0.7)',
    },
    dayNameActive: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontWeight: 'bold',
    },
    dayDate: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 2,
    },
    dayDateInactive: {
        color: '#3E2723',
    },
    dayDateActive: {
        color: '#FFF',
        fontWeight: '800',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFF',
        marginTop: 4,
    },
    nutritionSummary: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 14,
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EAE6DF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nutritionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    nutritionIconBox: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(132, 169, 140, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nutritionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: 'rgba(62, 39, 35, 0.6)',
    },
    nutritionValue: {
        fontSize: 14,
        fontWeight: '800',
        color: '#3E2723',
    },
    nutritionPercentageBox: {
        backgroundColor: 'rgba(132, 169, 140, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nutritionPercentageText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#84A98C',
    },
    mealsContainer: {
        paddingHorizontal: 20,
        gap: 16,
    },
    mealSection: {
        width: '100%',
    },
    mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    mealTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#3E2723',
        letterSpacing: 0.5,
    },
    mealTime: {
        fontSize: 11,
        fontWeight: '600',
        color: '#84A98C',
    },
    mealTimeEmpty: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(62, 39, 35, 0.4)',
    },
    mealCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#EAE6DF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
    },
    mealCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
        paddingRight: 8,
    },
    mealIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(234, 230, 223, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mealInfo: {
        flex: 1,
    },
    mealName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3E2723',
    },
    mealMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    mealMetaText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(62, 39, 35, 0.7)',
    },
    mealMetaDot: {
        fontSize: 10,
        color: 'rgba(62, 39, 35, 0.3)',
    },
    mealMetaTime: {
        fontSize: 11,
        fontWeight: '600',
        color: '#84A98C',
    },
    completeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#EAE6DF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeBtnText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#84A98C',
        marginTop: 2,
    },
    emptyMealCard: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#EAE6DF',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    emptyIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAE6DF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyMealText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'rgba(62, 39, 35, 0.7)',
    },
});