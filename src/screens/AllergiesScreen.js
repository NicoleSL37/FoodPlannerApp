import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { UserContext } from '../context/UserContext';

const ALLERGIES_OPTIONS = [
  'Sin Lactosa',
  'Sin Gluten',
  'Nueces',
  'Mariscos',
  'Huevos',
  'Ninguna'
];

export default function AllergiesScreen({ route, navigation }) {
  const { userName, userEmail } = route.params || {};
  // Extraemos la función setAllergies del Contexto Global
  const { setAllergies } = useContext(UserContext);
  
  const [selected, setSelected] = useState(['Ninguna']);

  const toggleAllergy = (option) => {
    if (option === 'Ninguna') {
      setSelected(['Ninguna']);
    } else {
      let updated = selected.filter(item => item !== 'Ninguna');
      
      if (updated.includes(option)) {
        updated = updated.filter(item => item !== option);
      } else {
        updated.push(option);
      }
      
      setSelected(updated.length > 0 ? updated : ['Ninguna']);
    }
  };

  const handleFinish = () => {
    setAllergies(selected);
    
    // Si viene desde el Perfil (no tiene parámetros de registro), solo regresa.
    if (!userName && !userEmail) {
        navigation.goBack();
    } else {
        // Si viene del Registro, avanza a las pestañas principales.
        navigation.replace('MainTabs', { userName, userEmail });
    }
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />
      
      <View style={styles.dotsRow}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>¿Tienes alergias o intolerancias?</Text>
        <Text style={styles.subtitle}>(Puedes elegir varias)</Text>
        
        <View style={styles.chipsContainer}>
          {ALLERGIES_OPTIONS.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <TouchableOpacity
                key={option}
                onPress={() => toggleAllergy(option)}
                style={[styles.chip, isSelected ? styles.activeChip : styles.inactiveChip]}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, isSelected ? styles.activeChipText : styles.inactiveChipText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleFinish}>
          <Text style={styles.nextButtonText}>Finalizar y Explorar</Text>
        </TouchableOpacity>
        <Text style={styles.feedbackText}>
          Seleccionado: <Text style={styles.feedbackTextBold}>{selected.length === 0 ? 'Ninguna selección' : selected.join(', ')}</Text>
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
    fontSize: 26,
    fontWeight: '800',
    color: '#3E2723',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3E2723',
    opacity: 0.65,
    textAlign: 'center',
    marginBottom: 32,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
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