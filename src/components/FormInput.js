import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';

/**
 * Campo de formulario con etiqueta, ícono, mensaje de error y (si es contraseña) botón mostrar/ocultar.
 * Acepta cualquier prop de TextInput (value, onChangeText, keyboardType, placeholder, etc.).
 */
export default function FormInput({ label, icon, error, secureTextEntry = false, style, ...inputProps }) {
    const [hidden, setHidden] = useState(secureTextEntry);

    return (
        <View style={[styles.group, style]}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <View style={[styles.wrapper, error ? styles.wrapperError : null]}>
                {icon ? <Feather name={icon} size={18} color={colors.primary} style={styles.iconLeft} /> : null}

                <TextInput
                    style={[styles.input, !icon && styles.inputNoIcon]}
                    placeholderTextColor={colors.placeholder}
                    secureTextEntry={hidden}
                    accessibilityLabel={label}
                    {...inputProps}
                />

                {secureTextEntry ? (
                    <TouchableOpacity
                        onPress={() => setHidden((h) => !h)}
                        style={styles.iconRight}
                        accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
                    >
                        <Feather name={hidden ? 'eye-off' : 'eye'} size={18} color={colors.placeholder} />
                    </TouchableOpacity>
                ) : null}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    group: { marginBottom: 14 },
    label: { fontSize: 12, fontWeight: 'bold', color: colors.text, marginBottom: 6, marginLeft: 4 },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        height: 48,
    },
    wrapperError: { borderColor: colors.danger },
    iconLeft: { paddingHorizontal: 14 },
    input: { flex: 1, height: '100%', fontSize: 14, color: colors.text },
    inputNoIcon: { paddingHorizontal: 14 },
    iconRight: { paddingHorizontal: 14, height: '100%', justifyContent: 'center' },
    error: { color: colors.danger, fontSize: 11, marginTop: 4, marginLeft: 4 },
});
