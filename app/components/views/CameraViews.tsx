import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { PhotoCard } from '../molecules/PhotoCard';
import { CapturedPhoto } from '@/lib/modules/camera/useCameraLogic';
import { CameraButton, GalleryButton, FlipButton, CaptureButton, PermissionButton, RetakeButton } from '../buttons/CameraButtons';

export const CameraLoadingView = ({ colors }: any) => (
  <View style={[styles.centerContainer, { backgroundColor: colors.bg }]}>
    <Ionicons name="camera-outline" size={80} color={colors.purple} />
    <Text style={[styles.loadingText, { color: colors.fg }]}>Inicializando cámara...</Text>
  </View>
);

export const CameraPermissionView = ({ colors, onRequest }: any) => (
  <View style={[styles.centerContainer, { backgroundColor: colors.bg }]}>
    <View style={[styles.permissionCard, { backgroundColor: colors.current }]}>
      <Ionicons name="camera-outline" size={100} color={colors.purple} />
      <Text style={[styles.permissionTitle, { color: colors.fg }]}>Acceso a Cámara</Text>
      <Text style={[styles.permissionText, { color: colors.comment }]}>
        Necesitamos acceso a tu cámara para capturar fotos.
      </Text>
      <PermissionButton onPress={onRequest} colors={colors} />
    </View>
  </View>
);

export const CameraPreviewView = ({ colors, photo, onSwipeRight, onSwipeLeft, onRetake }: any) => (
  <View style={[styles.container, { backgroundColor: colors.bg }]}>
    <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
    <View style={[styles.previewHeader, { backgroundColor: colors.current }]}>
      <View style={styles.instructionBadge}>
        <Ionicons name="arrow-back" size={20} color={colors.red} />
        <Text style={[styles.instructionText, { color: colors.comment }]}>Descartar</Text>
      </View>
      <Text style={[styles.previewTitle, { color: colors.fg }]}>Vista Previa</Text>
      <View style={styles.instructionBadge}>
        <Text style={[styles.instructionText, { color: colors.comment }]}>Guardar</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.green} />
      </View>
    </View>
    <View style={styles.photoContainer}>
      <PhotoCard photoUri={photo.uri} onSwipeRight={onSwipeRight} onSwipeLeft={onSwipeLeft} />
    </View>
    <View style={styles.previewActions}>
      <RetakeButton onPress={onRetake} colors={colors} />
    </View>
  </View>
);

export const CameraActiveView = ({ colors, cameraRef, facing, photosCount, onClose, onGallery, onCapture, onFlip }: any) => (
  <View style={[styles.container, { backgroundColor: colors.bg }]}>
    <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
    <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
      <View style={styles.topOverlay}>
        <CameraButton icon="close" onPress={onClose} />
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={16} color={colors.purple} />
          <Text style={styles.cameraMode}>{facing === 'back' ? 'Trasera' : 'Frontal'}</Text>
        </View>
      </View>
      <View style={styles.bottomOverlay}>
        <View style={styles.controls}>
          <GalleryButton onPress={onGallery} count={photosCount} colors={colors} />
          <CaptureButton onPress={onCapture} />
          <FlipButton onPress={onFlip} />
        </View>
      </View>
    </CameraView>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  camera: { flex: 1 },
  topOverlay: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cameraBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
  cameraMode: { color: '#fff', fontSize: 12, fontWeight: '600' },
  bottomOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 40, paddingTop: 60, backgroundColor: 'rgba(0,0,0,0.4)' },
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20 },
  permissionCard: { borderRadius: 24, padding: 32, alignItems: 'center', maxWidth: 400, width: '100%' },
  permissionTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 20, marginBottom: 12 },
  permissionText: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  loadingText: { fontSize: 18, marginTop: 20 },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  previewTitle: { fontSize: 18, fontWeight: 'bold' },
  instructionBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  instructionText: { fontSize: 12, fontWeight: '600' },
  photoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  previewActions: { padding: 20 },
});