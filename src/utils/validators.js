// Validaciones reutilizables para los formularios (Login y Registro).
// Cada función devuelve un string con el error o '' si el valor es válido.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateName = (name) => {
    if (!name.trim()) return 'El nombre es obligatorio';
    if (name.trim().length < 2) return 'El nombre es demasiado corto';
    return '';
};

export const validateEmail = (email) => {
    if (!email.trim()) return 'El correo electrónico es obligatorio';
    if (!EMAIL_REGEX.test(email.trim())) return 'Ingresa un correo válido (ej. nombre@dominio.com)';
    return '';
};

export const validatePassword = (password) => {
    if (!password.trim()) return 'La contraseña es obligatoria';
    if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword.trim()) return 'Confirma tu contraseña';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden';
    return '';
};

// Nombre visible a partir del correo: "ana.lopez@mail.com" -> "Ana.lopez"
export const nameFromEmail = (email) => {
    const base = email.trim().split('@')[0];
    return base.charAt(0).toUpperCase() + base.slice(1);
};
