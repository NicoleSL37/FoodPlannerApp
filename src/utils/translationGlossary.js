// Glosario culinario para mejorar la traducción automática (MyMemory no conoce el contexto de cocina).
// Hay tres ayudas:
//  1. `applyGlossary`: cambia frases problemáticas inglés → español ANTES de enviar el texto al traductor.
//  2. `protectTerms` / `restoreTerms`: oculta nombres propios (platos, utensilios) para que no se "traduzcan" mal.
//  3. `parseIngredient` / `translateMeasure`: separa "cantidad + unidad" del nombre y traduce la cantidad sin API.

// Frases que el traductor suele equivocar. Orden: de más larga a más corta (se aplican en ese orden).
const PHRASES = [
    ['lightly flour the surface', 'espolvorea ligeramente harina sobre la superficie'],
    ['lightly flour the', 'espolvorea ligeramente harina sobre el'],
    ['lightly flour', 'espolvorea ligeramente con harina'],
    ['flour the surface', 'espolvorea harina sobre la superficie'],
    ['flour your work surface', 'espolvorea harina sobre tu superficie de trabajo'],
    ['cookie sheets', 'bandejas para hornear'],
    ['cookie sheet', 'bandeja para hornear'],
    ['baking sheets', 'bandejas para hornear'],
    ['baking sheet', 'bandeja para hornear'],
    ['baking trays', 'bandejas para hornear'],
    ['baking tray', 'bandeja para hornear'],
    ['parchment paper', 'papel pergamino'],
    ['puff pastry', 'masa de hojaldre'],
    ['egg plants', 'berenjenas'],
    ['egg plant', 'berenjena'],
    ['eggplants', 'berenjenas'],
    ['eggplant', 'berenjena'],
    ['knob of butter', 'trozo de mantequilla'],
    ['dutch oven', 'olla de hierro fundido'],
    ['double cream', 'nata para montar'],
    ['single cream', 'nata líquida'],
    ['heavy cream', 'nata para montar'],
    ['self-raising flour', 'harina con levadura'],
    ['self raising flour', 'harina con levadura'],
    ['plain flour', 'harina común'],
    ['bicarbonate of soda', 'bicarbonato de sodio'],
    ['baking powder', 'polvo de hornear'],
    ['baking soda', 'bicarbonato de sodio'],
    ['icing sugar', 'azúcar glas'],
    ['caster sugar', 'azúcar extrafina'],
    ['granulated sugar', 'azúcar granulada'],
    ['brown sugar', 'azúcar morena'],
    ['spring onions', 'cebollines'],
    ['spring onion', 'cebollín'],
    ['stock cube', 'cubito de caldo'],
    ['chopped tomatoes', 'tomates picados'],
    ['minced beef', 'carne de res molida'],
    ['minced pork', 'carne de cerdo molida'],
    ['ground beef', 'carne de res molida'],
    ['minced lamb', 'carne de cordero molida'],
    ['bay leaves', 'hojas de laurel'],
    ['bay leaf', 'hoja de laurel'],
    ['sea salt', 'sal marina'],
    ['to serve', 'para servir'],
    ['to taste', 'al gusto'],
    ['saltfish', 'bacalao salado'],
    ['salt fish', 'bacalao salado'],
    ['aubergine', 'berenjena'],
    ['courgette', 'calabacín'],
    ['coriander', 'cilantro'],
    ['skillet', 'sartén'],
    ['broil', 'gratinar'],
    ['griddle', 'plancha'],
    ['whisk', 'batir'],
    ['simmer', 'cocinar a fuego lento'],
];

// Palabras que NO deben traducirse (nombres de platos o utensilios que el traductor convierte en otra cosa).
const KEEP_AS_IS = [
    'poffertjespan',
    'poffertjes',
    'poffertje',
    'callaloo',
    'ackee',
    'roti',
    'naan',
    'chapati',
    'paneer',
    'ghee',
    'tahini',
    'harissa',
    'sriracha',
    'gochujang',
    'mirin',
    'dashi',
    'panko',
    'tortilla',
    'tzatziki',
    'hummus',
    'ugali',
    'injera',
    'jollof',
    'kofta',
    'koshari',
    'tagine',
    'wok',
];

