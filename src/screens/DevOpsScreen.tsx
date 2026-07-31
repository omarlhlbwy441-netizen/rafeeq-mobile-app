import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function DevOpsScreen() {
  const { dispatch } = useApp();
  const [services] = useState([
    { name: 'Docker', icon: 'logo-docker', color: '#2496ED', status: 'running', containers: 5 },
    { name: 'Kubernetes', icon: 'cube', color: '#326CE5', status: 'running', pods: 12 },
    { name: 'Helm', icon: 'boat', color: '#0F1689', status: 'ready', charts: 3 },
    { name: 'Terraform', icon: 'earth', color: '#7B42BC', status: 'ready', resources: 24 },
    { name: 'Nginx', icon: 'shield', color: '#009639', status: 'running', connections: 156 },
    { name: 'CI/CD', icon: 'git-branch', color: '#FC6D26', status: 'running', pipelines: 8 }
  ]);

  const runAction = (name: string) => {
    dispatch({ type: 'ADD_LOG', payload: `DevOps: ${name} action triggered` });
    Alert.alert('DevOps', `تم تشغيل ${name}`);
  };

  return (
    <View style={styles.container}>
      <Header title="DevOps" />
      <ScrollView>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>حاويات</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Pods</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Pipelines</Text>
          </View>
        </View>

        {services.map(s => (
          <Card key={s.name}>
            <View style={styles.serviceRow}>
              <View style={[styles.iconBox, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.serviceMeta}>
                  {s.containers ? `${s.containers} حاويات` : s.pods ? `${s.pods} pods` : s.charts ? `${s.charts} charts` : s.resources ? `${s.resources} موارد` : s.connections ? `${s.connections} اتصال` : `${s.pipelines} pipelines`}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: s.status === 'running' ? '#10b98120' : '#0ea5e920' }]}>
                <Text style={[styles.statusText, { color: s.status === 'running' ? '#10b981' : '#0ea5e9' }]}>
                  {s.status === 'running' ? 'يعمل' : 'جاهز'}
                </Text>
              </View>
              <TouchableOpacity style={styles.actionBtn} onPress={() => runAction(s.name)}>
                <Ionicons name="play" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  serviceRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  serviceName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  serviceMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginRight: 8 },
  statusText: { fontSize: 11, fontWeight: '600' },
  actionBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }
});
