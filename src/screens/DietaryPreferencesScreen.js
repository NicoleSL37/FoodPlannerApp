import React, { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { Chip, OnboardingStep } from '../components';
import { DIET_OPTIONS } from '../data/preferences';
import { logger } from '../utils/logger';


export default function DietaryPreferencesScreen({ route, navigation }) {
  // mode: 'onboarding' (viene del registro) | 'edit' (viene del Perfil)
  const isEdit = route.params?.mode === 'edit';
  const { dietaryPreference, setDietaryPreference } = useContext(UserContext);
  const [selected, setSelected] = useState(dietaryPreference);

  const handleNext = () => {
    if (!DIET_OPTIONS.includes(selected)) {
      logger.warn('app', 'Preferencia de dieta inválida; no se guardó el cambio.');
      Alert.alert('Selección no válida', 'Elige una opción de dieta para continuar.');
      return;
    }
    setDietaryPreference(selected);

    if (isEdit) {
      navigation.goBack();
    } else {
      navigation.navigate('Allergies', { mode: 'onboarding' });
    }
  };

  return (
    <OnboardingStep
      step={1}
      showDots={!isEdit}
      title="¿Sigues alguna dieta especial?"
      buttonLabel={isEdit ? 'Guardar' : 'Siguiente'}
      onNext={handleNext}
      feedback={selected}
    >
      {DIET_OPTIONS.map((diet) => (
        <Chip key={diet} label={diet} size="lg" selected={selected === diet} onPress={() => setSelected(diet)} />
      ))}
    </OnboardingStep>
  );
}
