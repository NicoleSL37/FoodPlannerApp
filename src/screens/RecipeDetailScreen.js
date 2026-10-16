import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { Screen, RecipeImage, LoadingState, ErrorState } from '../components';
import { categoryLabel } from '../data/categories';
import { areaLabel } from '../data/areas';
import { getAllergyConflicts } from '../utils/recipeFilters';
import { useRecipe } from '../hooks/useRecipes';

export default function RecipeDetailScreen({ route, navigation }) {
  const { toggleFavorite, isFavorite, allergies, addViewed } = useContext(UserContext);

  // Desde la lista llega la receta parcial (nombre y foto); los ingredientes y pasos se piden a la API
  const { recipeId, recipe: initialRecipe } = route.params || {};
  const { recipe, status, error, reload } = useRecipe(recipeId, initialRecipe);

  // Cada receta que se abre queda en "Vistas recientemente" (se actualiza cuando llegan los datos completos)
  useEffect(() => {
    if (recipe) addViewed(recipe);
  }, [recipe, addViewed]);

  const handleBack = () => {
    navigation.goBack();
  };

  const backButton = (
    <TouchableOpacity style={styles.circularButton} onPress={handleBack} accessibilityLabel="Volver">
      <Feather name="chevron-left" size={20} color={colors.text} style={{ marginRight: 2 }} />
    </TouchableOpacity>
  );

  // Sin ningún dato todavía: pantalla de carga o de error
  if (!recipe) {
    return (
      <Screen>
        <View style={styles.floatingHeader}>{backButton}</View>
        <View style={styles.fallback}>
          {status === 'error' ? (
            <ErrorState title="No pudimos cargar la receta" message={error} onRetry={reload} />
          ) : (
            <LoadingState message="Cargando receta..." />
          )}
        </View>
      </Screen>
    );
  }

  const favorite = isFavorite(recipe.id);
  const isLoaded = !recipe.isPartial;
  const { ingredients, steps } = recipe;
  const conflicts = isLoaded ? getAllergyConflicts(recipe.allergens, allergies) : [];

  const handleCameraRecord = () => {
    navigation.navigate('PreparationRecord', { recipeTitle: recipe.title });
  };

  const handleAddToPlan = () => {
    Alert.alert('Plan semanal', 'Pronto podrás añadir recetas a tu plan semanal.');
  };

  return (
    <Screen>

      {/* Header Flotante superior */}
      <View style={styles.floatingHeader}>
        {backButton}
        <TouchableOpacity
          style={styles.circularButton}
          onPress={() => toggleFavorite(recipe)}
          accessibilityLabel={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>

      {/* ScrollView principal */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero Imagen / Platillo */}
        <View style={styles.heroContainer}>
          <RecipeImage uri={recipe.image} icon={recipe.icon} />
          <View style={styles.heroTag}>
            <Text style={styles.heroTagText}>
              {categoryLabel(recipe.category)}{areaLabel(recipe.area) ? ` · ${areaLabel(recipe.area)}` : ''}
            </Text>
          </View>
        </View>

        {/* Tarjeta Principal de Información */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>

          {/* Fila de Metadatos */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: colors.primarySoft }]}>
                <Feather name="tag" size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Categoría</Text>
                <Text style={styles.metaValue} numberOfLines={1}>{categoryLabel(recipe.category)}</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: 'rgba(230, 57, 70, 0.1)' }]}>
                <Feather name="map-pin" size={14} color={colors.danger} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Origen</Text>
                <Text style={styles.metaValue} numberOfLines={1}>{isLoaded ? areaLabel(recipe.area) || '—' : '...'}</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaItem}>
              <View style={[styles.metaIconBox, { backgroundColor: colors.primarySoft }]}>
                <Feather name="list" size={14} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.metaLabel}>Ingredientes</Text>
                <Text style={styles.metaValue}>{isLoaded ? ingredients.length : '...'}</Text>
              </View>
            </View>
          </View>

          {/* Aviso de alérgenos (estimado a partir de los ingredientes) */}
          {conflicts.length > 0 ? (
            <View style={[styles.noticeBox, styles.noticeBoxDanger]}>
              <Text style={[styles.noticeText, styles.noticeTextDanger]}>
                Ojo: contiene {conflicts.join(', ')}, que marcaste en tus alergias.
              </Text>
              <Text style={styles.noticeText}>Es una estimación según los ingredientes. Verifícalo antes de cocinar.</Text>
            </View>
          ) : isLoaded && recipe.allergens && recipe.allergens.length > 0 ? (
            <View style={styles.noticeBox}>
              <Text style={styles.noticeText}>Contiene (estimado): {recipe.allergens.join(', ')}</Text>
            </View>
          ) : null}

          {/* Mientras llegan los datos completos, o si falló la carga */}
          {!isLoaded ? (
            status === 'error' ? (
              <ErrorState title="No pudimos cargar los ingredientes" message={error} onRetry={reload} />
            ) : (
              <LoadingState message="Cargando ingredientes y pasos..." />
            )
          ) : (
            <>
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
                        <Feather name="check" size={11} color={colors.primary} />
                      </View>
                      <Text style={styles.ingredientText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Sección: Paso a paso */}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Paso a paso</Text>
                {steps.length === 0 ? (
                  <Text style={styles.emptyStepsText}>Esta receta no trae instrucciones.</Text>
                ) : (
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
                )}

                {/* Botón Ya lo cociné */}
                <TouchableOpacity style={styles.cameraButton} onPress={handleCameraRecord}>
                  <Feather name="camera" size={18} color={colors.primary} />
                  <Text style={styles.cameraButtonText}>¡Ya lo cociné! Registrar foto</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

        </View>
      </ScrollView>

      {/* Botón Flotante Inferior */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity style={styles.addToPlanButton} onPress={handleAddToPlan}>
          <Feather name="calendar" size={18} color={colors.white} />
          <Text style={styles.addToPlanText}>Añadir al Plan Semanal</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  noticeBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  noticeBoxDanger: {
    backgroundColor: 'rgba(230, 57, 70, 0.1)',
  },
  noticeText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.text,
  },
  noticeTextDanger: {
    color: colors.danger,
    fontWeight: '700',
  },
  emptyStepsText: {
    fontSize: 13,
    color: colors.text60,
    marginTop: 8,
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
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.text,
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
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroTag: {
    position: 'absolute',
    bottom: 14,
    left: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  heroTagText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  mainInfoCard: {
    backgroundColor: colors.background,
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
    color: colors.text,
    marginBottom: 14,
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.text60,
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
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
    color: colors.text,
    marginBottom: 12,
  },
  sectionSubtitleBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  ingredientsCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderColor: colors.surfaceMuted,
  },
  checkIconBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  stepsContainer: {
    gap: 10,
  },
  stepCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
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
    borderColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
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
    backgroundColor: colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 4,
  },
  addToPlanText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});