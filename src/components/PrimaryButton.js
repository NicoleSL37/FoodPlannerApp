import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/**
 * Botón principal verde.
 * size: 'lg' (alto 56, pantallas de onboarding) | 'md' (alto 52, formularios)
 * icon: nombre de un ícono Feather que se muestra a la derecha del texto.
 */
export default function PrimaryButton({ title, onPress, icon, size = 'md', disabled = false, style }) {
    const isLarge = size === 'lg';
    return (
        <TouchableOpacity
            style={[styles.button, isLarge ? styles.large : styles.medium, disabled && styles.disabled, style]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={title}
        >
            <Text style={[styles.text, isLarge ? styles.textLarge : styles.textMedium]}>{title}</Text>
            {icon ? <Feather name={icon} size={18} color={colors.white} style={styles.icon} /> : null}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    large: { height: 56 },
    medium: { height: 52 },
    disabled: { opacity: 0.5 },
    text: { color: colors.white, fontWeight: 'bold' },
    textLarge: { fontSize: 17 },
    textMedium: { fontSize: 15 },
    icon: { marginLeft: 8 },
});
