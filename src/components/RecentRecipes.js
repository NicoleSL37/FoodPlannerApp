import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import RecipeImage from './RecipeImage';

/**
 * Carrusel horizontal "Vistas recientemente" (se guarda en el celular, ver UserContext).
 * recipes: recetas vistas, la más reciente primero. onSelect(recipe) abre su detalle.
 */
export default function RecentRecipes({ recipes, onSelect, onClear }) {
    if (!recipes || recipes.length === 0) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Vistas recientemente</Text>
                <TouchableOpacity onPress={onClear} accessibilityLabel="Borrar recetas vistas">
                    <Text style={styles.clear}>Borrar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.list}>
                {recipes.map((recipe) => (
                    <TouchableOpacity
                        key={recipe.id}
                        style={styles.card}
                        onPress={() => onSelect(recipe)}
                        accessibilityLabel={`Abrir ${recipe.title}`}
                    >
                        <View style={styles.image}>
                            <RecipeImage uri={recipe.image} icon={recipe.icon} />
                        </View>
                        <Text style={styles.cardTitle} numberOfLines={2}>{recipe.title}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 18 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    title: { fontSize: 15, fontWeight: '800', color: colors.text },
    clear: { fontSize: 12, fontWeight: '700', color: colors.primary },
    list: { paddingHorizontal: 20, gap: 12 },
    card: {
        width: 128,
        backgroundColor: colors.white,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },
    image: { width: '100%', height: 84 },
    cardTitle: { fontSize: 11, fontWeight: '700', color: colors.text, padding: 8, minHeight: 40 },
});
