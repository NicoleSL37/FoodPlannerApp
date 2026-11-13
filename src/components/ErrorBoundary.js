import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import PrimaryButton from './PrimaryButton';
import Screen from './Screen';
import { logger } from '../utils/logger';

export default class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        logger.error('app', 'Error capturado por ErrorBoundary.', {
            error,
            componentStack: info?.componentStack || '',
        });
    }

    handleRetry = () => this.setState({ hasError: false });

    handleGoHome = () => {
        const { navigationRef } = this.props;
        if (navigationRef?.isReady?.()) {
            navigationRef.navigate('MainTabs');
            this.setState({ hasError: false });
        }
    };

    render() {
        if (!this.state.hasError) return this.props.children;
        const navigationAvailable = Boolean(this.props.navigationRef?.isReady?.());
        return (
            <Screen style={styles.screen}>
                <View style={styles.iconContainer}>
                    <Feather name="alert-triangle" size={30} color={colors.danger} />
                </View>
                <Text style={styles.title}>Algo salió mal</Text>
                <Text style={styles.message}>Ocurrió un problema inesperado. Puedes intentarlo de nuevo o volver al inicio.</Text>
                <PrimaryButton title="Reintentar" icon="refresh-cw" onPress={this.handleRetry} style={styles.button} />
                {navigationAvailable && (
                    <PrimaryButton title="Volver al inicio" icon="home" onPress={this.handleGoHome} style={styles.button} />
                )}
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    screen: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: colors.primaryTint,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
    },
    title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
    message: { marginTop: 8, maxWidth: 300, fontSize: 14, lineHeight: 20, color: colors.text60, textAlign: 'center' },
    button: { alignSelf: 'stretch', marginTop: 14 },
});