const escapeRegExp = (text) => text.replace(/[.*+?^${}()[\]\\]/g, '\\$&');

const PHRASE_RULES = PHRASES.map(([from, to]) => ({
    regex: new RegExp(`\\b${escapeRegExp(from)}\\b`, 'gi'),
    to,
}));

const KEEP_REGEX = new RegExp(`\\b(${KEEP_AS_IS.join('|')})\\b`, 'gi');

/** Cambia frases culinarias problemáticas por su equivalente en español antes de traducir. */
export function applyGlossary(text) {
    let result = text;
    for (const { regex, to } of PHRASE_RULES) result = result.replace(regex, to);
    return result;
}

// Marcador: letras sin significado, para que el traductor lo deje igual (p. ej. "Zqxa").
const marker = (index) => `Zqx${String.fromCharCode(97 + (index % 26))}${Math.floor(index / 26)}`;

/**
 * Reemplaza los términos protegidos por marcadores.
 * Devuelve { text, terms }; `terms` es la lista de [marcador, original] para restaurar después.
 */
export function protectTerms(text) {
    const terms = [];
    const protectedText = text.replace(KEEP_REGEX, (match) => {
        let entry = terms.find(([, original]) => original.toLowerCase() === match.toLowerCase());
        if (!entry) {
            entry = [marker(terms.length), match];
            terms.push(entry);
        }
        return entry[0];
    });
    return { text: protectedText, terms };
}

/** Devuelve los términos originales. Si el traductor se "comió" algún marcador, devuelve null (hay que reintentar sin protección). */
export function restoreTerms(text, terms) {
    let result = text;
    for (const [mark, original] of terms) {
        const regex = new RegExp(escapeRegExp(mark), 'gi');
        if (!regex.test(result)) return null;
        result = result.replace(regex, original);
    }
    return result;
}

// ---------- Cantidades de ingredientes ----------

// Unidad (en inglés, como la entrega TheMealDB) → español. null = se deja igual (g, kg, ml, oz...).
const UNITS = {
    tsp: 'cucharadita',
    tsps: 'cucharaditas',
    teaspoon: 'cucharadita',
    teaspoons: 'cucharaditas',
    tbsp: 'cucharada',
    tbs: 'cucharada',
    tbls: 'cucharada',
    tblsp: 'cucharada',
    tbsps: 'cucharadas',
    tablespoon: 'cucharada',
    tablespoons: 'cucharadas',
    cup: 'taza',
    cups: 'tazas',
    pinch: 'pizca',
    pinches: 'pizcas',
    knob: 'trozo',
    knobs: 'trozos',
    handful: 'puñado',
    handfuls: 'puñados',
    dash: 'chorrito',
    splash: 'chorrito',
    sprig: 'ramita',
    sprigs: 'ramitas',
    clove: 'diente',
    cloves: 'dientes',
    slice: 'rebanada',
    slices: 'rebanadas',
    pint: 'pinta',
    pints: 'pintas',
    can: 'lata',
    cans: 'latas',
    tin: 'lata',
    tins: 'latas',
    bunch: 'manojo',
    bunches: 'manojos',
    lb: 'lb',
    lbs: 'lb',
    pound: 'libra',
    pounds: 'libras',
    oz: 'oz',
    ounce: 'onza',
    ounces: 'onzas',
    g: 'g',
    kg: 'kg',
    ml: 'ml',
    l: 'l',
    cl: 'cl',
    dl: 'dl',
};

// Unidades que llevan "de" antes del nombre: "2 cucharadas de sal", "1 taza de leche"
const NEEDS_DE = new Set([
    'cucharadita', 'cucharaditas', 'cucharada', 'cucharadas', 'taza', 'tazas', 'pizca', 'pizcas', 'trozo', 'trozos',
    'puñado', 'puñados', 'chorrito', 'ramita', 'ramitas', 'diente', 'dientes', 'rebanada', 'rebanadas', 'pinta',
    'pintas', 'lata', 'latas', 'manojo', 'manojos', 'libra', 'libras', 'onza', 'onzas', 'lb', 'oz', 'g', 'kg', 'ml',
    'l', 'cl', 'dl',
]);

