import React, { useEffect } from 'react';
import { UserProvider } from './src/context/UserContext';
import AppNavigator, { navigationRef } from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { logger } from './src/utils/logger';

const errorUtils = global.ErrorUtils;
if (errorUtils && !errorUtils.__foodPlannerLoggerInstalled) {
    const previousHandler = errorUtils.getGlobalHandler?.();
    errorUtils.setGlobalHandler?.((error, isFatal) => {
        logger.error('app', 'Error de JavaScript no capturado.', { error, isFatal });
        previousHandler?.(error, isFatal);
    });
    errorUtils.__foodPlannerLoggerInstalled = true;
}

export default function App() {
    useEffect(() => {
        logger.info('app', 'Aplicación iniciada.');
    }, []);

    return (
        <ErrorBoundary navigationRef={navigationRef}>
            <UserProvider>
                <AppNavigator />
            </UserProvider>
        </ErrorBoundary>
    );
}
