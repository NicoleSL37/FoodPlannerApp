import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Screen from './Screen';
import PrimaryButton from './PrimaryButton';

/**
 * Plantilla de un paso del onboarding (dieta, alergias).
 * - step / totalSteps: puntos de progreso (solo si showDots es true)
 * - children: contenido central (normalmente chips)
 * - feedback: texto "Seleccionado: ..." bajo el botón
 */
export default function OnboardingStep({
    step = 1,
    totalSteps = 2,
    showDots = true,
    title,
    subtitle,
    buttonLabel,
    onNext,
    feedbackLabel = 'Seleccionado: ',
    feedback,
    children,
}) {
    return (
        <Screen style={styles.root}>
            {showDots && (
                <View style={styles.dotsRow}>
                    {Array.from({ length: totalSteps }, (_, i) => (
                        <View key={i} style={[styles.dot, i + 1 === step && styles.activeDot]} />
                    ))}
                </View>
            )}

            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : <View style={styles.titleGap} />}
                <View style={styles.chips}>{children}</View>
            </View>

            <View style={styles.footer}>
                <PrimaryButton title={buttonLabel} onPress={onNext} size="lg" />
                {feedback ? (
                    <Text style={styles.feedbackText}>
                        {feedbackLabel}
                        <Text style={styles.feedbackBold}>{feedback}</Text>
                    </Text>
                ) : null}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    root: { padding: 24, paddingTop: 40, justifyContent: 'space-between' },
    dotsRow: { flexDirection: 'row', alignSelf: 'center', gap: 8, marginBottom: 24 },
    dot: { width: 8, height: 6, borderRadius: 3, backgroundColor: colors.border },
    activeDot: { width: 28, backgroundColor: colors.primary },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center', lineHeight: 32 },
    subtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.text,
        opacity: 0.65,
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 32,
    },
    titleGap: { height: 34 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
    footer: { width: '100%', paddingBottom: 20 },
    feedbackText: { textAlign: 'center', color: colors.text, fontSize: 13, opacity: 0.7, marginTop: 16 },
    feedbackBold: { fontWeight: 'bold', opacity: 1 },
});
