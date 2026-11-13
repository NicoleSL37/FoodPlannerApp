import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as permissionsService from '../services/permissionsService';

export default function usePermission(kind) {
    const [status, setStatus] = useState('undetermined');
    const [isLoading, setIsLoading] = useState(true);
    const mounted = useRef(false);
    const operationId = useRef(0);
    const requestInProgress = useRef(false);

    const refresh = useCallback(async () => {
        const currentOperation = ++operationId.current;
        if (mounted.current) setIsLoading(true);
        const nextStatus = await permissionsService.checkPermission(kind);
        if (mounted.current && currentOperation === operationId.current) {
            setStatus(nextStatus);
            setIsLoading(false);
        }
        return nextStatus;
    }, [kind]);

    const request = useCallback(async () => {
        requestInProgress.current = true;
        const currentOperation = ++operationId.current;
        if (mounted.current) setIsLoading(true);
        try {
            const nextStatus = await permissionsService.requestPermission(kind);
            if (mounted.current && currentOperation === operationId.current) {
                setStatus(nextStatus);
                setIsLoading(false);
            }
            return nextStatus;
        } finally {
            requestInProgress.current = false;
        }
    }, [kind]);

    const openSettings = useCallback(() => permissionsService.openAppSettings(), []);

    useEffect(() => {
        mounted.current = true;
        refresh();
        const subscription = AppState.addEventListener('change', (nextState) => {
            if (nextState === 'active' && !requestInProgress.current) refresh();
        });
        return () => {
            mounted.current = false;
            subscription.remove();
        };
    }, [refresh]);

    return { status, request, openSettings, isLoading, refresh };
}
