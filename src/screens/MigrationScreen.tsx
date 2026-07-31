import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function MigrationScreen() {
  const { dispatch } = useApp();
  const [migrations, setMigrations] = useState([
    { id: '001', name: 'create_users_table', status: 'applied', date: '2026-07-20' },
    { id: '002', name: 'create_agents_table', status: 'applied', date: '2026-07-21' },
    { id: '003', name: 'add_github_repos', status: 'applied', date: '2026-07-22' },
    { id: '004', name: 'add_evolution_logs', status: 'pending', date: '-' }
  ]);

  const runMigration = (id: string) => {
    dispatch({ type: 'ADD_LOG', payload: `Migration ${id} applied` });
    setMigrations(migrations.map(m => m.id === id ? { ...m, status: 'applied', date: new Date().toISOString().split('T')[0] } : m));
    Alert.alert('نجاح', `تم تطبيق الهجرة ${id}`);
  };

  const autoMigrate = () => {
    Alert.alert('هجرة تلقائية', 'هل تريد تشغيل الهجرة التلقائية لجميع الجداول؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تشغيل',
        onPress: () => {
          dispatch({ type: 'ADD_LOG', payload: 'AUTO MIGRATION: Running all pending migrations...' });
          setMigrations(migrations.map(m => m.status === 'pending' ? { ...m, status: 'applied', date: new Date().toISOString().split('T')[0] } : m));
          Alert.alert('تم', 'تم تطبيق جميع الهجرات بنجاح');
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="نظام الهجرة" />
      <ScrollView>
        <TouchableOpacity style={styles.autoBtn} onPress={autoMigrate}>
          <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
          <Text style={styles.autoText}>هجرة تلقائية</Text>
        </TouchableOpacity>

        {migrations.map(m => (
          <Card key={m.id}>
            <View style={styles.migRow}>
              <View style={styles.migIcon}>
                <Ionicons name="git-commit" size={20} color={m.status === 'applied' ? '#10b981' : '#f59e0b'} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.migName}>{m.name}</Text>
                <Text style={styles.migId}>ID: {m.id} • {m.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: m.status === 'applied' ? '#10b98120' : '#f59e0b20' }]}>
                <Text style={[styles.statusText, { color: m.status === 'applied' ? '#10b981' : '#f59e0b' }]}>
                  {m.status === 'applied' ? 'مطبق' : 'معلق'}
                </Text>
              </View>
              {m.status === 'pending' && (
                <TouchableOpacity style={styles.runBtn} onPress={() => runMigration(m.id)}>
                  <Ionicons name="play" size={16} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  autoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#8b5cf6', margin: 16, padding: 16, borderRadius: 16
  },
  autoText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  migRow: { flexDirection: 'row', alignItems: 'center' },
  migIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: COLORS.surfaceLight, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  migName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  migId: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginRight: 8 },
  statusText: { fontSize: 11, fontWeight: '600' },
  runBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center' }
});
