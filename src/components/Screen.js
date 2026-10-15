import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * Contenedor base de cada pantalla: fondo, StatusBar y ancho máximo centrado.
 * Usa flex: 1 para adaptarse al alto real de cada dispositivo (sin alturas fijas).
 */
export default function Screen({ children, style }) {
    return (
        <View style={[styles.root, style]}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
        backgroundColor: colors.background,
        overflow: 'hidden',
    },
});
