import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGalleryStore } from '../lib/store/galleryStore';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const ITEM_SIZE = (width - 40) / 3;

const colors = {
  bg: '#282a36',
  current: '#44475a',
  fg: '#f8f8f2',
  comment: '#6272a4',
  purple: '#bd93f9',
  red: '#ff5555',
};

export default function GalleryScreen() {
  const router = useRouter();
  const photos = useGalleryStore((state) => state.photos);
  const removePhoto = useGalleryStore((state) => state.removePhoto);
  const clearGallery = useGalleryStore((state) => state.clearGallery);
  
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);

  const openPhoto = (uri: string, timestamp: number) => {
    setSelectedPhoto(uri);
    setSelectedTimestamp(timestamp);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setSelectedTimestamp(null);
  };

  const deleteCurrentPhoto = () => {
    if (selectedTimestamp) {
      removePhoto(selectedTimestamp);
      closePhoto();
    }
  };

  if (photos.length === 0) {
    return (
      <SafeAreaView style={[styles.emptyContainer, { backgroundColor: colors.bg }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        <Ionicons name="images-outline" size={100} color={colors.comment} />
        <Text style={[styles.emptyText, { color: colors.fg }]}>No hay fotos guardadas</Text>
        <Text style={[styles.emptySubtext, { color: colors.comment }]}>
          Desliza a la derecha para guardar fotos
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.purple }]}
          onPress={() => router.push('/camera')}
        >
          <Ionicons name="camera" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Ir a Cámara</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <View style={[styles.header, { backgroundColor: colors.current }]}>
        <Text style={[styles.title, { color: colors.fg }]}>Galería</Text>
        <View style={styles.headerActions}>
          <Text style={[styles.counter, { color: colors.purple }]}>{photos.length} fotos</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearGallery}>
            <Ionicons name="trash-outline" size={20} color={colors.red} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.timestamp.toString()}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.photoItem}
            onPress={() => openPhoto(item.uri, item.timestamp)}
          >
            <Image source={{ uri: item.uri }} style={styles.photo} />
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={selectedPhoto !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closePhoto}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.95)" />
          
          <TouchableOpacity style={styles.modalCloseButton} onPress={closePhoto}>
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.modalDeleteButton} onPress={deleteCurrentPhoto}>
            <Ionicons name="trash" size={28} color={colors.red} />
          </TouchableOpacity>

          {selectedPhoto && (
            <Image source={{ uri: selectedPhoto }} style={styles.fullImage} resizeMode="contain" />
          )}
        </View>
      </Modal>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.purple }]}
        onPress={() => router.push('/camera')}
      >
        <Ionicons name="camera" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    padding: 8,
  },
  grid: {
    padding: 10,
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.current,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalDeleteButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  fullImage: {
    width: width,
    height: height,
  },
});