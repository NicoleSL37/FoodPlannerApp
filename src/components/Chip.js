import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * Chip seleccionable (dietas, alergias, categorías, filtros).
 * size: 'lg' (onboarding) | 'md' (filtros de Favoritos) | 'sm' (categorías de Inicio)
 */
export default function Chip({ label, selected = false, onPress, size = 'md', style }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={[
                styles.base,
                sizes[size].box,
                selected ? [styles.active, size !== 'sm' && styles.activeShadow] : styles.inactive,
                style,
            ]}
        >
            <Text style={[sizes[size].text, selected ? styles.activeText : styles.inactiveText]}>{label}</Text>
        </TouchableOpacity>
    );
}

const sizes = {
    lg: StyleSheet.create({
        box: { paddingHorizontal: 20, paddingVertical: 13, borderRadius: 24 },
        text: { fontSize: 15 },
    }),
    md: StyleSheet.create({
        box: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
        text: { fontSize: 13 },
    }),
    sm: StyleSheet.create({
        box: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
        text: { fontSize: 11 },
    }),
};

const styles = StyleSheet.create({
    base: { alignItems: 'center', justifyContent: 'center' },
    active: { backgroundColor: colors.primary },
    activeShadow: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.28,
        shadowRadius: 6,
        elevation: 3,
    },
    inactive: { backgroundColor: colors.border },
    activeText: { color: colors.white, fontWeight: '700' },
    inactiveText: { color: colors.text, fontWeight: '600' },
});
