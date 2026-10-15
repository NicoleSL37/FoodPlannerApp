import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Screen, ScreenHeader } from '../components';

export default function HistoryScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Plan Semanal');

  const historyData = [
    {
      id: '1',
      title: 'Tostadas de Aguacate',
      category: 'Desayuno',
      time: 'Ayer, 08:30 AM',
      type: 'Plan Semanal',
      tag: 'Completado',
    },
    {
      id: '2',
      title: 'Smoothie Detox',
      category: 'Snack',
      time: 'Hoy, 10:15 AM',
      type: 'Cocina Libre',
      tag: 'Completado',
    },
  ];

  const filteredHistory = historyData.filter(item => item.type === activeTab);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <Screen>

      <ScreenHeader title="Mi Historial" onBack={handleBack} />

      {/* Filtros: Chips 50% / 50% */}
      <View style={styles.filterWrapper}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'Plan Semanal' ? styles.activeChip : styles.inactiveChip]}
            onPress={() => setActiveTab('Plan Semanal')}
          >
            <Feather name="calendar" size={14} color={activeTab === 'Plan Semanal' ? colors.white : colors.text} />
            <Text style={[styles.filterChipText, activeTab === 'Plan Semanal' ? styles.activeChipText : styles.inactiveChipText]}>
              Plan Semanal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterChip, activeTab === 'Cocina Libre' ? styles.activeChip : styles.inactiveChip]}
            onPress={() => setActiveTab('Cocina Libre')}
          >
            <Feather name="coffee" size={14} color={activeTab === 'Cocina Libre' ? colors.white : colors.text} style={{ opacity: activeTab === 'Cocina Libre' ? 1 : 0.7 }} />
            <Text style={[styles.filterChipText, activeTab === 'Cocina Libre' ? styles.activeChipText : styles.inactiveChipText]}>
              Cocina Libre
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de Historial */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Registros guardados</Text>
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>{filteredHistory.length} recetas</Text>
          </View>
        </View>

        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              {/* Fondo simulación foto */}
              <View style={styles.cardPhotoPlaceholder}>
                <View style={styles.cameraIconBox}>
                  <Feather name="camera" size={24} color="rgba(255,255,255,0.4)" />
                </View>
                <Text style={styles.photoText}>Foto capturada en vivo</Text>
                
                <View style={styles.completedTag}>
                  <View style={styles.greenDot} />
                  <Text style={styles.completedTagText}>{item.tag}</Text>
                </View>
              </View>

              {/* Bloque inferior de información */}
              <View style={styles.cardFooter}>
                <View style={styles.cardFooterTop}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.category}</Text>
                  </View>
                </View>

                <View style={styles.cardFooterBottom}>
                  <View style={styles.metaInfo}>
                    <Feather name="clock" size={14} color={colors.primary} />
                    <Text style={styles.metaText}>{item.time}</Text>
                  </View>
                  <View style={styles.metaInfo}>
                    <Feather name={item.type === 'Plan Semanal' ? 'check-circle' : 'coffee'} size={14} color={colors.primary} />
                    <Text style={styles.metaTypeText}>{item.type}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          /* Estado Vacío por si el filtro no tiene elementos */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBox}>
              <Feather name="camera-off" size={28} color={colors.text50} />
            </View>
            <Text style={styles.emptyTitle}>Sin preparaciones aún</Text>
            <Text style={styles.emptySubtitle}>
              Aún no tienes registros en esta categoría. ¡Cocina una receta y captura tu foto!
            </Text>
          </View>
        )}

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(234, 230, 223, 0.6)',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(221, 216, 206, 0.5)',
    gap: 6,
  },
  filterChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  activeChip: {
    backgroundColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveChip: {
    backgroundColor: 'transparent',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeChipText: {
    color: colors.white,
  },
  inactiveChipText: {
    color: colors.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text70,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  summaryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  historyCard: {
    width: '100%',
    height: 270,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.dark,
    position: 'relative',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardPhotoPlaceholder: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cameraIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  photoText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  completedTag: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(44, 44, 44, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  completedTagText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  cardFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 16,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    gap: 6,
  },
  cardFooterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  categoryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'uppercase',
  },
  cardFooterBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text70,
  },
  metaTypeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.text60,
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 18,
  },
});