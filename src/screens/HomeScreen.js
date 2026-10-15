import React, { useContext, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { Screen, Chip, EmptyState, RecipeCard } from '../components';
import { RECIPES, CATEGORIES } from '../data/recipes';
import { filterRecipes, describePreferences } from '../utils/recipeFilters';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
    const { userName, dietaryPreference, allergies, favorites, toggleFavorite } = useContext(UserContext);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [query, setQuery] = useState('');

    // Recetas que cumplen categoría + búsqueda + dieta y alergias del usuario
    const visibleRecipes = useMemo(
        () => filterRecipes(RECIPES, { category: selectedCategory, query, diet: dietaryPreference, allergies }),
        [selectedCategory, query, dietaryPreference, allergies]
    );

    const preferencesText = describePreferences(dietaryPreference, allergies);

    const handleRecipePress = (recipe) => {
        navigation.navigate('RecipeDetail', { recipeId: recipe.id });
    };

    const handleSeeAll = () => {
        setSelectedCategory('Todas');
        setQuery('');
    };

    return (
        <Screen>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Superior */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>¡Hola{userName ? `, ${userName}` : ''}!</Text>
                        <Text style={styles.subGreeting}>¿Qué cocinaremos hoy?</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Settings')}
                        accessibilityLabel="Abrir configuración"
                    >
                        <Feather name="settings" size={18} color={colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Barra de Búsqueda */}
                <View style={styles.searchContainer}>
                    <Feather name="search" size={16} color={colors.text40} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Buscar recetas, ingredientes..."
                        placeholderTextColor={colors.text40}
                        style={styles.searchInput}
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')} accessibilityLabel="Borrar búsqueda">
                            <Feather name="x" size={16} color={colors.text50} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Filtros de Categoría */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 14 }}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {CATEGORIES.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            size="sm"
                            selected={selectedCategory === cat}
                            onPress={() => setSelectedCategory(cat)}
                        />
                    ))}
                </ScrollView>

                {preferencesText ? (
                    <Text style={styles.prefsHint}>Mostrando recetas para: {preferencesText}</Text>
                ) : null}

                {/* Recetas */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recetas Recomendadas</Text>
                        <TouchableOpacity onPress={handleSeeAll}>
                            <Text style={styles.seeAllText}>Ver todas</Text>
                        </TouchableOpacity>
                    </View>

                    {visibleRecipes.length === 0 ? (
                        <EmptyState
                            icon="search"
                            title="No encontramos recetas"
                            message="Prueba con otra búsqueda o categoría, o revisa tus preferencias en el Perfil."
                        />
                    ) : (
                        visibleRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                title={recipe.title}
                                time={recipe.time}
                                calories={`${recipe.kcal} kcal`}
                                tag={recipe.tag}
                                icon={recipe.icon}
                                category={recipe.category}
                                isFavorite={favorites.includes(recipe.id)}
                                onToggleFavorite={() => toggleFavorite(recipe.id)}
                                onViewRecipe={() => handleRecipePress(recipe)}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    prefsHint: {
        marginTop: 10,
        marginHorizontal: 20,
        fontSize: 11,
        fontWeight: '600',
        color: colors.primary,
    },
    categoriesScroll: {
        paddingHorizontal: 20,
        gap: 8,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 12,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.text,
    },
    subGreeting: {
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
    searchContainer: {
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 46,
        marginTop: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: colors.text,
        fontWeight: '500',
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.text,
    },
    seeAllText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
    },
});