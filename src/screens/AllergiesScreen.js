import React, { useState, useContext } from 'react';
import { Alert } from 'react-native';
import { UserContext } from '../context/UserContext';
import { Chip, OnboardingStep } from '../components';
import { ALLERGY_OPTIONS } from '../data/preferences';
import { logger } from '../utils/logger';


export default function AllergiesScreen({ route, navigation }) {
  // mode: 'onboarding' (viene del registro) | 'edit' (viene del Perfil)
  const isEdit = route.params?.mode === 'edit';
  const { allergies, setAllergies } = useContext(UserContext);
  const [selected, setSelected] = useState(allergies);

  const toggleAllergy = (option) => {
    if (option === 'Ninguna') {
      setSelected(['Ninguna']);
      return;
    }
    const withoutNone = selected.filter((item) => item !== 'Ninguna');
    const updated = withoutNone.includes(option)
      ? withoutNone.filter((item) => item !== option)
      : [...withoutNone, option];

    setSelected(updated.length > 0 ? updated : ['Ninguna']);
  };

  const handleFinish = () => {
    const validSelection = selected.length > 0
      && selected.every((option) => ALLERGY_OPTIONS.includes(option))
      && (!selected.includes('Ninguna') || selected.length === 1);
    if (!validSelection) {
      logger.warn('app', 'Selección de alergias inválida; no se guardó el cambio.');
      Alert.alert('Selección no válida', 'Elige una o más opciones válidas antes de continuar.');
      return;
    }
    setAllergies(selected);

    if (isEdit) {
      navigation.goBack();
    } else {
      // reset: limpia el historial para que "atrás" no regrese al registro.
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  return (
    <OnboardingStep
      step={2}
      showDots={!isEdit}
      title="¿Tienes alergias o intolerancias?"
      subtitle="(Puedes elegir varias)"
      buttonLabel={isEdit ? 'Guardar' : 'Finalizar y Explorar'}
      onNext={handleFinish}
      feedback={selected.join(', ')}
    >
      {ALLERGY_OPTIONS.map((option) => (
        <Chip
          key={option}
          label={option}
          size="lg"
          selected={selected.includes(option)}
          onPress={() => toggleAllergy(option)}
        />
      ))}
    </OnboardingStep>
  );
}
