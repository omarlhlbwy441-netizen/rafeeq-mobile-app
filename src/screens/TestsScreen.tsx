import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function TestsScreen() {
  const { dispatch } = useApp();
  const [tests, setTests] = useState([
    { id: '1', name: 'test_auth.py', status: 'passed', duration: '0.45s', coverage: 95 },
    { id: '2', name: 'test_api.py', status: 'passed', duration: '1.23s', coverage: 88 },
    { id: '3', name: 'test_evolution.py', status: 'passed', duration: '2.10s', coverage: 92 },
    { id: '4', name: 'test_games.py', status: 'failed', duration: '0.89s', coverage: 76 },
    { id: '5', name: 'test_health.py', status: 'passed', duration: '0.12s', coverage: 100 },
    { id: '6', name: 'test_videos.py', status: 'passed', duration: '1.56s', coverage: 84 },
    { id: '7', name: 'test_websites.py', status: 'passed', duration: '0.78s', coverage: 90 },
    { id: '8', name: 'test_websocket.py', status: 'passed', duration: '0.34s', coverage: 98 }
  ]);

  const runAll = () => {
    dispatch({ type: 'ADD_LOG', payload: 'TEST SUITE: Running all tests...' });
    setTests(tests.map(t => ({ ...t, status: 'running' })));
    setTimeout(() => {
      setTests(tests.map(t => ({ ...t, status: Math.random() > 0.1 ? 'passed' : 'failed' })));
      dispatch({ type: 'ADD_LOG', payload: 'TEST SUITE: All tests completed' });
    }, 2000);
  };

  const passed = tests.filter(t => t.status === 'passed').length;
  const failed = tests.filter(t => t.status === 'failed').length;
  const avgCoverage = Math.round(tests.reduce((a, b) => a + b.coverage, 0) / tests.length);

  return (
    <View style={styles.container}>
      <Header title="الاختبارات (pytest)" />
      <ScrollView>
        <View style={styles.summary}>
          <View style={[styles.sumBox, { backgroundColor: '#10b98115' }]}>
            <Text style={[styles.sumValue, { color: '#10b981' }]}>{passed}</Text>
            <Text style={styles.sumLabel}>نجح</Text>
          </View>
          <View style={[styles.sumBox, { backgroundColor: '#ef444415' }]}>
            <Text style={[styles.sumValue, { color: '#ef4444' }]}>{failed}</Text>
            <Text style={styles.sumLabel}>فشل</Text>
          </View>
          <View style={[styles.sumBox, { backgroundColor: '#0ea5e915' }]}>
            <Text style={[styles.sumValue, { color: '#0ea5e9' }]}>{avgCoverage}%</Text>
            <Text style={styles.sumLabel}>تغطية</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.runBtn} onPress={runAll}>
          <Ionicons name="play-circle" size={24} color="#fff" />
          <Text style={styles.runText}>تشغيل جميع الاختبارات</Text>
        </TouchableOpacity>

        {tests.map(test => (
          <Card key={test.id}>
            <View style={styles.testRow}>
              <Ionicons
                name={test.status === 'passed' ? 'checkmark-circle' : test.status === 'failed' ? 'close-circle' : 'time'}
                size={22}
                color={test.status === 'passed' ? '#10b981' : test.status === 'failed' ? '#ef4444' : '#f59e0b'}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.testName}>{test.name}</Text>
                <Text style={styles.testMeta}>{test.duration} • تغطية {test.coverage}%</Text>
              </View>
              <Text style={[styles.statusText, { color: test.status === 'passed' ? '#10b981' : test.status === 'failed' ? '#ef4444' : '#f59e0b' }]}>
                {test.status === 'passed' ? 'نجح' : test.status === 'failed' ? 'فشل' : 'يعمل'}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  summary: { flexDirection: 'row', padding: 16 },
  sumBox: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 12, marginHorizontal: 4, borderWidth: 1, borderColor: COLORS.border },
  sumValue: { fontSize: 22, fontWeight: 'bold' },
  sumLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  runBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, marginHorizontal: 16, marginBottom: 8,
    padding: 14, borderRadius: 14
  },
  runText: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginLeft: 8 },
  testRow: { flexDirection: 'row', alignItems: 'center' },
  testName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  testMeta: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statusText: { fontSize: 12, fontWeight: 'bold' }
});
