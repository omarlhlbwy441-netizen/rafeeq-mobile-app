import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { COLORS } from '@utils/constants';

export default function HealthScreen() {
  const [health, setHealth] = useState({
    status: 'healthy',
    db: { connected: true, latency: 8 },
    redis: { connected: true, latency: 3 },
    cpu: 45,
    memory: 62,
    uptime: 86400 * 3 + 3600 * 5 + 120
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 60) + 20,
        memory: Math.floor(Math.random() * 40) + 40,
        db: { ...prev.db, latency: Math.floor(Math.random() * 15) + 3 },
        redis: { ...prev.redis, latency: Math.floor(Math.random() * 8) + 1 }
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <View style={styles.container}>
      <Header title="صحة النظام" />
      <ScrollView>
        <View style={styles.statusBanner}>
          <Ionicons name="checkmark-circle" size={40} color="#10b981" />
          <Text style={styles.statusTitle}>النظام بصحة جيدة</Text>
          <Text style={styles.statusSub}>جميع الخدمات تعمل بشكل طبيعي</Text>
        </View>

        <Card>
          <View style={styles.metricRow}>
            <HealthMetric label="قاعدة البيانات" value={health.db.latency + 'ms'} icon="server" color="#0ea5e9" status={health.db.connected} />
            <HealthMetric label="Redis" value={health.redis.latency + 'ms'} icon="flash" color="#f59e0b" status={health.redis.connected} />
          </View>
        </Card>

        <Card>
          <View style={styles.metricRow}>
            <HealthMetric label="CPU" value={health.cpu + '%'} icon="hardware-chip" color="#8b5cf6" status={health.cpu < 80} />
            <HealthMetric label="الذاكرة" value={health.memory + '%'} icon="layers" color="#10b981" status={health.memory < 85} />
          </View>
        </Card>

        <Card>
          <View style={styles.uptimeRow}>
            <Ionicons name="time" size={24} color={COLORS.primary} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.uptimeLabel}>مدة التشغيل</Text>
              <Text style={styles.uptimeValue}>{formatUptime(health.uptime)}</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function HealthMetric({ label, value, icon, color, status }: any) {
  return (
    <View style={styles.metricBox}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={20} color={color} />
        <View style={[styles.dot, { backgroundColor: status ? '#10b981' : '#ef4444' }]} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  statusBanner: { alignItems: 'center', padding: 30, backgroundColor: '#10b98110' },
  statusTitle: { fontSize: 20, fontWeight: 'bold', color: '#10b981', marginTop: 12 },
  statusSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-around' },
  metricBox: { alignItems: 'center', padding: 10 },
  metricHeader: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 6 },
  metricValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.text, marginTop: 8 },
  metricLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  uptimeRow: { flexDirection: 'row', alignItems: 'center' },
  uptimeLabel: { fontSize: 13, color: COLORS.textMuted },
  uptimeValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginTop: 2 }
});
