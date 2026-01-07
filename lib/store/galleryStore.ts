import { create } from 'zustand';
import { CapturedPhoto } from '../modules/camera/useCameraLogic';

interface GalleryState {
  photos: CapturedPhoto[];
  addPhoto: (photo: CapturedPhoto) => void;
  removePhoto: (timestamp: number) => void;
  clearGallery: () => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  photos: [],

  addPhoto: (photo) =>
    set((state) => ({
      photos: [...state.photos, photo],
    })),

  removePhoto: (timestamp) =>
    set((state) => ({
      photos: state.photos.filter((photo) => photo.timestamp !== timestamp),
    })),

  clearGallery: () =>
    set(() => ({
      photos: [],
    })),
}));