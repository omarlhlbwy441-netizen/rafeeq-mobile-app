import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS, AGENTS } from '@utils/constants';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useApp();
  const [stats, setStats] = useState({ agents: 10, tasks: 47, repos: 12, uptime: '99.9%' });

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'ADD_LOG', payload: `[${new Date().toLocaleTimeString()}] System heartbeat OK` });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      data: [65, 78, 45, 89, 92, 76],
      color: () => '#0ea5e9'
    }]
  };

  const barData = {
    labels: ['AI', 'Web', 'Game', 'Video', 'DB', 'DevOps'],
    datasets: [{
      data: [85, 72, 45, 60, 90, 78]
    }]
  };

  return (
    <View style={styles.container}>
      <Header title="لوحة التحكم" rightIcon="notifications-outline" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatBox icon="people" value={stats.agents} label="الوكلاء" color="#0ea5e9" />
          <StatBox icon="sync" value={stats.tasks} label="المهام" color="#8b5cf6" />
          <StatBox icon="logo-github" value={stats.repos} label="المستودعات" color="#10b981" />
          <StatBox icon="pulse" value={stats.uptime} label="التوفر" color="#f59e0b" />
        </View>

        <Card>
          <Text style={styles.sectionTitle}>نشاط النظام (24 ساعة)</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 64}
            height={180}
            chartConfig={{
              backgroundColor: '#111118',
              backgroundGradientFrom: '#111118',
              backgroundGradientTo: '#111118',
              decimalPlaces: 0,
              color: () => '#0ea5e9',
              labelColor: () => '#94a3b8',
              style: { borderRadius: 12 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#0ea5e9' }
            }}
            bezier
            style={{ borderRadius: 12, marginTop: 8 }}
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>توزيع الموارد</Text>
          <BarChart
            data={barData}
            width={screenWidth - 64}
            height={160}
            chartConfig={{
              backgroundColor: '#111118',
              backgroundGradientFrom: '#111118',
              backgroundGradientTo: '#111118',
              decimalPlaces: 0,
              color: () => '#8b5cf6',
              labelColor: () => '#94a3b8'
            }}
            style={{ borderRadius: 12, marginTop: 8 }}
            showValuesOnTopOfBars
          />
        </Card>

        <Text style={styles.sectionTitle}>الوكلاء النشطون</Text>
        {AGENTS.slice(0, 4).map(agent => (
          <TouchableOpacity key={agent.id} onPress={() => navigation.navigate('AI Engine' as never)}>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.agentIcon, { backgroundColor: agent.color + '20' }]}>
                <Ionicons name={agent.icon as any} size={24} color={agent.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.agentName}>{agent.name}</Text>
                <Text style={styles.agentRole}>{agent.role}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: agent.color + '20' }]}>
                <View style={[styles.dot, { backgroundColor: agent.color }]} />
                <Text style={[styles.statusText, { color: agent.color }]}>نشط</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function StatBox({ icon, value, label, color }: any) {
  return (
    <View style={[styles.statBox, { borderColor: color + '40' }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingTop: 8 },
  statBox: {
    width: '23%', margin: '1%',
    backgroundColor: COLORS.surface, borderRadius: 14,
    padding: 12, alignItems: 'center', borderWidth: 1
  },
  statValue: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginTop: 16, marginBottom: 8 },
  agentIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  agentName: { fontSize: 15, fontWeight: 'bold', color: COLORS.text },
  agentRole: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 11, fontWeight: '600' }
});
