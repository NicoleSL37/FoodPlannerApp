import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { Screen, PickRecipeModal } from '../components';
import { categoryLabel } from '../data/categories';
import { MEAL_SLOTS } from '../data/mealSlots';
import { buildDays, countPlanned, dateKey } from '../utils/plan';

export default function PlanScreen({ navigation, route }) {
    // El plan vive en UserContext y se guarda en AsyncStorage (por usuario)
    const { plan, setMeal, removeMeal, favorites, viewed, history } = useContext(UserContext);

    const days = useMemo(() => buildDays(3, 15), []);
    const [selectedKey, setSelectedKey] = useState(() => dateKey());
    const [pickerSlot, setPickerSlot] = useState(null); // comida para la que se está eligiendo receta
    const scrollViewRef = useRef(null);

    const scrollToDay = (key) => {
        const index = days.findIndex((d) => d.key === key);
        if (index === -1) return undefined;
        const timer = setTimeout(() => {
            scrollViewRef.current?.scrollTo({ x: index * 60 - 40, animated: true });
        }, 100);
        return () => clearTimeout(timer);
    };

    // Al abrir, el calendario se desplaza hasta el día de hoy
    useEffect(() => scrollToDay(dateKey()), [days]); // eslint-disable-line react-hooks/exhaustive-deps

    // Si llegas desde "Ver plan" en el detalle de una receta, se abre el día al que la agregaste
    const targetKey = route && route.params ? route.params.dateKey : undefined;
    useEffect(() => {
        if (!targetKey) return undefined;
        setSelectedKey(targetKey);
        return scrollToDay(targetKey);
    }, [targetKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const dailyPlan = plan[selectedKey] || {};
    const plannedCount = countPlanned(dailyPlan);
    const plannedPercent = Math.round((plannedCount / MEAL_SLOTS.length) * 100);

    // Recetas que se pueden elegir sin internet: favoritas primero y luego las vistas, sin repetir
    const candidates = useMemo(() => {
        const seen = new Set();
        const list = [];
        favorites.forEach((r) => {
            if (!seen.has(r.id)) { seen.add(r.id); list.push({ ...r, source: 'Favorita' }); }
        });
        viewed.forEach((r) => {
            if (!seen.has(r.id)) { seen.add(r.id); list.push({ ...r, source: 'Vista recientemente' }); }
        });
        return list;
    }, [favorites, viewed]);

    const pickerTitle = pickerSlot
        ? `Elegir ${MEAL_SLOTS.find((s) => s.id === pickerSlot).title.toLowerCase()}`
        : '';

    const handlePick = (recipe) => {
        setMeal(selectedKey, pickerSlot, recipe);
        setPickerSlot(null);
    };

    const handleRemove = (slot, meal) => {
        Alert.alert('Quitar del plan', `¿Quitar "${meal.title}" de ${slot.title.toLowerCase()}?`, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Quitar', style: 'destructive', onPress: () => removeMeal(selectedKey, slot.id) },
        ]);
    };

    // El plan guarda una receta compacta; en el detalle se muestra al instante y se piden ingredientes y pasos a la API
    const handleOpenRecipe = (meal) => {
        navigation.navigate('RecipeDetail', {
            recipeId: meal.id,
            recipe: { area: '', tag: '', ingredients: [], steps: [], diets: null, allergens: null, ...meal, isPartial: true },
        });
    };

    // Una comida está completada si ya se registró en el historial desde este día y esta comida
    const isCompleted = (slot, meal) =>
        history.some((h) => h.source === 'plan' && h.planKey === selectedKey && h.slotId === slot.id && h.recipeId === meal.id);

    const handleComplete = (slot, meal) => {
        navigation.navigate('PreparationRecord', { recipe: meal, source: 'plan', planKey: selectedKey, slotId: slot.id });
    };

    return (
        <Screen>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Plan Semanal</Text>
                        <Text style={styles.subtitle}>Organiza tus comidas</Text>
                    </View>
                    <View style={styles.weekBadge}>
                        <Feather name="calendar" size={12} color={colors.primary} />
                        <Text style={styles.weekBadgeText}>Semana Actual</Text>
                    </View>
                </View>

                {/* Calendario: un punto marca los días que ya tienen comidas planificadas */}
                <View style={styles.calendarContainer}>
                    <ScrollView ref={scrollViewRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
                        {days.map((item) => {
                            const isActive = selectedKey === item.key;
                            const hasMeals = Boolean(plan[item.key]);
                            return (
                                <TouchableOpacity
                                    key={item.key}
                                    onPress={() => setSelectedKey(item.key)}
                                    style={[styles.dayCard, isActive ? styles.dayCardActive : styles.dayCardInactive]}
                                >
                                    <Text style={[styles.dayName, isActive ? styles.dayNameActive : styles.dayNameInactive]}>{item.day}</Text>
                                    <Text style={[styles.dayDate, isActive ? styles.dayDateActive : styles.dayDateInactive]}>{item.date}</Text>
                                    {isActive && <View style={styles.activeDot} />}
                                    {!isActive && hasMeals && <View style={styles.planDot} />}
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Resumen del día (la API no entrega calorías, así que se cuentan las comidas planificadas) */}
                <View style={styles.nutritionSummary}>
                    <View style={styles.nutritionLeft}>
                        <View style={styles.nutritionIconBox}>
                            <Ionicons name="restaurant" size={16} color={colors.primary} />
                        </View>
                        <View>
                            <Text style={styles.nutritionLabel}>Comidas planificadas</Text>
                            <Text style={styles.nutritionValue}>{plannedCount} de {MEAL_SLOTS.length}</Text>
                        </View>
                    </View>
                    <View style={styles.nutritionPercentageBox}>
                        <Text style={styles.nutritionPercentageText}>{plannedPercent}%</Text>
                    </View>
                </View>

                {/* Lista de comidas del día seleccionado */}
                <View style={styles.mealsContainer}>
                    {MEAL_SLOTS.map((slot) => {
                        const meal = dailyPlan[slot.id];

                        return (
                            <View key={slot.id} style={styles.mealSection}>
                                <View style={styles.mealHeader}>
                                    <Text style={styles.mealTitle}>{slot.title}</Text>
                                    <Text style={meal ? styles.mealTime : styles.mealTimeEmpty}>
                                        {meal ? slot.defaultTime : 'Sin asignar'}
                                    </Text>
                                </View>

                                {meal ? (
                                    <TouchableOpacity style={styles.mealCard} activeOpacity={0.85} onPress={() => handleOpenRecipe(meal)}>
                                        <View style={styles.mealCardLeft}>
                                            <View style={[styles.mealIconBox, styles.mealThumb]}>
                                                {meal.image ? (
                                                    <Image source={{ uri: meal.image }} style={styles.mealThumbImage} resizeMode="cover" />
                                                ) : (
                                                    <Ionicons name={slot.icon} size={20} color={colors.primary} />
                                                )}
                                            </View>
                                            <View style={styles.mealInfo}>
                                                <Text style={styles.mealName} numberOfLines={1}>{meal.title}</Text>
                                                <Text style={styles.mealMetaTime} numberOfLines={1}>{categoryLabel(meal.category) || 'Receta'}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.mealActions}>
                                            {isCompleted(slot, meal) ? (
                                                <View style={[styles.completeBtn, styles.completeBtnDone]}>
                                                    <Feather name="check-circle" size={14} color={colors.white} />
                                                    <Text style={[styles.completeBtnText, styles.completeBtnTextDone]}>Hecho</Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity style={styles.completeBtn} onPress={() => handleComplete(slot, meal)}>
                                                    <Feather name="check-circle" size={14} color={colors.primary} />
                                                    <Text style={styles.completeBtnText}>Completar</Text>
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity
                                                style={styles.removeBtn}
                                                onPress={() => handleRemove(slot, meal)}
                                                accessibilityLabel={`Quitar ${meal.title} del plan`}
                                            >
                                                <Feather name="trash-2" size={16} color={colors.text50} />
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.emptyMealCard} onPress={() => setPickerSlot(slot.id)}>
                                        <View style={styles.emptyIconBox}>
                                            <Feather name="plus" size={16} color={colors.primary} />
                                        </View>
                                        <Text style={styles.emptyMealText}>Añadir {slot.title}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            <PickRecipeModal
                visible={pickerSlot !== null}
                title={pickerTitle}
                recipes={candidates}
                onClose={() => setPickerSlot(null)}
                onSelect={handlePick}
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    mealThumb: {
        overflow: 'hidden',
    },
    mealThumbImage: {
        width: '100%',
        height: '100%',
    },
    mealActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    completeBtnDone: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    completeBtnTextDone: {
        color: colors.white,
    },
    removeBtn: {
        padding: 8,
    },
    planDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        backgroundColor: colors.primary,
        marginTop: 4,
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
        color: colors.text,
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primary,
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
        borderColor: colors.primaryMid,
        gap: 6,
    },
    weekBadgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text,
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
        backgroundColor: colors.border,
    },
    dayCardActive: {
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
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
        color: colors.text70,
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
        color: colors.text,
    },
    dayDateActive: {
        color: colors.white,
        fontWeight: '800',
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.white,
        marginTop: 4,
    },
    nutritionSummary: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 14,
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
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
        backgroundColor: colors.primaryTint,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nutritionLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.text60,
    },
    nutritionValue: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.text,
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
        color: colors.primary,
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
        color: colors.text,
        letterSpacing: 0.5,
    },
    mealTime: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
    mealTimeEmpty: {
        fontSize: 11,
        fontWeight: '500',
        color: colors.text40,
    },
    mealCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: colors.black,
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
        color: colors.text,
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
        color: colors.text70,
    },
    mealMetaDot: {
        fontSize: 10,
        color: colors.text30,
    },
    mealMetaTime: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
    completeBtn: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    completeBtnText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.primary,
        marginTop: 2,
    },
    emptyMealCard: {
        width: '100%',
        paddingVertical: 20,
        borderRadius: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    emptyIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyMealText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text70,
    },
});