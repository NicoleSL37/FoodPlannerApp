import React, { useContext, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { Screen, ScreenHeader } from '../components';

export default function PreparationRecordScreen({ route, navigation }) {
  const { addHistory } = useContext(UserContext);
  // Llega desde el Plan (source 'plan', con día y comida) o desde el detalle de una receta (source 'free')
  const { recipe, source = 'free', planKey = null, slotId = null } = route.params || {};
  const recipeTitle = recipe?.title || route.params?.recipeTitle || 'Tu platillo';
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCapture = () => {
    setPhotoCaptured(true);
    Alert.alert('Foto', '¡Foto de preparación capturada con éxito!');
  };

  // Guarda la preparación en el historial (AsyncStorage). La foto es simulada hasta el APF3, por eso solo se guarda si hubo captura.
  const handleSaveToHistory = () => {
    if (saved) return;
    addHistory({
      recipeId: recipe?.id || '',
      title: recipeTitle,
      category: recipe?.category || '',
      image: recipe?.image || null,
      source,
      planKey,
      slotId,
      hasPhoto: photoCaptured,
    });
    setSaved(true);
    Alert.alert('Historial', '¡Registrado en tu historial!', [
      { text: 'Seguir aquí', style: 'cancel' },
      { text: 'Ver historial', onPress: () => navigation.replace('History') },
    ]);
  };

  return (
    <Screen>

      <ScreenHeader title="Registro de Preparación" onBack={handleBack} />

      {/* Contenido Principal */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Tarjeta de Receta Actual */}
        <View style={styles.currentRecipeCard}>
          <View style={styles.currentRecipeLeft}>
            <View style={styles.checkCircleBox}>
              <Feather name="check" size={14} color={colors.white} style={{ strokeWidth: 3 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cookingLabel}>Cocinando</Text>
              <Text style={styles.recipeNameText} numberOfLines={1}>{recipeTitle}</Text>
            </View>
          </View>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Último paso</Text>
          </View>
        </View>

        {/* Visor de Cámara (Mockup) */}
        <View style={styles.cameraViewfinder}>
          {/* Indicador superior en vivo */}
          <View style={styles.cameraTopBar}>
            <View style={styles.liveBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.liveText}>En vivo</Text>
            </View>
            <View style={styles.flashButton}>
              <Feather name="zap" size={13} color="rgba(255,255,255,0.8)" />
            </View>
          </View>

          {/* Ícono central */}
          <View style={styles.cameraCenterContent}>
            <View style={styles.cameraIconCircle}>
              <Feather name="camera" size={48} color="rgba(255,255,255,0.35)" />
            </View>
            <Text style={styles.cameraGuideText}>
              {photoCaptured ? '¡Foto lista para guardar!' : 'Apunta hacia tu platillo terminado'}
            </Text>
          </View>

          {/* Marcos guía en esquinas */}
          <View style={[styles.guideCorner, styles.cornerTL]} />
          <View style={[styles.guideCorner, styles.cornerTR]} />
          <View style={[styles.guideCorner, styles.cornerBL]} />
          <View style={[styles.guideCorner, styles.cornerBR]} />
        </View>

        {/* Controles de Cámara */}
        <View style={styles.cameraControlsRow}>
          <TouchableOpacity style={styles.controlCircularBtn}>
            <Feather name="image" size={20} color={colors.text} />
          </TouchableOpacity>

          {/* Obturador */}
          <TouchableOpacity style={styles.shutterButton} onPress={handleCapture}>
            <View style={styles.shutterInnerRing}>
              <View style={styles.shutterCore} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlCircularBtn}>
            <Feather name="refresh-cw" size={19} color={colors.text} />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Botón Guardar Anclado Abajo */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity style={[styles.saveHistoryButton, saved && { opacity: 0.5 }]} onPress={handleSaveToHistory} disabled={saved}>
          <Feather name="save" size={18} color={colors.text} style={{ marginRight: 8 }} />
          <Text style={styles.saveHistoryText}>{saved ? 'Guardado en tu Historial' : 'Guardar en mi Historial'}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  currentRecipeCard: {
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  currentRecipeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 8,
  },
  checkCircleBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text60,
    textTransform: 'uppercase',
  },
  recipeNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
  stepBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cameraViewfinder: {
    width: '100%',
    height: 360,
    backgroundColor: colors.dark,
    borderRadius: 26,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.dark2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  cameraTopBar: {
    position: 'absolute',
    top: 16,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  liveBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  flashButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraCenterContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  cameraIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  cameraGuideText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.3,
  },
  guideCorner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cornerTL: { top: 20, left: 20, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 8 },
  cornerTR: { top: 20, right: 20, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 8 },
  cornerBL: { bottom: 20, left: 20, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 8 },
  cornerBR: { bottom: 20, right: 20, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 8 },
  cameraControlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 16,
  },
  controlCircularBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shutterInnerRing: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryMid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingFooter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 40,
  },
  saveHistoryButton: {
    width: '100%',
    height: 52,
    backgroundColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  saveHistoryText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
});