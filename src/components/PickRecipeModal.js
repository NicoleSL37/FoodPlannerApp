import React from 'react';
import { FlatList, Image, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { categoryLabel } from '../data/categories';
import EmptyState from './EmptyState';

/**
 * Hoja inferior para elegir una receta (de tus favoritas y vistas) para una comida del plan.
 * Props: visible, title, recipes [{ ...receta, source }], onClose, onSelect(receta)
 */
export default function PickRecipeModal({ visible, title, recipes, onClose, onSelect }) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.sheet} onPress={() => {}}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle}>Elige entre tus favoritas y las que viste hace poco</Text>

                    {recipes.length === 0 ? (
                        <EmptyState
                            icon="heart"
                            title="Aún no tienes recetas guardadas"
                            message="Marca recetas con el corazón o ábrelas desde Inicio y aparecerán aquí."
                        />
                    ) : (
                        <FlatList
                            data={recipes}
                            keyExtractor={(item) => item.id}
                            style={styles.list}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.item} onPress={() => onSelect(item)} activeOpacity={0.8}>
                                    <View style={styles.thumb}>
                                        {item.image ? (
                                            <Image source={{ uri: item.image }} style={styles.thumbImage} resizeMode="cover" />
                                        ) : (
                                            <Feather name={item.icon || 'coffee'} size={20} color={colors.primary} />
                                        )}
                                    </View>
                                    <View style={styles.info}>
                                        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                                        <Text style={styles.itemMeta} numberOfLines={1}>
                                            {[categoryLabel(item.category), item.source].filter(Boolean).join(' · ')}
                                        </Text>
                                    </View>
                                    <Feather name="plus-circle" size={20} color={colors.primary} />
                                </TouchableOpacity>
                            )}
                        />
                    )}
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
        paddingBottom: 24,
        maxHeight: '75%',
    },
    handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong, marginBottom: 16 },
    title: { fontSize: 20, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: 13, color: colors.text60, marginTop: 4, marginBottom: 12 },
    list: { flexGrow: 0 },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 16,
        padding: 10,
        marginBottom: 10,
    },
    thumb: {
        width: 52,
        height: 52,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: colors.primaryTint,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbImage: { width: '100%', height: '100%' },
    info: { flex: 1 },
    itemTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text },
    itemMeta: { fontSize: 12, color: colors.text60, marginTop: 2 },
});
