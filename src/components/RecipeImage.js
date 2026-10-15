import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/**
 * Foto de receta con tres estados:
 *  - cargando: spinner sobre fondo suave
 *  - ok: la imagen
 *  - error / sin imagen: ícono de la receta (así la pantalla nunca queda vacía ni rota)
 */
export default function RecipeImage({ uri, icon = 'coffee', style }) {
    const [status, setStatus] = useState(uri ? 'loading' : 'error');

    // Si cambia la receta (otra uri), reiniciamos el estado
    useEffect(() => {
        setStatus(uri ? 'loading' : 'error');
    }, [uri]);

    if (status === 'error') {
        return (
            <View style={[styles.fill, styles.center, styles.placeholder, style]}>
                <Feather name={icon} size={56} color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.fill, styles.placeholder, style]}>
            <Image
                source={{ uri }}
                style={styles.fill}
                resizeMode="cover"
                onLoad={() => setStatus('ok')}
                onError={() => setStatus('error')}
            />
            {status === 'loading' && (
                <View style={[StyleSheet.absoluteFill, styles.center]}>
                    <ActivityIndicator color={colors.primary} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fill: { width: '100%', height: '100%' },
    center: { alignItems: 'center', justifyContent: 'center' },
    placeholder: { backgroundColor: colors.primaryTint },
});
