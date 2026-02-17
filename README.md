KEEP TIME IT (K.T.I.)
====================

Creador:
Jorge Andrés Medina Urrutia

Descripción
-----------
Keep Time It (K.T.I.) es una aplicación móvil desarrollada con Expo (React Native) y Firebase,
diseñada para registrar y analizar el tiempo de uso de dispositivos del hogar (electrodomésticos,
equipos electrónicos y puntos de consumo de agua/energía) por habitaciones.

La aplicación permite:
- Crear o unirse a un hogar.
- Definir habitaciones.
- Registrar dispositivos por habitación (nevera, televisor, lavadora, etc.).
- Iniciar y detener sesiones de uso de cada dispositivo.
- Generar reportes de uso por día, semana o mes.
- Visualizar estadísticas básicas de consumo por dispositivo y por habitación.

Tecnologías
-----------
- Expo SDK 54
- React Native
- TypeScript
- Firebase (Authentication + Firestore)
- EAS Build (para generar APK de Android)

Estructura del proyecto
-----------------------
- src/
  - screens/        -> Pantallas de la aplicación
  - navigation/     -> Navegación (Stacks y Drawer)
  - config/         -> Configuración de Firebase
  - state/          -> Estado global de la app
- assets/           -> Iconos e imágenes
- app.json          -> Configuración de Expo
- eas.json          -> Configuración de builds con EAS

Notas
-----
- Este proyecto no requiere publicación en Play Store para su uso.
- El APK generado puede instalarse directamente en dispositivos Android.
- Las credenciales sensibles no deben subirse al repositorio (.env está en .gitignore).

