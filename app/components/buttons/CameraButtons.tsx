import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CameraButton = ({ icon, onPress }: any) => (
  <TouchableOpacity style={styles.closeButton} onPress={onPress}>
    <Ionicons name={icon} size={28} color="#fff" />
  </TouchableOpacity>
);

export const GalleryButton = ({ onPress, count, colors }: any) => (
  <TouchableOpacity style={styles.sideButton} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconContainer}>
      <Ionicons name="images" size={28} color="#fff" />
      {count > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.purple, borderColor: colors.bg }]}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </View>
    <Text style={styles.label}>Galería</Text>
  </TouchableOpacity>
);

export const FlipButton = ({ onPress }: any) => (
  <TouchableOpacity style={styles.sideButton} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.iconContainer}>
      <Ionicons name="camera-reverse" size={28} color="#fff" />
    </View>
    <Text style={styles.label}>Voltear</Text>
  </TouchableOpacity>
);

export const CaptureButton = ({ onPress }: any) => (
  <TouchableOpacity style={styles.captureButton} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.captureOuter}>
      <View style={styles.captureInner} />
    </View>
  </TouchableOpacity>
);

export const PermissionButton = ({ onPress, colors }: any) => (
  <TouchableOpacity 
    style={[styles.permissionButton, { backgroundColor: colors.purple }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.buttonContent}>
      <Ionicons name="checkmark-circle" size={24} color="#fff" />
      <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
    </View>
  </TouchableOpacity>
);

export const RetakeButton = ({ onPress, colors }: any) => (
  <TouchableOpacity
    style={[styles.retakeButton, { backgroundColor: colors.current }]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons name="camera" size={24} color={colors.purple} />
    <Text style={[styles.retakeText, { color: colors.purple }]}>Tomar otra foto</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sideButton: { alignItems: 'center', gap: 8 },
  iconContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  badge: { position: 'absolute', top: -4, right: -4, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  label: { color: '#fff', fontSize: 12, fontWeight: '600' },
  captureButton: { alignItems: 'center' },
  captureOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
  captureInner: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#fff' },
  permissionButton: { width: '100%', borderRadius: 12, overflow: 'hidden' },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  permissionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  retakeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, paddingHorizontal: 24, borderRadius: 12, gap: 10 },
  retakeText: { fontSize: 16, fontWeight: 'bold' },
});