import React, { useContext, useEffect, useRef, useState } from 'react';
import { CameraView } from 'expo-camera';
import { Directory, File, Paths } from 'expo-file-system';
import { useIsFocused } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { colors } from '../theme/colors';
import { Screen, ScreenHeader } from '../components';
import usePermission from '../hooks/usePermission';
import { logger } from '../utils/logger';

export default function PreparationRecordScreen({ route, navigation }) {
  const { addHistory } = useContext(UserContext);
  const isFocused = useIsFocused();
  // Llega desde el Plan (source 'plan', con día y comida) o desde el detalle de una receta (source 'free')
  const { recipe, source = 'free', planKey = null, slotId = null } = route.params || {};
  const recipeTitle = recipe?.title || route.params?.recipeTitle || 'Tu platillo';
  const { status: permissionStatus, request: requestCameraPermission, openSettings, isLoading: permissionLoading } = usePermission('camera');
  const [facing, setFacing] = useState('back');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [capturedUri, setCapturedUri] = useState(null);
  const [capturedImageReady, setCapturedImageReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const cameraRef = useRef(null);
  const photoUriRef = useRef(null);
  const cameraPermissionRequested = useRef(false);
  const saveInProgress = useRef(false);

  useEffect(() => {
    if (permissionLoading || permissionStatus !== 'undetermined' || cameraPermissionRequested.current) return;
    cameraPermissionRequested.current = true;
    requestCameraPermission();
  }, [permissionLoading, permissionStatus, requestCameraPermission]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCapture = async () => {
    if (!cameraRef.current || !cameraReady || busy) return;
    setBusy(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (!photo?.uri) throw new Error('La cámara no devolvió una imagen.');
      setCapturedImageReady(false);
      setCapturedUri(photo.uri);
    } catch (error) {
      logger.warn('camara', 'No se pudo capturar la foto.', error);
      Alert.alert('No se pudo tomar la foto', 'Inténtalo de nuevo o guarda el registro sin foto.');
    } finally {
      setBusy(false);
    }
  };

  const handleUsePhoto = async () => {
    if (!capturedUri || busy) return;
    setBusy(true);
    try {
      const directory = new Directory(Paths.document, 'fotos-preparaciones');
      directory.create({ idempotent: true, intermediates: true });
      const destination = new File(directory, `preparacion-${Date.now()}.jpg`);
      await new File(capturedUri).copy(destination);
      if (!destination.exists) throw new Error('La copia terminó, pero el archivo no está disponible.');
      const previousPhotoUri = photoUriRef.current;
      photoUriRef.current = destination.uri;
      if (previousPhotoUri) {
        try { new File(previousPhotoUri).delete(); } catch (error) { logger.warn('camara', 'No se pudo reemplazar la foto anterior.', error); }
      }
      logger.info('camara', 'Foto guardada en el almacenamiento privado.');
      setCapturedUri(null);
    } catch (error) {
      logger.warn('camara', 'No se pudo guardar la foto.', error);
      Alert.alert('No se pudo guardar la foto', 'La foto no quedó guardada. Inténtalo otra vez o repite la captura.');
    } finally {
      setBusy(false);
    }
  };

  // Guarda la preparación en el historial (AsyncStorage), con la URI persistente si se eligió una foto.
  const handleSaveToHistory = () => {
    if (saved || busy || saveInProgress.current) return;
    saveInProgress.current = true;
    setBusy(true);

    const saveEntry = (selectedPhotoUri) => {
      try {
        addHistory({
          recipeId: recipe?.id || '',
          title: recipeTitle,
          category: recipe?.category || '',
          image: recipe?.image || null,
          source,
          planKey,
          slotId,
          hasPhoto: Boolean(selectedPhotoUri),
          photoUri: selectedPhotoUri,
        });
        setSaved(true);
        logger.info('historial', selectedPhotoUri ? 'Preparación guardada con foto.' : 'Preparación guardada sin foto.');
        Alert.alert('Historial', '¡Registrado en tu historial!', [
          { text: 'Seguir aquí', style: 'cancel' },
          { text: 'Ver historial', onPress: () => navigation.replace('History') },
        ]);
      } catch (error) {
        logger.error('historial', 'No se pudo guardar la preparación en el historial.', error);
        Alert.alert('No se pudo guardar', 'Inténtalo de nuevo en unos momentos.');
      } finally {
        saveInProgress.current = false;
        setBusy(false);
      }
    };

    const selectedPhotoUri = photoUriRef.current;
    if (selectedPhotoUri) {
      try {
        if (!new File(selectedPhotoUri).exists) throw new Error('El archivo de la foto ya no existe.');
      } catch (error) {
        logger.warn('camara', 'La foto elegida ya no está disponible; se continuará sin foto.', error);
        photoUriRef.current = null;
        Alert.alert(
          'Foto no disponible',
          'La foto ya no existe en el dispositivo. Puedes guardar el registro sin foto.',
          [{ text: 'Guardar sin foto', onPress: () => saveEntry(null) }],
          { cancelable: false }
        );
        return;
      }
    }
    saveEntry(selectedPhotoUri);
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

        {/* Cámara real y estados de permiso/captura */}
        <View style={styles.cameraViewfinder}>
          {isFocused && permissionStatus === 'granted' && !capturedUri && (
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing}
              flash={facing === 'back' && flashEnabled ? 'on' : 'off'}
              onCameraReady={() => setCameraReady(true)}
              onMountError={(event) => { logger.error('camara', 'No se pudo iniciar la cámara.', event); Alert.alert('Cámara no disponible', 'Cierra otras aplicaciones que estén usando la cámara e inténtalo de nuevo.'); }} />
          )}
          {capturedUri ? <Image source={{ uri: capturedUri }} style={StyleSheet.absoluteFill} resizeMode="cover"
            onLoad={() => setCapturedImageReady(true)}
            onError={(error) => {
              logger.warn('camara', 'No se pudo mostrar la foto capturada.', error.nativeEvent?.error || error);
              setCapturedImageReady(false);
              setCapturedUri(null);
              Alert.alert('No se pudo mostrar la foto', 'Intenta tomarla de nuevo o guarda el registro sin foto.');
            }} /> : null}
          {capturedUri && !capturedImageReady && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator color={colors.white} />
              <Text style={styles.processingText}>Procesando foto...</Text>
            </View>
          )}
          {permissionStatus !== 'granted' && (
            <View style={styles.permissionPanel}>
              {permissionLoading ? <ActivityIndicator color={colors.white} /> : <Feather name="camera-off" size={34} color={colors.white} />}
              <Text style={styles.permissionText}>{permissionLoading
                ? 'Comprobando el permiso de cámara...'
                : permissionStatus === 'blocked'
                  ? 'El permiso de cámara está desactivado. Actívalo en los ajustes del dispositivo.'
                  : 'Necesitamos permiso para fotografiar tu platillo. También puedes guardar el registro sin foto.'}</Text>
              {!permissionLoading && <TouchableOpacity style={styles.permissionButton} onPress={() => navigation.goBack()}><Text style={styles.permissionButtonText}>Ahora no</Text></TouchableOpacity>}
              {!permissionLoading && <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}><Text style={styles.permissionButtonText}>Volver a intentar</Text></TouchableOpacity>}
              {!permissionLoading && <TouchableOpacity style={styles.permissionButton} onPress={async () => {
                const opened = await openSettings();
                if (!opened) Alert.alert('No se pudieron abrir los ajustes', 'Puedes activar el permiso de cámara desde los ajustes del dispositivo.');
              }}><Text style={styles.permissionButtonText}>Abrir ajustes</Text></TouchableOpacity>}
            </View>
          )}
          {/* Indicador superior en vivo */}
          <View style={styles.cameraTopBar}>
            <View style={styles.liveBadge}>
              <View style={styles.pulsingDot} />
              <Text style={styles.liveText}>En vivo</Text>
            </View>
            {isFocused && permissionStatus === 'granted' && !capturedUri && facing === 'back' && <TouchableOpacity style={[styles.flashButton, flashEnabled && styles.flashButtonActive]}
              onPress={() => setFlashEnabled((current) => !current)}
              accessibilityRole="button" accessibilityLabel={flashEnabled ? 'Apagar flash' : 'Encender flash'}>
              <Feather name="zap" size={13} color={flashEnabled ? colors.primary : colors.white} />
            </TouchableOpacity>}
          </View>

          {/* Marcos guía en esquinas */}
          <View style={[styles.guideCorner, styles.cornerTL]} />
          <View style={[styles.guideCorner, styles.cornerTR]} />
          <View style={[styles.guideCorner, styles.cornerBL]} />
          <View style={[styles.guideCorner, styles.cornerBR]} />
        </View>

        {/* Controles de Cámara */}
        {isFocused && permissionStatus === 'granted' && capturedUri && capturedImageReady ? <View style={styles.photoActions}>
          <TouchableOpacity style={styles.secondaryAction} onPress={() => { setCameraReady(false); setCapturedUri(null); }}><Text style={styles.secondaryActionText}>Repetir</Text></TouchableOpacity>
          <TouchableOpacity style={styles.usePhotoAction} onPress={handleUsePhoto} disabled={busy}><Text style={styles.usePhotoActionText}>{busy ? 'Guardando…' : 'Usar esta foto'}</Text></TouchableOpacity>
        </View> : !capturedUri && isFocused && permissionStatus === 'granted' && <View style={styles.cameraControlsRow}>

          {/* Obturador */}
          <TouchableOpacity style={styles.shutterButton} onPress={handleCapture} disabled={!cameraReady || busy || Boolean(capturedUri)} accessibilityRole="button" accessibilityLabel="Tomar foto">
            {busy ? <ActivityIndicator color={colors.primary} /> : <View style={styles.shutterInnerRing}><View style={styles.shutterCore} /></View>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlCircularBtn} onPress={() => { setCameraReady(false); setFacing((current) => current === 'back' ? 'front' : 'back'); }} accessibilityRole="button" accessibilityLabel="Cambiar cámara">
            <Feather name="refresh-cw" size={19} color={colors.text} />
          </TouchableOpacity>
        </View>}

      </ScrollView>

      {/* Botón Guardar Anclado Abajo */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity style={[styles.saveHistoryButton, (saved || busy) && { opacity: 0.5 }]} onPress={handleSaveToHistory} disabled={saved || busy}>
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
  flashButtonActive: { backgroundColor: colors.white },
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
  permissionPanel: { ...StyleSheet.absoluteFillObject, zIndex: 20, backgroundColor: colors.dark, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  processingOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 15, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.dark },
  processingText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  permissionText: { color: colors.white, textAlign: 'center', fontSize: 14, lineHeight: 20 },
  permissionButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.primary },
  permissionButtonText: { color: colors.white, fontWeight: 'bold' },
  photoActions: { width: '100%', flexDirection: 'row', gap: 12, marginTop: 20 },
  secondaryAction: { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.border },
  secondaryActionText: { color: colors.text, fontWeight: 'bold' },
  usePhotoAction: { flex: 1, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary },
  usePhotoActionText: { color: colors.white, fontWeight: 'bold' },
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
