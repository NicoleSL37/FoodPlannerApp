import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { MEAL_SLOTS } from '../data/mealSlots';
import { buildDays, dateKey, formatDayLabel } from '../utils/plan';
import Chip from './Chip';
import PrimaryButton from './PrimaryButton';

/**
 * Hoja inferior para elegir en qué día y comida del plan se agrega una receta.
 * Props: visible, recipeTitle, plan (para avisar si la comida ya está ocupada), onClose, onConfirm(dateKey, slotId)
 */
export default function AddToPlanModal({ visible, recipeTitle, plan = {}, onClose, onConfirm }) {
    const days = useMemo(() => buildDays(0, 13), []);
    const [selectedKey, setSelectedKey] = useState(dateKey());
    const [selectedSlot, setSelectedSlot] = useState(null);

    // Cada vez que se abre, empieza limpio
    useEffect(() => {
        if (visible) {
            setSelectedKey(dateKey());
            setSelectedSlot(null);
        }
    }, [visible]);

    const occupied = selectedSlot && plan[selectedKey] ? plan[selectedKey][selectedSlot] : null;

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => {}}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>Añadir al plan</Text>
                    <Text style={styles.subtitle} numberOfLines={2}>{recipeTitle}</Text>

                    <Text style={styles.label}>Día</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
                        {days.map((d) => (
                            <Chip
                                key={d.key}
                                label={d.isToday ? 'Hoy' : `${d.day} ${d.date}`}
                                selected={selectedKey === d.key}
                                onPress={() => setSelectedKey(d.key)}
                            />
                        ))}
                    </ScrollView>

                    <Text style={styles.label}>Comida</Text>
                    <View style={styles.wrap}>
                        {MEAL_SLOTS.map((slot) => (
                            <Chip
                                key={slot.id}
                                label={slot.title.charAt(0) + slot.title.slice(1).toLowerCase()}
                                selected={selectedSlot === slot.id}
                                onPress={() => setSelectedSlot(slot.id)}
                            />
                        ))}
                    </View>

                    {occupied ? (
                        <Text style={styles.warning}>Ya tienes "{occupied.title}" en esa comida; se reemplazará.</Text>
                    ) : null}

                    <PrimaryButton
                        title={selectedSlot ? `Añadir a ${formatDayLabel(selectedKey).toLowerCase()}` : 'Elige una comida'}
                        icon="check"
                        disabled={!selectedSlot}
                        onPress={() => onConfirm(selectedKey, selectedSlot)}
                        style={styles.button}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
    sheet: {
        backgroundColor: colors.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
    },
    handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: 13, color: colors.text60, marginTop: 4 },
    label: { fontSize: 12, fontWeight: '700', color: colors.text60, marginTop: 20, marginBottom: 8, letterSpacing: 0.5 },
    row: { gap: 8, paddingRight: 20 },
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    warning: { marginTop: 14, fontSize: 12, color: colors.accent, fontWeight: '600' },
    button: { marginTop: 24 },
});
