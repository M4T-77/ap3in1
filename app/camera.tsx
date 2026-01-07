import React from 'react';
import { useCameraLogic } from '../lib/modules/camera/useCameraLogic';
import { useGalleryStore } from '../lib/store/galleryStore';
import { useRouter } from 'expo-router';
import { CameraLoadingView, CameraPermissionView, CameraPreviewView, CameraActiveView } from '../app/components/views/CameraViews';

const colors = {
  bg: '#282a36',
  current: '#44475a',
  fg: '#f8f8f2',
  comment: '#6272a4',
  purple: '#bd93f9',
  pink: '#ff79c6',
  green: '#50fa7b',
  red: '#ff5555',
};

export default function CameraScreen() {
  const router = useRouter();
  const addPhoto = useGalleryStore((state) => state.addPhoto);
  const photosCount = useGalleryStore((state) => state.photos.length);

  const {
    facing,
    capturedPhoto,
    hasPermission,
    isLoading,
    cameraRef,
    toggleCameraFacing,
    takePicture,
    clearCapturedPhoto,
    requestPermission,
  } = useCameraLogic();

  const handleSwipeRight = () => {
    if (capturedPhoto) {
      addPhoto(capturedPhoto);
      clearCapturedPhoto();
    }
  };

  const handleSwipeLeft = () => {
    clearCapturedPhoto();
  };

  if (isLoading) {
    return <CameraLoadingView colors={colors} />;
  }

  if (!hasPermission) {
    return <CameraPermissionView colors={colors} onRequest={requestPermission} />;
  }

  if (capturedPhoto) {
    return (
      <CameraPreviewView
        colors={colors}
        photo={capturedPhoto}
        onSwipeRight={handleSwipeRight}
        onSwipeLeft={handleSwipeLeft}
        onRetake={clearCapturedPhoto}
      />
    );
  }

  return (
    <CameraActiveView
      colors={colors}
      cameraRef={cameraRef}
      facing={facing}
      photosCount={photosCount}
      onClose={() => router.back()}
      onGallery={() => router.push('/gallery')}
      onCapture={takePicture}
      onFlip={toggleCameraFacing}
    />
  );
}