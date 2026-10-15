import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/**
 * Cabecera con botón "volver", título centrado y subtítulo opcional.
 * `right` permite poner un elemento a la derecha (si no, se deja un espacio para centrar el título).
 */
export default function ScreenHeader({ title, subtitle, onBack, right }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack} accessibilityLabel="Volver">
                <Feather name="chevron-left" size={20} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.titleBox}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
            </View>

            {right || <View style={styles.spacer} />}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    titleBox: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
    title: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'center' },
    subtitle: { fontSize: 11, color: colors.text60, marginTop: 2, textAlign: 'center' },
    spacer: { width: 40, height: 40 },
});
