import React, { useContext, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { Screen, Chip, EmptyState, RecipeCard } from '../components';
import { categoryLabel } from '../data/categories';
import { areaLabel } from '../data/areas';

export default function FavoritesScreen({ navigation }) {
    const { favorites, toggleFavorite } = useContext(UserContext);
    const [activeFilter, setActiveFilter] = useState('Todas');

    // Solo mostramos los filtros de las categorías que realmente tienen favoritos
    const filters = useMemo(
        () => ['Todas', ...Array.from(new Set(favorites.map((r) => r.category).filter(Boolean)))],
        [favorites]
    );
    // Si ya no quedan favoritos de la categoría elegida, volvemos a "Todas"
    const currentFilter = filters.includes(activeFilter) ? activeFilter : 'Todas';

    const filteredRecipes = currentFilter === 'Todas'
        ? favorites
        : favorites.filter((item) => item.category === currentFilter);

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
                        <Text style={styles.counterText}>{favorites.length}</Text>
                    </View>
                </View>

                {/* Filtros Rápidos (Horizontal) */}
                {favorites.length > 0 && (
                    <View style={styles.filterContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                            {filters.map((filter) => (
                                <Chip
                                    key={filter}
                                    label={filter === 'Todas' ? 'Todas' : categoryLabel(filter)}
                                    size="md"
                                    selected={currentFilter === filter}
                                    onPress={() => setActiveFilter(filter)}
                                />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Lista de Recetas Favoritas */}
                <View style={styles.recipesList}>
                    {filteredRecipes.length > 0 ? (
                        filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                title={recipe.title}
                                image={recipe.image}
                                icon={recipe.icon}
                                tag={areaLabel(recipe.area)}
                                category={categoryLabel(recipe.category)}
                                meta={recipe.ingredients.length > 0 ? `${recipe.ingredients.length} ingredientes` : null}
                                isFavorite
                                onToggleFavorite={() => toggleFavorite(recipe)}
                                onViewRecipe={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe })}
                            />
                        ))
                    ) : (
                        <EmptyState
                            icon="heart"
                            title="Aún no tienes favoritos"
                            message="Toca el corazón en una receta para guardarla aquí."
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