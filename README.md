# FoodPlanner App 🥗🥘

Una aplicación móvil diseñada para ayudar a los usuarios a organizar sus comidas semanales, respetar sus preferencias dietéticas y llevar un registro de los platillos que cocinan.

## 🚀 Características (Frontend MVP)

- **Onboarding y Perfil Dinámico:** Registro de preferencias dietéticas (Keto, Vegano, etc.) y alergias, manejado globalmente mediante React Context.
- **Planificador Semanal Dinámico:** Un calendario interactivo que permite visualizar y asignar desayunos, almuerzos, cenas y snacks para los próximos 15 días.
- **Detalle de Recetas:** Pantallas descriptivas con ingredientes, paso a paso y valores nutricionales (calorías, tiempos de preparación).
- **Registro Fotográfico:** Interfaz para registrar los platillos preparados simulando el uso de la cámara del dispositivo.
- **Navegación Fluida:** Uso de React Navigation (Tabs y Stack) con un flujo de usuario intuitivo y sin bucles.

## 🛠️ Tecnologías Utilizadas

- **React Native** (Framework principal)
- **Expo** (Entorno de desarrollo)
- **React Navigation** (Enrutamiento)
- **React Context API** (Manejo de estado global)
- **Expo Vector Icons** (Iconografía)

## 📦 Instalación y Uso

Sigue estos pasos para correr el proyecto de manera local:

1. Clona este repositorio:
   git clone https://github.com/NicoleSL37/FoodPlannerApp.git

2. Instala las dependencias:
   npm install

3. Levanta el entorno de Expo:
   npx expo start

4. Escanea el código QR con la app **Expo Go** (Android/iOS) o presiona "a" para abrir en el emulador de Android.

## 🚧 Próximos Pasos (Roadmap)

- [ ] Integración de base de datos en la nube (Supabase).
- [ ] Autenticación de usuarios (Login/Registro).
- [ ] Consumo de API real para la carga dinámica de recetas.
