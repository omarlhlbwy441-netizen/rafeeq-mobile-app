import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function DatabaseScreen() {
  const { dispatch } = useApp();
  const [tables] = useState([
    { name: 'users', rows: 1247, size: '2.4 MB', lastUpdated: 'منذ 5 دقائق' },
    { name: 'sessions', rows: 3892, size: '1.8 MB', lastUpdated: 'منذ دقيقة' },
    { name: 'agents', rows: 10, size: '12 KB', lastUpdated: 'منذ يوم' },
    { name: 'evolution_logs', rows: 15678, size: '8.5 MB', lastUpdated: 'منذ 10 دقائق' },
    { name: 'github_repos', rows: 4, size: '8 KB', lastUpdated: 'منذ ساعة' },
    { name: 'game_projects', rows: 3, size: '6 KB', lastUpdated: 'منذ 3 أيام' }
  ]);
  const [query, setQuery] = useState('');

  const runQuery = () => {
    dispatch({ type: 'ADD_LOG', payload: `SQL Query executed: ${query.substring(0, 50)}` });
    Alert.alert('استعلام', 'تم تنفيذ الاستعلام بنجاح (محاكاة)');
  };

  return (
    <View style={styles.container}>
      <Header title="قاعدة البيانات" />
      <ScrollView>
        <View style={styles.dbInfo}>
          <View style={styles.dbBadge}>
            <Ionicons name="server" size={20} color="#0ea5e9" />
            <Text style={styles.dbText}>PostgreSQL 15</Text>
          </View>
          <View style={styles.dbBadge}>
            <Ionicons name="flash" size={20} color="#f59e0b" />
            <Text style={styles.dbText}>Redis 7</Text>
          </View>
        </View>

        <View style={styles.queryBox}>
          <TextInput
            style={styles.queryInput}
            placeholder="SELECT * FROM users WHERE..."
            placeholderTextColor={COLORS.textDark}
            value={query}
            onChangeText={setQuery}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity style={styles.runBtn} onPress={runQuery}>
            <Ionicons name="play" size={18} color="#fff" />
            <Text style={styles.runText}>تشغيل</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>الجداول ({tables.length})</Text>
        {tables.map(table => (
          <Card key={table.name}>
            <View style={styles.tableRow}>
              <View style={styles.tableIcon}>
                <Ionicons name="grid-outline" size={20} color="#8b5cf6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tableName}>{table.name}</Text>
                <Text style={styles.tableMeta}>{table.rows} صف • {table.size}</Text>
              </View>
              <Text style={styles.updated}>{table.lastUpdated}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  dbInfo: { flexDirection: 'row', padding: 16 },
  dbBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: COLORS.border },
  dbText: { color: COLORS.text, marginLeft: 8, fontSize: 13, fontWeight: '600' },
  queryBox: { margin: 16, backgroundColor: COLORS.surface, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 12 },
  queryInput: { color: COLORS.text, fontSize: 13, fontFamily: 'monospace', minHeight: 60, textAlignVertical: 'top' },
  runBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10b981', padding: 10, borderRadius: 10, marginTop: 10 },
  runText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginHorizontal: 16, marginTop: 8, marginBottom: 8 },
  tableRow: { flexDirection: 'row', alignItems: 'center' },
  tableIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#8b5cf620', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  tableName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  tableMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  updated: { fontSize: 11, color: COLORS.textDark }
});
