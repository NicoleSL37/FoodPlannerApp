import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { UserContext } from '../context/UserContext';
import { validateEmail, nameFromEmail } from '../utils/validators';
import { colors } from '../theme/colors';
import { Screen, BrandLogo, FormInput, PrimaryButton } from '../components';

export default function LoginScreen({ navigation }) {
    const { signIn } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async () => {
        const currentErrors = {
            email: validateEmail(email),
            password: password.trim() ? '' : 'La contraseña es obligatoria',
        };
        setErrors(currentErrors);

        if (currentErrors.email || currentErrors.password) return;

        setSubmitting(true);
        // Guarda la sesión y recupera los favoritos y preferencias de este correo (si ya usó la app)
        await signIn({ name: nameFromEmail(email), email });

        // replace: el usuario no puede volver al login con el botón "atrás".
        navigation.replace('MainTabs');
    };

    return (
        <Screen>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <BrandLogo subtitle="Planifica tus comidas día a día" />

                    <View style={styles.form}>
                        <FormInput
                            label="Correo electrónico"
                            icon="mail"
                            placeholder="ejemplo@correo.com"
                            value={email}
                            onChangeText={(t) => {
                                setEmail(t);
                                setErrors((prev) => ({ ...prev, email: '' }));
                            }}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            error={errors.email}
                        />

                        <FormInput
                            label="Contraseña"
                            icon="lock"
                            placeholder="••••••••"
                            secureTextEntry
                            value={password}
                            onChangeText={(t) => {
                                setPassword(t);
                                setErrors((prev) => ({ ...prev, password: '' }));
                            }}
                            error={errors.password}
                        />

                        <PrimaryButton title="Iniciar Sesión" onPress={handleLogin} disabled={submitting} style={styles.submit} />

                        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerText}>
                                ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
}

const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    form: { width: '100%' },
    submit: { marginTop: 10 },
    registerButton: { alignItems: 'center', marginTop: 24, paddingVertical: 8 },
    registerText: { color: colors.text, fontSize: 14 },
    registerTextBold: { fontWeight: 'bold', textDecorationLine: 'underline' },
});
