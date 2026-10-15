import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

/**
 * Logo de FoodPlanner (tenedor + plato con calendario) dibujado con View, con título y subtítulo.
 * compact: versión más pequeña para pantallas con formularios largos.
 */
export default function BrandLogo({ subtitle, compact = false }) {
    return (
        <View style={[styles.section, compact ? styles.sectionCompact : styles.sectionRegular]}>
            <View style={styles.iconWrapper}>
                <View style={styles.forkContainer}>
                    <View style={styles.forkProngs}>
                        <View style={styles.forkProng} />
                        <View style={styles.forkProng} />
                        <View style={styles.forkProng} />
                    </View>
                    <View style={styles.forkBase} />
                    <View style={styles.forkHandle} />
                </View>
                <View style={styles.plate}>
                    <View style={styles.calendarGrid}>
                        {[0, 1, 2].map((row) => (
                            <View key={row} style={styles.gridRow}>
                                <View style={styles.gridCell} />
                                <View style={styles.gridCell} />
                                <View style={styles.gridCell} />
                            </View>
                        ))}
                    </View>
                </View>
            </View>
            <Text style={[styles.title, compact && styles.titleCompact]}>FoodPlanner</Text>
            {subtitle ? <Text style={[styles.subtitle, compact && styles.subtitleCompact]}>{subtitle}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { alignItems: 'center' },
    sectionRegular: { marginBottom: 36 },
    sectionCompact: { marginBottom: 24, marginTop: 10 },
    iconWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    forkContainer: { alignItems: 'center', marginRight: 14, height: 70 },
    forkProngs: { flexDirection: 'row', justifyContent: 'space-between', width: 14, height: 18 },
    forkProng: { width: 2.5, height: 18, backgroundColor: colors.primary, borderRadius: 2 },
    forkBase: { width: 14, height: 3, backgroundColor: colors.primary, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
    forkHandle: { width: 3.5, height: 36, backgroundColor: colors.primary, borderRadius: 2 },
    plate: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 5,
        borderColor: colors.primary,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarGrid: { width: 48, height: 48, justifyContent: 'space-between' },
    gridRow: { flexDirection: 'row', justifyContent: 'space-between', flex: 1 },
    gridCell: { flex: 1, margin: 2, backgroundColor: colors.border, borderRadius: 3 },
    title: { fontSize: 32, fontWeight: 'bold', color: colors.text },
    titleCompact: { fontSize: 26, fontWeight: '800', marginBottom: 4 },
    subtitle: { fontSize: 14, color: colors.text, opacity: 0.65, marginTop: 4 },
    subtitleCompact: { fontWeight: '600', opacity: 0.7, marginTop: 0 },
});
