// Paleta única de la app. Úsala en lugar de escribir códigos hex en cada pantalla.
export const colors = {
    // Base
    background: '#FDFBF7',
    surface: '#FFFFFF',
    surfaceMuted: '#F4F1EA',
    border: '#EAE6DF',
    borderStrong: '#DDD8CE',

    // Marca
    primary: '#84A98C',
    primarySoft: 'rgba(132, 169, 140, 0.12)',
    primaryTint: 'rgba(132, 169, 140, 0.15)',
    primaryMid: 'rgba(132, 169, 140, 0.2)',

    // Texto
    text: '#3E2723',
    text75: 'rgba(62, 39, 35, 0.75)',
    text70: 'rgba(62, 39, 35, 0.7)',
    text60: 'rgba(62, 39, 35, 0.6)',
    text50: 'rgba(62, 39, 35, 0.5)',
    text40: 'rgba(62, 39, 35, 0.4)',
    text30: 'rgba(62, 39, 35, 0.3)',
    placeholder: '#A89F91',

    // Estados
    danger: '#E63946',
    accent: '#E76F51',
    success: '#34D399',

    // Neutros
    white: '#FFFFFF',
    black: '#000000',
    dark: '#2C2C2C',
    dark2: '#3E3E3E',
};

// Compatibilidad con el nombre anterior
colors.textMuted = colors.text70;
