import React, { useContext, useState } from 'react';
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
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';

export default function RegisterScreen({ navigation }) {

  const { setUserName, setUserEmail } = useContext(UserContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    console.log('Creando cuenta...', { name, email, password });
    
    // Validación básica antes de avanzar al cuestionario
    if (!name || !email || !password) {
      alert('Por favor completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@(gmail|hotmail|outlook)\.com$/i;
    if (!emailRegex.test(email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setUserName(name);
    setUserEmail(email);
    // Redirige al cuestionario (DietaryPreferences)
    navigation.navigate('DietaryPreferences', {userName: name, userEmail: email});
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header / Logo */}
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
            <Text style={styles.brandSubtitle}>Crea tu cuenta para empezar</Text>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            
            {/* Nombre Completo */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre Completo</Text>
              <View style={styles.inputWrapper}>
                <Feather name="user" size={18} color="#84A98C" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="Ej. Alex Morales"
                  placeholderTextColor="#A89F91"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Correo Electrónico */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <View style={styles.inputWrapper}>
                <Feather name="mail" size={18} color="#84A98C" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="ejemplo@correo.com"
                  placeholderTextColor="#A89F91"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>
              <View style={styles.inputWrapper}>
                <Feather name="lock" size={18} color="#84A98C" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#A89F91"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.inputIconRight}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#A89F91" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
              <View style={styles.inputWrapper}>
                <Feather name="shield" size={18} color="#84A98C" style={styles.inputIconLeft} />
                <TextInput
                  style={styles.input}
                  placeholder="Repite tu contraseña"
                  placeholderTextColor="#A89F91"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.inputIconRight}>
                  <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#A89F91" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Principal */}
            <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
              <Text style={styles.primaryButtonText}>Crear Cuenta</Text>
              <Feather name="arrow-right" size={18} color="#FFF" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

          </View>

          {/* Enlace de Iniciar Sesión corregido */}
          <TouchableOpacity 
            style={styles.loginLinkButton} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta? <Text style={styles.loginLinkTextBold}>Inicia Sesión</Text>
            </Text>
          </TouchableOpacity>

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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  logoSection: { alignItems: 'center', marginBottom: 24, marginTop: 10 },
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
  brandTitle: { fontSize: 26, fontWeight: '800', color: '#3E2723', marginBottom: 4 },
  brandSubtitle: { fontSize: 14, fontWeight: '600', color: '#3E2723', opacity: 0.7 },
  formContainer: { width: '100%', gap: 14 },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 12, fontWeight: 'bold', color: '#3E2723', marginBottom: 6, marginLeft: 4 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    borderRadius: 16,
    height: 48,
  },
  inputIconLeft: { paddingHorizontal: 14 },
  input: { flex: 1, height: '100%', fontSize: 14, color: '#3E2723' },
  inputIconRight: { paddingHorizontal: 14, height: '100%', justifyContent: 'center' },
  primaryButton: {
    backgroundColor: '#84A98C',
    borderRadius: 16,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#84A98C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  loginLinkButton: { alignItems: 'center', marginTop: 24, paddingBottom: 10 },
  loginLinkText: { color: '#3E2723', fontSize: 12, opacity: 0.7 },
  loginLinkTextBold: { fontWeight: '900', color: '#3E2723', opacity: 1 },
});