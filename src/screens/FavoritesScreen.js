import React, { useContext, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { RECIPES } from '../data/recipes';
import { Screen, Chip, EmptyState, RecipeCard } from '../components';
import { colors } from '../theme/colors';

export default function FavoritesScreen({ navigation }) {
    const { favorites, toggleFavorite } = useContext(UserContext);
    const [activeFilter, setActiveFilter] = useState('Todas');

    const filters = ['Todas', 'Desayuno', 'Almuerzo', 'Cena', 'Postre'];

    // Solo las recetas que el usuario marcó con el corazón
    const favoritesList = useMemo(() => RECIPES.filter((r) => favorites.includes(r.id)), [favorites]);

    const filteredRecipes = activeFilter === 'Todas'
        ? favoritesList
        : favoritesList.filter((item) => item.category === activeFilter);

    const handleRecipePress = (recipe) => {
        navigation.navigate('RecipeDetail', { recipeId: recipe.id });
    };

    return (
        <Screen>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Mis Favoritos</Text>
                        <Text style={styles.subtitle}>Recetas guardadas para después</Text>
                    </View>
                    {/* Contador Badge */}
                    <View style={styles.counterBadge}>
                        <Ionicons name="heart" size={11} color={colors.danger} />
                        <Text style={styles.counterText}>{favoritesList.length}</Text>
                    </View>
                </View>

                {/* Filtros Rápidos (Horizontal) */}
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                        {filters.map((filter) => (
                            <Chip
                                key={filter}
                                label={filter}
                                size="md"
                                selected={activeFilter === filter}
                                onPress={() => setActiveFilter(filter)}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Lista de Recetas Favoritas */}
                <View style={styles.recipesList}>
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                title={recipe.title}
                                time={recipe.time}
                                calories={`${recipe.kcal} kcal`}
                                tag={recipe.tag}
                                icon={recipe.icon}
                                category={recipe.category}
                                isFavorite
                                onToggleFavorite={() => toggleFavorite(recipe.id)}
                                onViewRecipe={() => handleRecipePress(recipe)}
                            />
                        ))
                    ) : (
                        <EmptyState
                            icon="heart"
                            title={favoritesList.length === 0 ? 'Aún no tienes favoritos' : 'Sin recetas en esta categoría'}
                            message={
                                favoritesList.length === 0
                                    ? 'Toca el corazón en una receta para guardarla aquí.'
                                    : 'Prueba con otra categoría.'
                            }
                        />
                    )}
                </View>

            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
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
        color: colors.text,
        lineHeight: 28,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        marginTop: 4,
    },
    counterBadge: {
        backgroundColor: colors.primaryTint,
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
        color: colors.text,
    },
    filterContainer: {
        marginTop: 6,
        marginBottom: 18,
    },
    filterScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    recipesList: {
        paddingHorizontal: 20,
        gap: 14,
    },
});