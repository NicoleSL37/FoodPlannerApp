import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function RecipeCard({ title, time, calories, tag, icon, category, onViewRecipe }) {
    return (
        <View style={styles.recipeCard}>
            {/* Imagen / Ilustración Placeholder */}
            <View style={styles.cardImageContainer}>
                <Feather name={icon || 'coffee'} size={34} color="#84A98C" />
                <View style={styles.tagBadge}>
                    <Text style={styles.tagBadgeText}>{tag}</Text>
                </View>
                {/* Botón Favorito Activo */}
                <TouchableOpacity style={styles.heartButton}>
                    <Ionicons name="heart" size={18} color="#E63946" />
                </TouchableOpacity>
            </View>

            {/* Contenido de la Tarjeta */}
            <View style={styles.cardContent}>
                <Text style={styles.recipeTitle}>{title}</Text>
                
                <View style={styles.recipeMeta}>
                    <View style={styles.metaItem}>
                        <Feather name="clock" size={12} color="#84A98C" style={{ marginRight: 4 }} />
                        <Text style={styles.metaText}>{time}</Text>
                    </View>
                    <Text style={styles.metaDot}>•</Text>
                    <View style={styles.metaItem}>
                        <Ionicons name="flame" size={12} color="#E76F51" style={{ marginRight: 4 }} />
                        <Text style={styles.metaText}>{calories}</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.categoryLabel}>{category}</Text>
                    <TouchableOpacity style={styles.viewButton} onPress={onViewRecipe}>
                        <Text style={styles.viewButtonText}>Ver Receta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        marginBottom: 14,
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
});