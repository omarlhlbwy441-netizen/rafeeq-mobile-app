import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function GitHubScreen() {
  const { dispatch } = useApp();
  const [repos] = useState([
    { name: 'dtr-hjin', description: 'Rafeeq Kernel Hybrid Mobile', stars: 12, forks: 3, lang: 'Python', updated: 'منذ ساعة' },
    { name: 'dtr-n', description: 'Self-Evolving AI System', stars: 45, forks: 8, lang: 'Python', updated: 'منذ يومين' },
    { name: 'dtr2', description: 'DTR Server Generator', stars: 23, forks: 5, lang: 'TypeScript', updated: 'منذ 3 أيام' },
    { name: 'wolf-ai', description: 'Wolf AI Platform', stars: 67, forks: 12, lang: 'Next.js', updated: 'منذ أسبوع' }
  ]);

  const syncRepo = (name: string) => {
    dispatch({ type: 'ADD_LOG', payload: `GitHub Sync: Syncing ${name}...` });
    setTimeout(() => {
      dispatch({ type: 'ADD_LOG', payload: `GitHub Sync: ${name} synced successfully` });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Header title="GitHub Manager" />
      <ScrollView>
        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>مستودعات</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>147</Text>
            <Text style={styles.statLabel}>نجوم</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>28</Text>
            <Text style={styles.statLabel}>تفرع</Text>
          </View>
        </View>

        {repos.map(repo => (
          <Card key={repo.name}>
            <View style={styles.repoHeader}>
              <Ionicons name="logo-github" size={22} color={COLORS.text} />
              <Text style={styles.repoName}>{repo.name}</Text>
            </View>
            <Text style={styles.repoDesc}>{repo.description}</Text>
            <View style={styles.repoMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.metaText}>{repo.stars}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="git-branch" size={14} color={COLORS.textMuted} />
                <Text style={styles.metaText}>{repo.forks}</Text>
              </View>
              <View style={styles.metaItem}>
                <View style={[styles.langDot, { backgroundColor: repo.lang === 'Python' ? '#3572A5' : '#3178C6' }]} />
                <Text style={styles.metaText}>{repo.lang}</Text>
              </View>
              <Text style={styles.updated}>{repo.updated}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => syncRepo(repo.name)}>
                <Ionicons name="sync-outline" size={14} color={COLORS.primary} />
                <Text style={styles.actionText}>مزامنة</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`https://github.com/omarlhlbwy441-netizen/${repo.name}`)}>
                <Ionicons name="open-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.actionText}>فتح</Text>
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
  stats: { flexDirection: 'row', justifyContent: 'space-around', padding: 16 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  repoHeader: { flexDirection: 'row', alignItems: 'center' },
  repoName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginLeft: 8 },
  repoDesc: { fontSize: 13, color: COLORS.textMuted, marginTop: 6 },
  repoMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  metaText: { fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },
  langDot: { width: 10, height: 10, borderRadius: 5 },
  updated: { fontSize: 11, color: COLORS.textDark, marginLeft: 'auto' },
  actions: { flexDirection: 'row', marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  actionText: { fontSize: 12, color: COLORS.textMuted, marginLeft: 4 }
});