// Cantidad: números, fracciones y rangos ("1/2", "1-2", "1½", "2 1/2", "1.5")
const QUANTITY = String.raw`(?:\d+[\d\s/.,\-–]*|[½¼¾⅓⅔])`;
const PARSE_REGEX = new RegExp(`^\\s*(${QUANTITY})\\s*([A-Za-z]+)?\\.?\\s+(.+)$`);
const GLUED_REGEX = new RegExp(`^\\s*(\\d+(?:[.,]\\d+)?)\\s*(g|kg|ml|l|cl|dl|oz|lb|lbs)\\b\\s*(.+)$`, 'i');

/**
 * Separa un ingrediente "125g Flour" / "1 knob Butter" / "2 Eggs" en { quantity, unit, name }.
 * Devuelve null si no tiene cantidad al inicio (p. ej. "To serve Butter", "Salt").
 */
export function parseIngredient(text) {
    const glued = text.match(GLUED_REGEX);
    if (glued) {
        const unit = UNITS[glued[2].toLowerCase()] || glued[2];
        return { quantity: glued[1], unit, name: glued[3].trim() };
    }
    const match = text.match(PARSE_REGEX);
    if (!match) return null;
    const [, quantity, word, rest] = match;
    const unit = word ? UNITS[word.toLowerCase()] : undefined;
    if (unit) return { quantity: quantity.trim(), unit, name: rest.trim() };
    // La "palabra" no es una unidad: es parte del nombre ("2 Eggs", "3 Tomatoes")
    return { quantity: quantity.trim(), unit: '', name: `${word ? `${word} ` : ''}${rest}`.trim() };
}

// Ingredientes completos que la API traduce mal: nombre en inglés (minúscula) → [unidad, nombre en español].
// Se resuelven sin llamar al traductor.
const INGREDIENT_OVERRIDES = {
    'egg plants': [null, 'berenjenas'],
    'egg plant': [null, 'berenjena'],
    'eggplants': [null, 'berenjenas'],
    'eggplant': [null, 'berenjena'],
    'puff pastry': ['lámina', 'hojaldre'],
    'puff pastry sheets': ['lámina', 'hojaldre'],
};

/** Si el nombre tiene traducción fija devuelve { unit, name } (la unidad solo si el ingrediente no trae una). */
export function ingredientOverride(name) {
    const hit = INGREDIENT_OVERRIDES[name.trim().toLowerCase()];
    return hit ? { unit: hit[0], name: hit[1] } : null;
}

/** Pasa a minúscula la primera letra del nombre ("Cebolla en Dados" → "cebolla en dados"). */
export function lowerFirst(text) {
    return text ? text.charAt(0).toLowerCase() + text.slice(1) : text;
}

/** Normaliza las mayúsculas de un nombre traducido: todo en minúscula salvo siglas (p. ej. "UHT"). */
export function normalizeName(text) {
    return text
        .split(' ')
        .map((word) => (word === word.toUpperCase() && word.length > 1 ? word : word.toLowerCase()))
        .join(' ')
        .trim();
}

/** Arma "125 g de harina", "1 trozo de mantequilla", "2 huevos" a partir de las partes ya traducidas. */
export function buildIngredient({ quantity, unit }, translatedName, fallbackUnit) {
    const name = normalizeName(translatedName);
    if (!unit && fallbackUnit) {
        const plural = Number.parseFloat(quantity) > 1 ? 's' : '';
        return `${quantity} ${fallbackUnit}${plural} de ${name}`;
    }
    if (!unit) return `${quantity} ${name}`;
    const joiner = NEEDS_DE.has(unit) && !/^(de|del)\b/i.test(name) ? ' de ' : ' ';
    return `${quantity} ${unit}${joiner}${name}`;
}
