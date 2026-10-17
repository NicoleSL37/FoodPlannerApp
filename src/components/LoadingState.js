import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/** Indicador de carga con mensaje (mientras llegan datos de la API). */
export default function LoadingState({ message = 'Cargando...', style }) {
    return (
        <View style={[styles.container, style]} accessibilityLiveRegion="polite">
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
    message: { marginTop: 12, fontSize: 13, color: colors.text60 },
});
