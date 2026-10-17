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
import { colors } from '../theme/colors';
import { Screen, Chip, EmptyState, ErrorState, LoadingState, RecipeCard, RecentRecipes } from '../components';
import { CATEGORIES, DEFAULT_CATEGORY, categoryLabel } from '../data/categories';
import { areaLabel } from '../data/areas';
import { filterRecipes, describePreferences } from '../utils/recipeFilters';
import { useRecipes } from '../hooks/useRecipes';
import useDebouncedValue from '../hooks/useDebouncedValue';

export default function HomeScreen({ navigation }) {
    const { userName, dietaryPreference, allergies, toggleFavorite, isFavorite, viewed, clearViewed } = useContext(UserContext);
    const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
    const [query, setQuery] = useState('');

    // Esperamos a que el usuario deje de escribir antes de llamar a la API
    const debouncedQuery = useDebouncedValue(query.trim(), 500);
    const { recipes, status, error, reload } = useRecipes({ category: selectedCategory, query: debouncedQuery });

    // Aplica la dieta y las alergias del usuario a lo que llegó de la API
    const visibleRecipes = useMemo(
        () => filterRecipes(recipes, { diet: dietaryPreference, allergies }),
        [recipes, dietaryPreference, allergies]
    );

    const preferencesText = describePreferences(dietaryPreference, allergies);
    const hasAllergies = allergies.some((a) => a !== 'Ninguna');
    const isSearching = debouncedQuery.length > 0;

    const handleSelectCategory = (value) => {
        setQuery('');
        setSelectedCategory(value);
    };

    const renderRecipes = () => {
        if (status === 'loading') {
            return <LoadingState message="Buscando recetas..." />;
        }
        if (status === 'error') {
            return <ErrorState title="No pudimos cargar las recetas" message={error} onRetry={reload} />;
        }
        if (visibleRecipes.length === 0) {
            return recipes.length === 0 ? (
                <EmptyState
                    icon="search"
                    title="No encontramos recetas"
                    message="Prueba con otra búsqueda o categoría. Los nombres de las recetas están en inglés."
                />
            ) : (
                <EmptyState
                    icon="filter"
                    title="Ninguna receta coincide con tus preferencias"
                    message="Cambia la dieta o las alergias desde tu Perfil, o prueba otra categoría."
                />
            );
        }
        return visibleRecipes.map((recipe) => (
            <RecipeCard
                key={recipe.id}
                title={recipe.title}
                image={recipe.image}
                icon={recipe.icon}
                tag={areaLabel(recipe.area)}
                category={categoryLabel(recipe.category)}
                meta={recipe.ingredients.length > 0 ? `${recipe.ingredients.length} ingredientes` : null}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe)}
                onViewRecipe={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe })}
            />
        ));
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
                        placeholder="Buscar recetas (en inglés)..."
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

                {/* Categorías (de TheMealDB) */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 14 }}
                    contentContainerStyle={styles.categoriesScroll}
                >
                    {CATEGORIES.map((cat) => (
                        <Chip
                            key={cat.value}
                            label={cat.label}
                            size="sm"
                            selected={!isSearching && selectedCategory === cat.value}
                            onPress={() => handleSelectCategory(cat.value)}
                        />
                    ))}
                </ScrollView>

                {preferencesText ? (
                    <Text style={styles.prefsHint}>Tus preferencias: {preferencesText}</Text>
                ) : null}
                {hasAllergies && !isSearching ? (
                    <Text style={styles.noteText}>Las alergias se revisan en el detalle de cada receta.</Text>
                ) : null}

                {/* Vistas recientemente (guardadas en el celular) */}
                {!isSearching && (
                    <RecentRecipes
                        recipes={viewed}
                        onClear={clearViewed}
                        onSelect={(recipe) => navigation.navigate('RecipeDetail', { recipeId: recipe.id, recipe })}
                    />
                )}

                {/* Recetas */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle} numberOfLines={1}>
                            {isSearching ? `Resultados para "${debouncedQuery}"` : categoryLabel(selectedCategory)}
                        </Text>
                        {status === 'success' && (
                            <Text style={styles.seeAllText}>{visibleRecipes.length} recetas</Text>
                        )}
                    </View>

                    {renderRecipes()}
                </View>
            </ScrollView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    noteText: {
        marginTop: 4,
        marginHorizontal: 20,
        fontSize: 11,
        color: colors.text60,
    },
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