import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });

    const handleLogin = () => {
        let currentErrors = { email: '', password: '' };
        let hasError = false;

        if (!email.trim()) {
            currentErrors.email = 'El correo electrónico es obligatorio';
            hasError = true;
        }

        if (!password.trim()) {
            currentErrors.password = 'La contraseña es obligatoria';
            hasError = true;
        }

        setErrors(currentErrors);

        if (!hasError) {
            console.log('Iniciando sesión:', { email, password });

            const nameFromEmail = email.split('@')[0];
            const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
            // Redirige al menú principal (MainTabs) y limpia la pila para que no pueda volver atrás con el botón físico
            navigation.replace('MainTabs', {
                userName: formattedName,
                userEmail: email,
            });
        }
    };

    return (
        <View style={styles.rootContainer}>
            <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Logo */}
                    <View style={styles.logoSection}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.forkContainer}>
                                <View style={styles.forkProngs}>
                                    <View style={styles.forkProng} />
                                    <View style={styles.forkProng} />
                                    <View style={styles.forkProng} />
                                </View>
                                <View style={styles.forkBase} />
                                <View style={styles.forkHandle} />
                            </View>
                            <View style={styles.plate}>
                                <View style={styles.calendarGrid}>
                                    {[...Array(3)].map((_, r) => (
                                        <View key={r} style={styles.gridRow}>
                                            <View style={styles.gridCell} />
                                            <View style={styles.gridCell} />
                                            <View style={styles.gridCell} />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                        <Text style={styles.brandTitle}>FoodPlanner</Text>
                        <Text style={styles.brandSubtitle}>Planifica tus comidas día a día</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <Text style={styles.inputLabel}>Correo electrónico</Text>
                        <TextInput
                            style={[styles.input, errors.email ? styles.inputErrorBorder : null]}
                            placeholder="ejemplo@correo.com"
                            placeholderTextColor="#A89F91"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                        <Text style={styles.inputLabel}>Contraseña</Text>
                        <TextInput
                            style={[styles.input, errors.password ? styles.inputErrorBorder : null]}
                            placeholder="••••••••"
                            placeholderTextColor="#A89F91"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                            <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
                        </TouchableOpacity>

                        {/* Botón corregido para navegar a la pantalla de Registro */}
                        <TouchableOpacity 
                            style={styles.registerButton} 
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={styles.registerText}>
                                ¿No tienes cuenta? <Text style={styles.registerTextBold}>Regístrate</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        width: '100%',
        maxWidth: 380,
        height: 800,
        minHeight: 800,
        maxHeight: 800,
        alignSelf: 'center',
        backgroundColor: '#FDFBF7',
        overflow: 'hidden'
    },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    logoSection: { alignItems: 'center', marginBottom: 36 },
    iconWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    forkContainer: { alignItems: 'center', marginRight: 14, height: 70 },
    forkProngs: { flexDirection: 'row', justifyContent: 'space-between', width: 14, height: 18 },
    forkProng: { width: 2.5, height: 18, backgroundColor: '#84A98C', borderRadius: 2 },
    forkBase: { width: 14, height: 3, backgroundColor: '#84A98C', borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
    forkHandle: { width: 3.5, height: 36, backgroundColor: '#84A98C', borderRadius: 2 },
    plate: { width: 96, height: 96, borderRadius: 48, borderWidth: 5, borderColor: '#84A98C', backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
    calendarGrid: { width: 48, height: 48, justifyContent: 'space-between' },
    gridRow: { flexDirection: 'row', justifyContent: 'space-between', flex: 1 },
    gridCell: { flex: 1, margin: 2, backgroundColor: '#EAE6DF', borderRadius: 3 },
    brandTitle: { fontSize: 32, fontWeight: 'bold', color: '#3E2723' },
    brandSubtitle: { fontSize: 14, color: '#3E2723', opacity: 0.65, marginTop: 4 },
    formContainer: { width: '100%' },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#3E2723', marginBottom: 6 },
    input: { backgroundColor: '#FFF', borderWidth: 1.5, borderColor: '#EAE6DF', borderRadius: 14, padding: 14, fontSize: 16, color: '#3E2723', marginBottom: 4 },
    inputErrorBorder: { borderColor: '#E63946' },
    errorText: { color: '#E63946', fontSize: 12, marginTop: 2, marginBottom: 10, marginLeft: 4 },
    primaryButton: { backgroundColor: '#84A98C', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
    primaryButtonText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
    registerButton: { alignItems: 'center', marginTop: 24, paddingVertical: 8 },
    registerText: { color: '#3E2723', fontSize: 14 },
    registerTextBold: { fontWeight: 'bold', textDecorationLine: 'underline' },
});