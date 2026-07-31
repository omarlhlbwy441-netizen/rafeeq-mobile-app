import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function WebArchitectScreen() {
  const { dispatch } = useApp();
  const [sites, setSites] = useState([
    { id: '1', domain: 'rafeeq.ai', framework: 'Next.js', ssl: true, status: 'live' },
    { id: '2', domain: 'docs.rafeeq.ai', framework: 'Docusaurus', ssl: true, status: 'live' },
    { id: '3', domain: 'api.rafeeq.ai', framework: 'FastAPI', ssl: true, status: 'live' }
  ]);
  const [newDomain, setNewDomain] = useState('');

  const addSite = () => {
    if (newDomain.trim()) {
      setSites([...sites, { id: Date.now().toString(), domain: newDomain, framework: 'React', ssl: false, status: 'building' }]);
      setNewDomain('');
      dispatch({ type: 'ADD_LOG', payload: `Website deployed: ${newDomain}` });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Web Architect" />
      <ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="اسم النطاق..."
            placeholderTextColor={COLORS.textDark}
            value={newDomain}
            onChangeText={setNewDomain}
          />
          <TouchableOpacity style={styles.addBtn} onPress={addSite}>
            <Ionicons name="globe" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {sites.map(site => (
          <Card key={site.id}>
            <View style={styles.siteHeader}>
              <View style={styles.siteIcon}>
                <Ionicons name="globe-outline" size={22} color="#06b6d4" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.domain}>{site.domain}</Text>
                <Text style={styles.framework}>{site.framework}</Text>
              </View>
              <View style={styles.badges}>
                {site.ssl && (
                  <View style={styles.badge}>
                    <Ionicons name="lock-closed" size={10} color="#10b981" />
                    <Text style={[styles.badgeText, { color: '#10b981' }]}>SSL</Text>
                  </View>
                )}
                <View style={[styles.statusBadge, { backgroundColor: site.status === 'live' ? '#10b98120' : '#f59e0b20' }]}>
                  <Text style={[styles.statusText, { color: site.status === 'live' ? '#10b981' : '#f59e0b' }]}>
                    {site.status === 'live' ? 'مباشر' : 'يبنى'}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inputRow: { flexDirection: 'row', padding: 16 },
  input: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, marginRight: 10 },
  addBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#06b6d4', justifyContent: 'center', alignItems: 'center' },
  siteHeader: { flexDirection: 'row', alignItems: 'center' },
  siteIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#06b6d420', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  domain: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  framework: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  badges: { flexDirection: 'row', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b98115', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 6 },
  badgeText: { fontSize: 10, fontWeight: '600', marginLeft: 3 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' }
});
