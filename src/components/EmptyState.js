import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/**
 * Mensaje para listas sin contenido (sin resultados, sin favoritos, etc.).
 * En el Avance 2 también sirve para el estado vacío de la API.
 */
export default function EmptyState({ icon = 'search', title, message, style }) {
    return (
        <View style={[styles.container, style]}>
            <Feather name={icon} size={28} color={colors.primary} />
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
    title: { marginTop: 10, fontSize: 14, fontWeight: '700', color: colors.text, textAlign: 'center' },
    message: { marginTop: 4, fontSize: 12, color: colors.text60, textAlign: 'center' },
});
