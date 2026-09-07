import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
    const [activeFilter, setActiveFilter] = useState('Todas');

    const filters = ['Todas', 'Desayuno', 'Almuerzo', 'Cena'];

    // Lista de recetas favoritas con sus categorías bien definidas
    const favoritesList = [
        {
            id: '1',
            title: 'Bowl de Avena con Frutas y Chía',
            time: '15 min',
            calories: '320 kcal',
            category: 'Desayuno',
            tag: 'Saludable',
            icon: 'coffee',
        },
        {
            id: '2',
            title: 'Tostadas de Aguacate y Huevo Poché',
            time: '10 min',
            calories: '280 kcal',
            category: 'Almuerzo',
            tag: 'Energético',
            icon: 'sun',
        },
        {
            id: '3',
            title: 'Pechuga de Pollo al Horno con Vegetales',
            time: '25 min',
            calories: '410 kcal',
            category: 'Cena',
            tag: 'Proteico',
            icon: 'moon',
        },
    ];

    // Lógica de filtrado mejorada
    const filteredRecipes = activeFilter === 'Todas'
        ? favoritesList
        : favoritesList.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());

    const handleRecipePress = (recipeTitle) => {
        console.log('Abriendo receta:', recipeTitle);
        navigation.navigate('RecipeDetail');
    };

    return (
        <View style={styles.rootContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

            {/* ScrollView Principal */}
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Mis Favoritos</Text>
                        <Text style={styles.subtitle}>Recetas guardadas para después</Text>
                    </View>
                    {/* Contador Badge */}
                    <View style={styles.counterBadge}>
                        <Ionicons name="heart" size={11} color="#E63946" />
                        <Text style={styles.counterText}>{filteredRecipes.length}</Text>
                    </View>
                </View>

                {/* Filtros Rápidos (Horizontal) */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        {filters.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    onPress={() => setActiveFilter(filter)}
                                    style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
                                >
                                    <Text style={[styles.filterChipText, isActive ? styles.activeFilterChipText : styles.inactiveFilterChipText]}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Lista de Recetas Favoritas */}
                <View style={styles.recipesList}>
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <View key={recipe.id} style={styles.recipeCard}>

                                {/* Imagen / Ilustración Placeholder */}
                                <View style={styles.cardImageContainer}>
                                    <Feather name={recipe.icon === 'coffee' ? 'coffee' : recipe.icon === 'sun' ? 'sun' : 'activity'} size={34} color="#84A98C" />
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>{recipe.tag}</Text>
                                    </View>
                                    {/* Botón Favorito Activo (Rojo) */}
                                    <TouchableOpacity style={styles.heartButton}>
                                        <Ionicons name="heart" size={18} color="#E63946" />
                                    </TouchableOpacity>
                                </View>

                                {/* Contenido de la Tarjeta */}
                                <View style={styles.cardContent}>
                                    <Text style={styles.recipeTitle}>{recipe.title}</Text>

                                    <View style={styles.recipeMeta}>
                                        <View style={styles.metaItem}>
                                            <Feather name="clock" size={12} color="#84A98C" style={{ marginRight: 4 }} />
                                            <Text style={styles.metaText}>{recipe.time}</Text>
                                        </View>
                                        <Text style={styles.metaDot}>•</Text>
                                        <View style={styles.metaItem}>
                                            <Ionicons name="flame" size={12} color="#E76F51" style={{ marginRight: 4 }} />
                                            <Text style={styles.metaText}>{recipe.calories}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.categoryLabel}>{recipe.category}</Text>
                                        <TouchableOpacity style={styles.viewButton} onPress={() => handleRecipePress(recipe.title)}>
                                            <Text style={styles.viewButtonText}>Ver Receta</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay recetas en esta categoría</Text>
                        </View>
                    )}
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
        paddingBottom: 80,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#3E2723',
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#84A98C',
        marginTop: 4,
    },
    counterBadge: {
        backgroundColor: 'rgba(132, 169, 140, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(132, 169, 140, 0.25)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    counterText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#3E2723',
    },
    filterContainer: {
        marginTop: 6,
        marginBottom: 18,
    },
    filterScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
    },
    activeFilterChip: {
        backgroundColor: '#84A98C',
        shadowColor: '#84A98C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    inactiveFilterChip: {
        backgroundColor: '#EAE6DF',
    },
    filterChipText: {
        fontSize: 13,
    },
    activeFilterChipText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    inactiveFilterChipText: {
        color: '#3E2723',
        fontWeight: '600',
    },
    recipesList: {
        paddingHorizontal: 20,
        gap: 14,
    },
    recipeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: '#EAE6DF',
        shadowColor: '#3E2723',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    cardImageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#EAE6DF',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    tagBadge: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(62, 39, 35, 0.75)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    tagBadgeText: {
        color: '#FDFBF7',
        fontSize: 10,
        fontWeight: '700',
    },
    heartButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(253, 251, 247, 0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    cardContent: {
        marginTop: 10,
    },
    recipeTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#3E2723',
        lineHeight: 20,
    },
    recipeMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 12,
        color: 'rgba(62, 39, 35, 0.7)',
        fontWeight: '500',
    },
    metaDot: {
        fontSize: 12,
        color: 'rgba(62, 39, 35, 0.4)',
    },
    cardFooter: {
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderColor: 'rgba(234, 230, 223, 0.6)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#84A98C',
    },
    viewButton: {
        backgroundColor: '#84A98C',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    viewButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },
    emptyContainer: {
        padding: 30,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 13,
        color: 'rgba(62, 39, 35, 0.5)',
        fontWeight: '600',
    },
});