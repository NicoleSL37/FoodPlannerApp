import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { Chip, OnboardingStep } from '../components';
import { DIET_OPTIONS } from '../data/preferences';


export default function DietaryPreferencesScreen({ route, navigation }) {
  // mode: 'onboarding' (viene del registro) | 'edit' (viene del Perfil)
  const isEdit = route.params?.mode === 'edit';
  const { dietaryPreference, setDietaryPreference } = useContext(UserContext);
  const [selected, setSelected] = useState(dietaryPreference);

  const handleNext = () => {
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
