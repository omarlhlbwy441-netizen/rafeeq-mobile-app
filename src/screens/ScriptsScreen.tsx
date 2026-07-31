import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function ScriptsScreen() {
  const { dispatch } = useApp();

  const scripts = [
    { name: 'setup.sh', icon: 'build', desc: 'إعداد البيئة', color: '#0ea5e9' },
    { name: 'deploy.sh', icon: 'rocket', desc: 'النشر التلقائي', color: '#8b5cf6' },
    { name: 'backup.sh', icon: 'save', desc: 'نسخ احتياطي', color: '#10b981' },
    { name: 'health-check.sh', icon: 'pulse', desc: 'فحص الصحة', color: '#f59e0b' },
    { name: 'migrate.sh', icon: 'arrow-forward', desc: 'هجرة قاعدة البيانات', color: '#06b6d4' },
    { name: 'rollback.sh', icon: 'return-up-back', desc: 'التراجع', color: '#ef4444' },
    { name: 'seed.sh', icon: 'leaf', desc: 'تعبئة البيانات', color: '#84cc16' },
    { name: 'certbot.sh', icon: 'lock-closed', desc: 'شهادات SSL', color: '#ec4899' }
  ];

  const runScript = (name: string) => {
    dispatch({ type: 'ADD_LOG', payload: `Script executed: ${name}` });
    Alert.alert('تشغيل', `تم تشغيل ${name} بنجاح`);
  };

  return (
    <View style={styles.container}>
      <Header title="السكربتات" />
      <ScrollView>
        {scripts.map(s => (
          <Card key={s.name}>
            <View style={styles.scriptRow}>
              <View style={[styles.iconBox, { backgroundColor: s.color + '20' }]}>
                <Ionicons name={s.icon as any} size={22} color={s.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scriptName}>{s.name}</Text>
                <Text style={styles.scriptDesc}>{s.desc}</Text>
              </View>
              <TouchableOpacity style={[styles.runBtn, { backgroundColor: s.color }]} onPress={() => runScript(s.name)}>
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
  scriptRow: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  scriptName: { fontSize: 15, fontWeight: '600', color: COLORS.text, fontFamily: 'monospace' },
  scriptDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  runBtn: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }
});
