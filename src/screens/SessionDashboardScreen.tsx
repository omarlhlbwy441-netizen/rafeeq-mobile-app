import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { COLORS } from '@utils/constants';

export default function SessionDashboardScreen() {
  const [sessions, setSessions] = useState([
    { id: '1', name: 'جلسة التطوير', status: 'active', cpu: 45, memory: 62, tasks: 12 },
    { id: '2', name: 'جلسة الألعاب', status: 'idle', cpu: 12, memory: 28, tasks: 3 },
    { id: '3', name: 'جلسة الفيديو', status: 'running', cpu: 78, memory: 85, tasks: 8 },
    { id: '4', name: 'جلسة المواقع', status: 'idle', cpu: 8, memory: 15, tasks: 1 }
  ]);
  const [newSession, setNewSession] = useState('');

  const addSession = () => {
    if (newSession.trim()) {
      setSessions([...sessions, {
        id: Date.now().toString(),
        name: newSession,
        status: 'active',
        cpu: 0, memory: 0, tasks: 0
      }]);
      setNewSession('');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="لوحة الجلسات" />
      <ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="اسم جلسة جديدة..."
            placeholderTextColor={COLORS.textDark}
            value={newSession}
            onChangeText={setNewSession}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addSession}>
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {sessions.map(session => (
          <Card key={session.id}>
            <View style={styles.sessionHeader}>
              <View style={styles.sessionTitle}>
                <Ionicons name="layers-outline" size={20} color={COLORS.primary} />
                <Text style={styles.name}>{session.name}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: session.status === 'active' ? '#10b98120' : session.status === 'running' ? '#f59e0b20' : '#64748b20' }]}>
                <Text style={[styles.badgeText, { color: session.status === 'active' ? '#10b981' : session.status === 'running' ? '#f59e0b' : '#64748b' }]}>
                  {session.status === 'active' ? 'نشطة' : session.status === 'running' ? 'تعمل' : 'خاملة'}
                </Text>
              </View>
            </View>
            <View style={styles.metrics}>
              <Metric label="CPU" value={session.cpu} color="#0ea5e9" />
              <Metric label="ذاكرة" value={session.memory} color="#8b5cf6" />
              <Metric label="مهام" value={session.tasks} color="#10b981" />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function Metric({ label, value, color }: any) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue} style={{ color }}>{value}%</Text>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inputRow: { flexDirection: 'row', padding: 16 },
  input: {
    flex: 1, backgroundColor: COLORS.surface, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border, marginRight: 10
  },
  addBtn: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center'
  },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sessionTitle: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginLeft: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  metrics: { flexDirection: 'row', marginTop: 12 },
  metric: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 18, fontWeight: 'bold' },
  metricLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  barBg: { width: '80%', height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginTop: 6 },
  barFill: { height: 4, borderRadius: 2 }
});
