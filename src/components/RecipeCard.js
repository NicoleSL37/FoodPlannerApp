import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import RecipeImage from './RecipeImage';

export default function RecipeCard({
    title,
    image,
    icon,
    tag,
    category,
    meta,
    isFavorite = false,
    onToggleFavorite,
    onViewRecipe,
}) {
    return (
        <View style={styles.recipeCard}>
            {/* Foto de la receta (con ícono de respaldo si no carga) */}
            <View style={styles.cardImageContainer}>
                <RecipeImage uri={image} icon={icon} />
                {tag ? (
                    <View style={styles.tagBadge}>
                        <Text style={styles.tagBadgeText}>{tag}</Text>
                    </View>
                ) : null}
                {/* Botón Favorito */}
                <TouchableOpacity
                    style={styles.heartButton}
                    onPress={onToggleFavorite}
                    accessibilityLabel={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                    <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={18} color={colors.danger} />
                </TouchableOpacity>
            </View>

            {/* Contenido de la Tarjeta */}
            <View style={styles.cardContent}>
                <Text style={styles.recipeTitle} numberOfLines={2}>{title}</Text>

                {meta ? (
                    <View style={styles.recipeMeta}>
                        <View style={styles.metaItem}>
                            <Feather name="list" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                            <Text style={styles.metaText}>{meta}</Text>
                        </View>
                    </View>
                ) : null}

                <View style={styles.cardFooter}>
                    <Text style={styles.categoryLabel}>{category}</Text>
                    <TouchableOpacity style={styles.viewButton} onPress={onViewRecipe} accessibilityLabel={`Ver receta ${title}`}>
                        <Text style={styles.viewButtonText}>Ver Receta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    recipeCard: {
        backgroundColor: colors.white,
        borderRadius: 18,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 14,
    },
    cardImageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: colors.border,
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
        backgroundColor: colors.text75,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    tagBadgeText: {
        color: colors.background,
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
        shadowColor: colors.black,
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
        color: colors.text,
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
        color: colors.text70,
        fontWeight: '500',
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
        color: colors.primary,
    },
    viewButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
    },
    viewButtonText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
});