import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function PreparationRecordScreen({ navigation }) {
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const handleBack = () => {
    console.log('Volviendo...');
    navigation.goBack();
  };

  const handleCapture = () => {
    console.log('Foto capturada');
    setPhotoCaptured(true);
    alert('¡Foto de preparación capturada con éxito!');
  };

  const handleSaveToHistory = () => {
    console.log('Guardando en historial...');
    alert('¡Registrado en tu historial!');
    // navigation.navigate('History');
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FDFBF7" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Feather name="chevron-left" size={20} color="#3E2723" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registro de Preparación</Text>
        <View style={styles.spacer} />
      </View>

      {/* Contenido Principal */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Tarjeta de Receta Actual */}
        <View style={styles.currentRecipeCard}>
          <View style={styles.currentRecipeLeft}>
            <View style={styles.checkCircleBox}>
              <Feather name="check" size={14} color="#FFF" style={{ strokeWidth: 3 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cookingLabel}>Cocinando</Text>
              <Text style={styles.recipeNameText} numberOfLines={1}>Bowl de Avena con Frutas</Text>
            </View>
          </View>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>Paso 3/3</Text>
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
            <Feather name="image" size={20} color="#3E2723" />
          </TouchableOpacity>

          {/* Obturador */}
          <TouchableOpacity style={styles.shutterButton} onPress={handleCapture}>
            <View style={styles.shutterInnerRing}>
              <View style={styles.shutterCore} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlCircularBtn}>
            <Feather name="refresh-cw" size={19} color="#3E2723" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Botón Guardar Anclado Abajo */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity style={styles.saveHistoryButton} onPress={handleSaveToHistory}>
          <Feather name="save" size={18} color="#3E2723" style={{ marginRight: 8 }} />
          <Text style={styles.saveHistoryText}>Guardar en mi Historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
        flex: 1, 
        backgroundColor: '#FDFBF7',
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
    },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#3E2723',
    textAlign: 'center',
    flex: 1,
  },
  spacer: {
    width: 40,
    height: 40,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  currentRecipeCard: {
    width: '100%',
    backgroundColor: '#EAE6DF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD8CE',
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
    backgroundColor: '#84A98C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookingLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(62, 39, 35, 0.6)',
    textTransform: 'uppercase',
  },
  recipeNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3E2723',
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
    color: '#84A98C',
  },
  cameraViewfinder: {
    width: '100%',
    height: 360,
    backgroundColor: '#2C2C2C',
    borderRadius: 26,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3E3E3E',
    shadowColor: '#000',
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
    backgroundColor: '#34D399',
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
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
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
    borderColor: '#84A98C',
    backgroundColor: '#FFF',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shutterInnerRing: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCore: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(132, 169, 140, 0.2)',
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
    backgroundColor: '#EAE6DF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#DDD8CE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  saveHistoryText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#3E2723',
  },
});