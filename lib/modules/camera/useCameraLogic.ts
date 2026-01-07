import { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

/**
 * 📸 Interfaz para foto capturada
 * 
 * Incluye timestamp para usarlo como ID único en la galería
 */
export interface CapturedPhoto {
  uri: string;        // URI local de la foto (file://)
  width: number;      // Ancho de la foto en pixels
  height: number;     // Alto de la foto en pixels
  timestamp: number;  // Timestamp único (Date.now())
}

/**
 * 📷 Hook personalizado para gestionar la lógica de la cámara
 * 
 * Responsabilidades:
 * - Gestión de permisos del dispositivo
 * - Control de cámara frontal/trasera
 * - Captura de fotos con calidad máxima
 * - Estado de la foto capturada
 * 
 * Separa la lógica del hardware de la UI para:
 * - ✅ Reutilización en múltiples componentes
 * - ✅ Testing sin necesidad de renderizar UI
 * - ✅ Mantenibilidad (cambios no afectan UI)
 * 
 * @returns Objeto con estado y funciones de control de cámara
 */
export const useCameraLogic = () => {
  // 📊 Estados locales
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturedPhoto, setCapturedPhoto] = useState<CapturedPhoto | null>(null);
  
  // 🔐 Hook de permisos de Expo Camera
  const [permission, requestPermission] = useCameraPermissions();
  
  // 📹 Referencia al componente CameraView
  const cameraRef = useRef<CameraView>(null);

  /**
   * 🔄 Alternar entre cámara frontal y trasera
   * 
   * Toggle simple: back ↔ front
   */
  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  /**
   * 📸 Capturar foto con configuración óptima
   * 
   * Configuración:
   * - quality: 1 (máxima calidad)
   * - base64: false (ahorra memoria, solo URI)
   * - skipProcessing: false (procesa orientación correcta)
   * 
   * @returns Promise con CapturedPhoto o null si falla
   */
  const takePicture = async (): Promise<CapturedPhoto | null> => {
    // Validar que el ref esté disponible
    if (!cameraRef.current) {
      return null;
    }

    try {
      // 📷 Capturar foto usando el ref
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,              // Calidad máxima (0-1)
        base64: false,           // No necesitamos base64 (ahorra memoria)
        skipProcessing: false,   // Procesa orientación automáticamente
      });

      if (photo) {
        // 🎯 Crear objeto CapturedPhoto con timestamp
        const capturedData: CapturedPhoto = {
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
          timestamp: Date.now(), // ID único basado en tiempo
        };

        // 💾 Guardar en estado local
        setCapturedPhoto(capturedData);
        
        return capturedData;
      }

      return null;
    } catch (error) {
      return null;
    }
  };

  /**
   * 🗑️ Limpiar foto capturada
   * 
   * Útil para:
   * - Volver a tomar otra foto
   * - Descartar foto sin guardar (swipe left)
   */
  const clearCapturedPhoto = () => {
    setCapturedPhoto(null);
  };

  /**
   * 🔐 Estado de permisos calculado
   * 
   * permission puede ser null mientras carga,
   * así que validamos antes de acceder a .granted
   */
  const hasPermission = permission?.granted ?? false;
  const isLoading = !permission; // null = todavía cargando

  // 📤 API del hook
  return {
    // 📊 Estado (read-only para componentes)
    facing,                  // 'front' | 'back'
    capturedPhoto,           // CapturedPhoto | null
    hasPermission,           // boolean - true si tiene permiso
    isLoading,               // boolean - true mientras carga permisos
    cameraRef,               // Ref<CameraView> - para pasar a <CameraView>

    // 🎮 Acciones (funciones de control)
    toggleCameraFacing,      // () => void
    takePicture,             // () => Promise<CapturedPhoto | null>
    clearCapturedPhoto,      // () => void
    requestPermission,       // () => Promise<PermissionResponse>
  };
};