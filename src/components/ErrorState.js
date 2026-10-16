import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import PrimaryButton from './PrimaryButton';

/** Mensaje de error con botón para reintentar (cuando falla la API o no hay conexión). */
export default function ErrorState({ title = 'Algo salió mal', message, onRetry, style }) {
    return (
        <View style={[styles.container, style]}>
            <Feather name="wifi-off" size={30} color={colors.danger} />
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            {onRetry ? <PrimaryButton title="Reintentar" icon="refresh-cw" onPress={onRetry} style={styles.button} /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 20 },
    title: { marginTop: 10, fontSize: 15, fontWeight: '700', color: colors.text, textAlign: 'center' },
    message: { marginTop: 4, fontSize: 12, color: colors.text60, textAlign: 'center' },
    button: { marginTop: 18, alignSelf: 'stretch' },
});
