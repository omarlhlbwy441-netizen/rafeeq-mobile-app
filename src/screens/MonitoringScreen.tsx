import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import Header from '@components/Header';
import Card from '@components/Card';
import { COLORS } from '@utils/constants';

const screenWidth = Dimensions.get('window').width;

export default function MonitoringScreen() {
  const [metrics, setMetrics] = useState({ cpu: 0.45, memory: 0.62, disk: 0.38, network: 0.71 });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpu: Math.random() * 0.8 + 0.1,
        memory: Math.random() * 0.6 + 0.2,
        disk: Math.random() * 0.5 + 0.1,
        network: Math.random() * 0.9 + 0.05
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const cpuData = {
    labels: ['1m', '2m', '3m', '4m', '5m', '6m'],
    datasets: [{ data: [30, 45, 35, 60, 55, metrics.cpu * 100], color: () => '#0ea5e9' }]
  };

  const progressData = {
    labels: ['CPU', 'RAM', 'Disk', 'Net'],
    data: [metrics.cpu, metrics.memory, metrics.disk, metrics.network],
    colors: ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b']
  };

  return (
    <View style={styles.container}>
      <Header title="المراقبة (Grafana)" />
      <ScrollView>
        <View style={styles.alerts}>
          <View style={[styles.alertBox, { backgroundColor: '#10b98115', borderColor: '#10b98130' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={[styles.alertText, { color: '#10b981' }]}>النظام مستقر</Text>
          </View>
          <View style={[styles.alertBox, { backgroundColor: '#0ea5e915', borderColor: '#0ea5e930' }]}>
            <Ionicons name="time" size={20} color="#0ea5e9" />
            <Text style={[styles.alertText, { color: '#0ea5e9' }]}>99.9% توفر</Text>
          </View>
        </View>

        <Card>
          <Text style={styles.chartTitle}>استخدام CPU (آخر 6 دقائق)</Text>
          <LineChart
            data={cpuData}
            width={screenWidth - 64}
            height={160}
            chartConfig={{
              backgroundColor: '#111118',
              backgroundGradientFrom: '#111118',
              backgroundGradientTo: '#111118',
              decimalPlaces: 0,
              color: () => '#0ea5e9',
              labelColor: () => '#94a3b8'
            }}
            bezier
            style={{ borderRadius: 12, marginTop: 8 }}
          />
        </Card>

        <Card>
          <Text style={styles.chartTitle}>موارد النظام (حي)</Text>
          <ProgressChart
            data={progressData}
            width={screenWidth - 64}
            height={180}
            strokeWidth={14}
            radius={28}
            chartConfig={{
              backgroundColor: '#111118',
              backgroundGradientFrom: '#111118',
              backgroundGradientTo: '#111118',
              color: (opacity = 1) => `rgba(255,255,255,${opacity})`
            }}
            hideLegend={false}
            style={{ borderRadius: 12, marginTop: 8 }}
          />
        </Card>

        <Text style={styles.sectionTitle}>الخدمات</Text>
        <ServiceItem name="FastAPI" status="up" latency="12ms" />
        <ServiceItem name="PostgreSQL" status="up" latency="8ms" />
        <ServiceItem name="Redis" status="up" latency="3ms" />
        <ServiceItem name="Nginx" status="up" latency="5ms" />
        <ServiceItem name="Prometheus" status="up" latency="15ms" />
      </ScrollView>
    </View>
  );
}

function ServiceItem({ name, status, latency }: any) {
  return (
    <Card>
      <View style={styles.serviceRow}>
        <View style={styles.serviceIcon}>
          <Ionicons name="server-outline" size={18} color="#0ea5e9" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceName}>{name}</Text>
          <Text style={styles.serviceLatency}>{latency}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: status === 'up' ? '#10b981' : '#ef4444' }]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  alerts: { flexDirection: 'row', padding: 16 },
  alertBox: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginHorizontal: 4 },
  alertText: { marginLeft: 8, fontSize: 13, fontWeight: '600' },
  chartTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.text },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  serviceRow: { flexDirection: 'row', alignItems: 'center' },
  serviceIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#0ea5e920', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  serviceName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  serviceLatency: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  statusDot: { width: 10, height: 10, borderRadius: 5 }
});
