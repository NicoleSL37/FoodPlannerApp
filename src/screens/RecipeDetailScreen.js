import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function RecipeDetailScreen({ navigation }) {
  const [isFavorite, setIsFavorite] = useState(true);

  const ingredients = [
    '1/2 taza de avena en hojuelas',
    '1 taza de leche de almendras sin azúcar',
    '1 cucharada de semillas de chía',
    '1/2 plátano cortado en rodajas finas',
    '1 puñado de frutos rojos frescos y miel',
  ];

  const steps = [
    'Cocina la avena junto con la leche de almendras en una olla pequeña a fuego medio durante 5-7 minutos hasta obtener una textura cremosa.',
    'Retira del fuego e incorpora las semillas de chía mezclando suavemente. Deja reposar durante 2 minutos.',
    'Sirve en un tazón hondo y decora con las rodajas de plátano, los frutos rojos frescos y un hilo fino de miel o canela al gusto.',
  ];

  const handleBack = () => {
    console.log('Volviendo...');
    navigation.goBack();
  };

  const handleCameraRecord = () => {
    console.log('Abriendo cámara para registrar plato...');
    navigation.navigate('PreparationRecord');
  };

  const handleAddToPlan = () => {
    console.log('Añadido al plan semanal');
    alert('¡Receta añadida a tu plan semanal!');
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* Header Flotante superior */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.circularButton} onPress={handleBack}>
          <Feather name="chevron-left" size={20} color="#3E2723" style={{ marginRight: 2 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.circularButton} onPress={() => setIsFavorite(!isFavorite)}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={18} color="#E63946" />
        </TouchableOpacity>
      </View>

      {/* ScrollView principal */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Imagen / Platillo */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: 'https://picsum.photos/800/500' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroTag}>
            <Text style={styles.heroTagText}>Desayuno Saludable</Text>
          </View>
        </View>

        {/* Tarjeta Principal de Información */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.recipeTitle}>Bowl de Avena con Frutas y Chía</Text>

          {/* Fila de Metadatos */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: 'rgba(132, 169, 140, 0.12)' }]}>
                <Feather name="clock" size={14} color="#84A98C" />
              </View>
              <View>
                <Text style={styles.metaLabel}>Tiempo</Text>
                <Text style={styles.metaValue}>15 min</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: 'rgba(230, 57, 70, 0.1)' }]}>
                <Ionicons name="flame" size={14} color="#E63946" />
              </View>
              <View>
                <Text style={styles.metaLabel}>Calorías</Text>
                <Text style={styles.metaValue}>320 kcal</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: 'rgba(132, 169, 140, 0.12)' }]}>
                <Feather name="user" size={14} color="#84A98C" />
              </View>
              <View>
                <Text style={styles.metaLabel}>Porción</Text>
                <Text style={styles.metaValue}>1 pers.</Text>
              </View>
            </View>
          </View>

          {/* Sección: Ingredientes */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              <Text style={styles.sectionSubtitleBadge}>{ingredients.length} elementos</Text>
            </View>

            <View style={styles.ingredientsCard}>
              {ingredients.map((item, index) => (
                <View key={index} style={[styles.ingredientRow, index !== ingredients.length - 1 && styles.ingredientBorder]}>
                  <View style={styles.checkIconBox}>
                    <Feather name="check" size={11} color="#84A98C" />
                  </View>
                  <Text style={styles.ingredientText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Sección: Paso a paso */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Paso a paso</Text>
            <View style={styles.stepsContainer}>
              {steps.map((stepText, index) => (
                <View key={index} style={styles.stepCard}>
                  <View style={styles.stepNumberBox}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{stepText}</Text>
                </View>
              ))}
            </View>

            {/* Botón Ya lo cociné */}
            <TouchableOpacity style={styles.cameraButton} onPress={handleCameraRecord}>
              <Feather name="camera" size={18} color="#84A98C" />
              <Text style={styles.cameraButtonText}>¡Ya lo cociné! Registrar foto</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* Botón Flotante Inferior */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity style={styles.addToPlanButton} onPress={handleAddToPlan}>
          <Feather name="calendar" size={18} color="#FFF" />
          <Text style={styles.addToPlanText}>Añadir al Plan Semanal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1, // Esto hace que la pantalla se adapte exactamente a tu celular
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    backgroundColor: '#FDFBF7',
    overflow: 'hidden',
    position: 'relative',
  },
  floatingHeader: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    zIndex: 25,
  },
  circularButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(253, 251, 247, 0.92)',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3E2723',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#EAE6DF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(132, 169, 140, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTag: {
    position: 'absolute',
    bottom: 14,
    left: 18,
    backgroundColor: '#84A98C',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroTagText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  mainInfoCard: {
    backgroundColor: '#FDFBF7',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 10,
    marginTop: -8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  recipeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3E2723',
    marginBottom: 14,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaLabel: {
    fontSize: 10,
    color: 'rgba(62, 39, 35, 0.6)',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3E2723',
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#EAE6DF',
  },
  sectionContainer: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3E2723',
    marginBottom: 12,
  },
  sectionSubtitleBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#84A98C',
  },
  ingredientsCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
  },
  ingredientBorder: {
    borderBottomWidth: 1,
    borderColor: '#F4F1EA',
  },
  checkIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(132, 169, 140, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3E2723',
  },
  stepsContainer: {
    gap: 10,
  },
  stepCard: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumberBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAE6DF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3E2723',
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#3E2723',
    fontWeight: '500',
  },
  cameraButton: {
    marginTop: 16,
    width: '100%',
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#84A98C',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#84A98C',
  },
  floatingFooter: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 40,
  },
  addToPlanButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#84A98C',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#84A98C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },
  addToPlanText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});