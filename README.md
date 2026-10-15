# FoodPlanner App 🥗🥘

Aplicación móvil (React Native + Expo) para **buscar recetas, guardar favoritas y organizar un plan semanal de comidas**, respetando la dieta y las alergias de cada usuario.

Proyecto del curso *Desarrollo de Aplicaciones Móviles* (proyecto 5 de la guía: FoodPlanner).

## 🎯 Objetivo del avance

| Avance | Estado | Alcance |
| ------ | ------ | ------- |
| **APF1** (semana 5) | ✅ Entregado y mejorado | Estructura, interfaz, props, estado, formulario validado y navegación |
| **APF2** (semana 10) | 🚧 En desarrollo | Hooks, consumo de API, estados loading/error/vacío y AsyncStorage |
| APF3 (semana 15) | ⏳ Pendiente | Cámara, permisos y notificaciones locales |

## ✨ Funcionalidades actuales

- **Registro e inicio de sesión** con validación y mensajes de error visibles bajo cada campo.
- **Onboarding** (dieta → alergias). Desde el Perfil se pueden editar las mismas preferencias.
- **Inicio:** búsqueda por texto/ingrediente, filtro por categoría y filtro automático según la dieta y alergias del usuario. Muestra un estado vacío si no hay resultados.
- **Favoritos:** el corazón funciona en Inicio, Detalle y Favoritos; la lista se actualiza al instante.
- **Detalle de receta:** ingredientes, pasos y datos nutricionales de la receta seleccionada.
- **Plan semanal:** calendario de días y comidas; las calorías del día se calculan con lo asignado.
- **Registro de preparación:** pantalla de cámara (simulada hasta el APF3) asociada a la receta que se cocina.
- **Perfil y ajustes:** cierre de sesión que limpia el estado del usuario.

## 🧱 Arquitectura

```
App.js                    # Punto de entrada: UserProvider + navegación
src/
├── components/           # Componentes reutilizables (ver tabla)
├── context/              # Estado global del usuario (UserContext)
├── data/                 # Recetas locales (se reemplazará por la API en el APF2)
├── navigation/           # Stack + Tabs (AppNavigator)
├── screens/              # Pantallas de la app
├── theme/                # Paleta de colores única (colors.js)
└── utils/                # Validaciones y filtros de recetas
```

### Componentes reutilizables

| Componente | Para qué sirve | Props principales |
| ---------- | -------------- | ----------------- |
| `Screen` | Contenedor base de cada pantalla (fondo, StatusBar, ancho máximo, `flex: 1`) | `style` |
| `ScreenHeader` | Cabecera con botón "volver", título y subtítulo | `title`, `subtitle`, `onBack`, `right` |
| `PrimaryButton` | Botón principal verde | `title`, `onPress`, `icon`, `size` (`md`/`lg`), `disabled` |
| `Chip` | Opción seleccionable (dietas, alergias, categorías, filtros) | `label`, `selected`, `onPress`, `size` (`lg`/`md`/`sm`) |
| `FormInput` | Campo con etiqueta, ícono, error y mostrar/ocultar contraseña | `label`, `icon`, `error`, `secureTextEntry` + props de `TextInput` |
| `BrandLogo` | Logo y nombre de la app | `subtitle`, `compact` |
| `EmptyState` | Mensaje para listas vacías o sin resultados | `icon`, `title`, `message` |
| `OnboardingStep` | Plantilla de cada paso del onboarding (puntos, título, botón) | `step`, `showDots`, `title`, `buttonLabel`, `onNext`, `feedback` |
| `RecipeImage` | Foto de receta con spinner de carga y ícono de respaldo si no hay imagen o falla | `uri`, `icon` |
| `RecipeCard` | Tarjeta de receta con favorito | `title`, `time`, `calories`, `tag`, `isFavorite`, `onToggleFavorite`, `onViewRecipe` |

Todos se importan desde un solo lugar: `import { Screen, Chip } from '../components';`

**Flujo de navegación:** `Login ⇄ Register → DietaryPreferences → Allergies → MainTabs (Inicio · Plan · Favoritos · Perfil)` y desde las pestañas: `RecipeDetail`, `PreparationRecord`, `History`, `Settings`.

**Estado global (`UserContext`):** nombre, correo, dieta, alergias y favoritos, más `toggleFavorite` y `resetUser`.

**Estilos:** ningún color se escribe a mano en las pantallas; todos salen de `src/theme/colors.js`.

## 🛠️ Tecnologías

- React Native 0.86 · React 19 · Expo 57
- React Navigation (Native Stack + Bottom Tabs)
- React Context API + hooks (`useState`, `useContext`, `useMemo`, `useCallback`, `useEffect`, `useRef`)
- `@expo/vector-icons`

## ▶️ Instalación y ejecución

```bash
git clone https://github.com/NicoleSL37/FoodPlannerApp.git
cd FoodPlannerApp
npm install
npx expo start
```

Escanea el QR con **Expo Go** (Android/iOS) o presiona `a` para abrir el emulador de Android.

## 🧪 Cómo probar el flujo principal

1. Crea una cuenta (prueba enviar el formulario vacío para ver las validaciones).
2. Elige una dieta (por ejemplo *Vegano*) y una alergia (por ejemplo *Sin Gluten*).
3. En **Inicio**, verifica que solo aparecen recetas compatibles; prueba la búsqueda y las categorías.
4. Marca recetas con el corazón y revisa la pestaña **Favoritos**.
5. Abre una receta, usa **¡Ya lo cociné!** y revisa el registro de preparación.
6. En **Perfil**, cambia tus preferencias y cierra sesión.

## 📸 Evidencias

> Agrega aquí las capturas en `docs/capturas/` y enlázalas, por ejemplo:
> `![Inicio](docs/capturas/inicio.png)`

## 🚧 Roadmap

**APF2**
- [ ] Servicio de API de recetas (`src/services`) con `fetch`
- [ ] Estados de carga, error (con reintento) y vacío en Inicio y Detalle
- [ ] Persistencia con AsyncStorage (`src/storage`): sesión, preferencias, favoritos, plan semanal e historial
- [ ] Plan semanal editable (asignar recetas a cada comida)

**APF3**
- [ ] Cámara real para registrar el platillo, con manejo de permisos
- [ ] Notificaciones locales de comidas planificadas
- [ ] Manejo de errores y logging básico

## 📄 Licencia

MIT
