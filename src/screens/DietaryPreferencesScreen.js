import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';

const DIET_OPTIONS = ['Tradicional', 'Vegetariano', 'Vegano', 'Keto', 'Pescatariano'];

export default function DietaryPreferencesScreen({ route, navigation }) {
  // Recibimos los datos del usuario enviados desde el Registro
  const { userName, userEmail } = route.params || {};
  const { setDietaryPreference } = useContext(UserContext);
  const [selected, setSelected] = useState('Tradicional');

  const handleSelectDiet = (diet) => {
    setSelected(diet);
    console.log('Dieta elegida:', diet);
  };

  const handleNext = () => {
    // CORRECCIÓN: Usamos 'selected' en lugar de 'selectedDiet'
    setDietaryPreference(selected);

    if (!userName && !userEmail) {
        navigation.goBack(); // Si viene del Perfil, solo regresa.
    } else {
        navigation.navigate('Allergies', { userName, userEmail }); // Si viene del Registro, avanza a Alergias.
    }
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      
      {/* Indicador de Paso (Onboarding) */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      {/* Contenido Central */}
      <View style={styles.content}>
        <Text style={styles.title}>¿Sigues alguna dieta especial?</Text>
        
        <View style={styles.chipsContainer}>
          {DIET_OPTIONS.map((diet) => {
            const isActive = selected === diet;
            return (
              <TouchableOpacity
                key={diet}
                onPress={() => handleSelectDiet(diet)}
                style={[styles.chip, isActive ? styles.activeChip : styles.inactiveChip]}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, isActive ? styles.activeChipText : styles.inactiveChipText]}>
                  {diet}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Botón Inferior */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
        <Text style={styles.feedbackText}>
          Seleccionado: <Text style={styles.feedbackTextBold}>{selected}</Text>
        </Text>
      </View>
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
    overflow: 'hidden',
    padding: 24,
    paddingTop: 40,
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EAE6DF',
  },
  activeDot: {
    width: 28,
    backgroundColor: '#84A98C',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3E2723',
    textAlign: 'center',
    marginBottom: 36,
    lineHeight: 34,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 24,
  },
  activeChip: {
    backgroundColor: '#84A98C',
    shadowColor: '#84A98C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inactiveChip: {
    backgroundColor: '#EAE6DF',
  },
  chipText: {
    fontSize: 15,
  },
  activeChipText: {
    color: '#FDFBF7',
    fontWeight: '700',
  },
  inactiveChipText: {
    color: '#3E2723',
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    paddingBottom: 20,
  },
  nextButton: {
    backgroundColor: '#84A98C',
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#84A98C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  feedbackText: {
    textAlign: 'center',
    color: '#3E2723',
    fontSize: 13,
    opacity: 0.7,
    marginTop: 16,
  },
  feedbackTextBold: {
    fontWeight: 'bold',
    opacity: 1,
  },
});