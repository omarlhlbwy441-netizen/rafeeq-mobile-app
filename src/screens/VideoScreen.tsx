import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function VideoScreen() {
  const { dispatch } = useApp();
  const [videos, setVideos] = useState([
    { id: '1', title: 'شرح نظام رفيق', duration: '5:30', status: 'ready' },
    { id: '2', title: 'تعليم الذكاء الاصطناعي', duration: '12:45', status: 'rendering' },
    { id: '3', title: 'مراجعة الكود', duration: '8:20', status: 'ready' }
  ]);

  const createVideo = () => {
    Alert.prompt('فيديو جديد', 'عنوان الفيديو:', (title) => {
      if (title) {
        setVideos([...videos, { id: Date.now().toString(), title, duration: '0:00', status: 'rendering' }]);
        dispatch({ type: 'ADD_LOG', payload: `Video project created: ${title}` });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Video Architect" rightIcon="videocam-outline" />
      <ScrollView>
        <TouchableOpacity style={styles.createBtn} onPress={createVideo}>
          <Ionicons name="film" size={24} color="#fff" />
          <Text style={styles.createText}>إنشاء فيديو جديد</Text>
        </TouchableOpacity>

        {videos.map(v => (
          <Card key={v.id}>
            <View style={styles.videoRow}>
              <View style={styles.thumb}>
                <Ionicons name="play-circle" size={32} color="#d946ef" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{v.title}</Text>
                <Text style={styles.meta}>{v.duration} • {v.status === 'ready' ? 'جاهز' : 'جاري المعالجة'}</Text>
              </View>
              <Ionicons name={v.status === 'ready' ? 'checkmark-circle' : 'time'} size={22} color={v.status === 'ready' ? '#10b981' : '#f59e0b'} />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#d946ef', margin: 16, padding: 16, borderRadius: 16
  },
  createText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  videoRow: { flexDirection: 'row', alignItems: 'center' },
  thumb: { width: 60, height: 60, borderRadius: 12, backgroundColor: '#d946ef20', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 }
});
