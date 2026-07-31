import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import LogViewer from '@components/LogViewer';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function EvolutionScreen() {
  const { state, dispatch } = useApp();
  const [tasks, setTasks] = useState([
    { id: '1', type: 'code', description: 'تحسين محرك الذكاء الاصطناعي', status: 'completed', progress: 100 },
    { id: '2', type: 'fix', description: 'إصلاح مشكلة الاتصال بـ Redis', status: 'running', progress: 65 },
    { id: '3', type: 'create', description: 'إنشاء وكيل جديد للأمان', status: 'pending', progress: 0 },
    { id: '4', type: 'optimize', description: 'تحسين أداء قاعدة البيانات', status: 'completed', progress: 100 }
  ]);

  const triggerEvolution = () => {
    Alert.alert('تفعيل التطور', 'هل تريد تفعيل دورة تطور ذاتية جديدة؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تفعيل',
        onPress: () => {
          dispatch({ type: 'ADD_LOG', payload: 'EVOLUTION TRIGGERED: Starting self-evolution cycle' });
          const newTask = {
            id: Date.now().toString(),
            type: 'code',
            description: 'دورة تطور ذاتية تلقائية',
            status: 'running',
            progress: 0
          };
          setTasks([newTask, ...tasks]);
        }
      }
    ]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'code': return 'code-slash';
      case 'fix': return 'bug';
      case 'create': return 'add-circle';
      case 'optimize': return 'trending-up';
      default: return 'sync';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'code': return '#0ea5e9';
      case 'fix': return '#ef4444';
      case 'create': return '#10b981';
      case 'optimize': return '#f59e0b';
      default: return '#8b5cf6';
    }
  };

  return (
    <View style={styles.container}>
      <Header title="محرك التطور الذاتي" />
      <ScrollView>
        <TouchableOpacity style={styles.triggerBtn} onPress={triggerEvolution}>
          <Ionicons name="sync-circle" size={28} color="#fff" />
          <Text style={styles.triggerText}>تفعيل دورة تطور ذاتية</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>المهام الحالية</Text>
        {tasks.map(task => (
          <Card key={task.id}>
            <View style={styles.taskHeader}>
              <View style={styles.taskTitle}>
                <View style={[styles.iconBox, { backgroundColor: getColor(task.type) + '20' }]}>
                  <Ionicons name={getIcon(task.type) as any} size={18} color={getColor(task.type)} />
                </View>
                <View>
                  <Text style={styles.taskName}>{task.description}</Text>
                  <Text style={styles.taskType}>{task.type.toUpperCase()}</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: task.status === 'completed' ? '#10b98120' : task.status === 'running' ? '#f59e0b20' : '#64748b20' }]}>
                <Text style={[styles.statusText, { color: task.status === 'completed' ? '#10b981' : task.status === 'running' ? '#f59e0b' : '#64748b' }]}>
                  {task.status === 'completed' ? 'مكتمل' : task.status === 'running' ? 'يعمل' : 'معلق'}
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${task.progress}%`, backgroundColor: getColor(task.type) }]} />
            </View>
            <Text style={styles.progressText}>{task.progress}%</Text>
          </Card>
        ))}

        <LogViewer logs={state.logs.filter(l => l.includes('EVOLUTION') || l.includes('Agent'))} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  triggerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, margin: 16, padding: 16, borderRadius: 16
  },
  triggerText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  taskHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  taskTitle: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  taskName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  taskType: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginTop: 12 },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'right' }
});
