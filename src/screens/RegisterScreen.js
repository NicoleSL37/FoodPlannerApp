import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { UserContext } from '../context/UserContext';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';
import { colors } from '../theme/colors';
import { Screen, BrandLogo, FormInput, PrimaryButton } from '../components';

export default function RegisterScreen({ navigation }) {
  const { signIn } = useContext(UserContext);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  // Actualiza un campo y borra su error mientras el usuario escribe
  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRegister = async () => {
    const currentErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setErrors(currentErrors);

    if (Object.values(currentErrors).some(Boolean)) return;

    // Cuenta nueva: guarda la sesión y empieza con preferencias en blanco
    await signIn({ name: form.name.trim(), email: form.email, isNewAccount: true });
    // Pasa al cuestionario de onboarding (dieta -> alergias)
    navigation.navigate('DietaryPreferences', { mode: 'onboarding' });
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <BrandLogo compact subtitle="Crea tu cuenta para empezar" />

          <View style={styles.form}>
            <FormInput
              label="Nombre Completo"
              icon="user"
              placeholder="Ej. Alex Morales"
              value={form.name}
              onChangeText={setField('name')}
              error={errors.name}
            />
            <FormInput
              label="Correo electrónico"
              icon="mail"
              placeholder="ejemplo@correo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={setField('email')}
              error={errors.email}
            />
            <FormInput
              label="Contraseña"
              icon="lock"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={form.password}
              onChangeText={setField('password')}
              error={errors.password}
            />
            <FormInput
              label="Confirmar Contraseña"
              icon="shield"
              placeholder="Repite tu contraseña"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={setField('confirmPassword')}
              error={errors.confirmPassword}
            />

            <PrimaryButton title="Crear Cuenta" icon="arrow-right" onPress={handleRegister} style={styles.submit} />
          </View>

          <TouchableOpacity style={styles.loginLinkButton} onPress={() => navigation.goBack()}>
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta? <Text style={styles.loginLinkTextBold}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  form: { width: '100%' },
  submit: { marginTop: 10 },
  loginLinkButton: { alignItems: 'center', marginTop: 24, paddingBottom: 10 },
  loginLinkText: { color: colors.text, fontSize: 12, opacity: 0.7 },
  loginLinkTextBold: { fontWeight: '900', color: colors.text, opacity: 1 },
});
