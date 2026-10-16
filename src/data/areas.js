// Traduce el "origen" (strArea) que entrega TheMealDB al español.
// La API mezcla gentilicios ("Italian") y nombres de país ("United States").
// Si un origen no está en la tabla, se muestra tal cual llega (nunca se pierde).
const AREAS_ES = {
    // Gentilicios (formato clásico de TheMealDB)
    american: 'Estados Unidos', british: 'Reino Unido', canadian: 'Canadá', chinese: 'China',
    croatian: 'Croacia', dutch: 'Países Bajos', egyptian: 'Egipto', filipino: 'Filipinas',
    french: 'Francia', greek: 'Grecia', indian: 'India', irish: 'Irlanda', italian: 'Italia',
    jamaican: 'Jamaica', japanese: 'Japón', kenyan: 'Kenia', malaysian: 'Malasia', mexican: 'México',
    moroccan: 'Marruecos', norwegian: 'Noruega', polish: 'Polonia', portuguese: 'Portugal',
    russian: 'Rusia', slovakian: 'Eslovaquia', spanish: 'España', syrian: 'Siria', thai: 'Tailandia',
    tunisian: 'Túnez', turkish: 'Turquía', ukrainian: 'Ucrania', uruguayan: 'Uruguay',
    vietnamese: 'Vietnam', venezulan: 'Venezuela', venezuelan: 'Venezuela', algerian: 'Argelia',
    argentinian: 'Argentina', argentine: 'Argentina', australian: 'Australia', austrian: 'Austria',
    belgian: 'Bélgica', brazilian: 'Brasil', peruvian: 'Perú', colombian: 'Colombia', chilean: 'Chile',
    cuban: 'Cuba', german: 'Alemania', swiss: 'Suiza', swedish: 'Suecia', danish: 'Dinamarca',
    finnish: 'Finlandia', hungarian: 'Hungría', czech: 'Chequia', romanian: 'Rumanía',
    bulgarian: 'Bulgaria', serbian: 'Serbia', bosnian: 'Bosnia', lebanese: 'Líbano', israeli: 'Israel',
    iraqi: 'Irak', iranian: 'Irán', jordanian: 'Jordania', saudi: 'Arabia Saudita', yemeni: 'Yemen',
    ethiopian: 'Etiopía', nigerian: 'Nigeria', ghanaian: 'Ghana', senegalese: 'Senegal',
    'south african': 'Sudáfrica', somali: 'Somalia', ugandan: 'Uganda', tanzanian: 'Tanzania',
    indonesian: 'Indonesia', korean: 'Corea', pakistani: 'Pakistán', bangladeshi: 'Bangladés',
    'sri lankan': 'Sri Lanka', nepalese: 'Nepal', afghan: 'Afganistán', singaporean: 'Singapur',
    taiwanese: 'Taiwán', cambodian: 'Camboya', laotian: 'Laos', burmese: 'Birmania',
    mongolian: 'Mongolia', hawaiian: 'Hawái', dominican: 'República Dominicana', haitian: 'Haití',
    'puerto rican': 'Puerto Rico', antiguan: 'Antigua y Barbuda', bahamian: 'Bahamas',
    barbadian: 'Barbados', belizean: 'Belice', guatemalan: 'Guatemala', honduran: 'Honduras',
    salvadoran: 'El Salvador', nicaraguan: 'Nicaragua', 'costa rican': 'Costa Rica',
    panamanian: 'Panamá', ecuadorian: 'Ecuador', bolivian: 'Bolivia', paraguayan: 'Paraguay',
    icelandic: 'Islandia', estonian: 'Estonia', latvian: 'Letonia', lithuanian: 'Lituania',
    georgian: 'Georgia', armenian: 'Armenia', maltese: 'Malta', cypriot: 'Chipre',
    albanian: 'Albania', slovenian: 'Eslovenia', 'new zealand': 'Nueva Zelanda',

    // Nombres de país (formato nuevo de TheMealDB)
    'united states': 'Estados Unidos', 'united kingdom': 'Reino Unido', canada: 'Canadá',
    china: 'China', croatia: 'Croacia', netherlands: 'Países Bajos', egypt: 'Egipto',
    philippines: 'Filipinas', france: 'Francia', greece: 'Grecia', india: 'India', ireland: 'Irlanda',
    italy: 'Italia', jamaica: 'Jamaica', japan: 'Japón', kenya: 'Kenia', malaysia: 'Malasia',
    mexico: 'México', morocco: 'Marruecos', norway: 'Noruega', poland: 'Polonia', portugal: 'Portugal',
    russia: 'Rusia', slovakia: 'Eslovaquia', spain: 'España', syria: 'Siria', thailand: 'Tailandia',
    tunisia: 'Túnez', turkey: 'Turquía', ukraine: 'Ucrania', uruguay: 'Uruguay', vietnam: 'Vietnam',
    venezuela: 'Venezuela', algeria: 'Argelia', argentina: 'Argentina', australia: 'Australia',
    austria: 'Austria', belgium: 'Bélgica', brazil: 'Brasil', peru: 'Perú', colombia: 'Colombia',
    chile: 'Chile', cuba: 'Cuba', germany: 'Alemania', switzerland: 'Suiza', sweden: 'Suecia',
    denmark: 'Dinamarca', finland: 'Finlandia', hungary: 'Hungría', 'czech republic': 'Chequia',
    czechia: 'Chequia', romania: 'Rumanía', bulgaria: 'Bulgaria', serbia: 'Serbia',
    'bosnia and herzegovina': 'Bosnia y Herzegovina', lebanon: 'Líbano', israel: 'Israel', iraq: 'Irak',
    iran: 'Irán', jordan: 'Jordania', 'saudi arabia': 'Arabia Saudita', yemen: 'Yemen',
    ethiopia: 'Etiopía', nigeria: 'Nigeria', ghana: 'Ghana', senegal: 'Senegal',
    'south africa': 'Sudáfrica', somalia: 'Somalia', uganda: 'Uganda', tanzania: 'Tanzania',
    indonesia: 'Indonesia', 'south korea': 'Corea del Sur', korea: 'Corea', pakistan: 'Pakistán',
    bangladesh: 'Bangladés', 'sri lanka': 'Sri Lanka', nepal: 'Nepal', afghanistan: 'Afganistán',
    singapore: 'Singapur', taiwan: 'Taiwán', cambodia: 'Camboya', laos: 'Laos', myanmar: 'Birmania',
    mongolia: 'Mongolia', 'dominican republic': 'República Dominicana', haiti: 'Haití',
    'puerto rico': 'Puerto Rico', 'antigua and barbuda': 'Antigua y Barbuda', bahamas: 'Bahamas',
    barbados: 'Barbados', belize: 'Belice', guatemala: 'Guatemala', honduras: 'Honduras',
    'el salvador': 'El Salvador', nicaragua: 'Nicaragua', 'costa rica': 'Costa Rica', panama: 'Panamá',
    ecuador: 'Ecuador', bolivia: 'Bolivia', paraguay: 'Paraguay', iceland: 'Islandia',
    estonia: 'Estonia', latvia: 'Letonia', lithuania: 'Lituania', armenia: 'Armenia', malta: 'Malta',
    cyprus: 'Chipre', albania: 'Albania', slovenia: 'Eslovenia', hawaii: 'Hawái',
};

/** "United States" -> "Estados Unidos". Sin origen conocido ("Unknown" o vacío) devuelve ''. */
export function areaLabel(area) {
    const raw = String(area || '').trim();
    if (!raw || raw.toLowerCase() === 'unknown') return '';
    return AREAS_ES[raw.toLowerCase()] || raw;
}
