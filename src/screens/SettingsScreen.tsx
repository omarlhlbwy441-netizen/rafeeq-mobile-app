import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { useAuth } from '@context/AuthContext';
import { COLORS } from '@utils/constants';

export default function SettingsScreen() {
  const { state, dispatch } = useApp();
  const { logout } = useAuth();

  const toggleTheme = () => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' });
  const toggleLang = () => dispatch({ type: 'SET_LANGUAGE', payload: state.language === 'ar' ? 'en' : 'ar' });

  const handleLogout = () => {
    Alert.alert('تسجيل الخروج', 'هل أنت متأكد؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <View style={styles.container}>
      <Header title="الإعدادات" />
      <ScrollView>
        <Card>
          <SettingItem
            icon="moon"
            label="الوضع الليلي"
            right={<Switch value={state.theme === 'dark'} onValueChange={toggleTheme} trackColor={{ false: COLORS.border, true: COLORS.primary }} />}
          />
          <SettingItem
            icon="language"
            label="اللغة"
            right={<Text style={styles.langText}>{state.language === 'ar' ? 'العربية' : 'English'}</Text>}
            onPress={toggleLang}
          />
          <SettingItem
            icon="notifications"
            label="الإشعارات"
            right={<Switch value={state.notifications} onValueChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })} trackColor={{ false: COLORS.border, true: COLORS.primary }} />}
          />
          <SettingItem
            icon="finger-print"
            label="التحقق البيومتري"
            right={<Switch value={state.biometric} onValueChange={() => dispatch({ type: 'TOGGLE_BIOMETRIC' })} trackColor={{ false: COLORS.border, true: COLORS.primary }} />}
          />
        </Card>

        <Text style={styles.sectionTitle}>عن التطبيق</Text>
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الإصدار</Text>
            <Text style={styles.infoValue}>2.3.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>النواة</Text>
            <Text style={styles.infoValue}>Rafeeq Kernel</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>البنية</Text>
            <Text style={styles.infoValue}>Expo + React Native</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الخادم</Text>
            <Text style={styles.infoValue}>FastAPI + PostgreSQL</Text>
          </View>
        </Card>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Rafeeq Kernel v2.3.0 — Built with ❤️ in Egypt 🇪🇬</Text>
      </ScrollView>
    </View>
  );
}

function SettingItem({ icon, label, right, onPress }: any) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {right}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { fontSize: 15, color: COLORS.text, marginLeft: 12 },
  langText: { color: COLORS.primary, fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMuted, marginHorizontal: 16, marginTop: 20, marginBottom: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 14, color: COLORS.textMuted },
  infoValue: { fontSize: 14, color: COLORS.text, fontWeight: '600' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    margin: 16, padding: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#ef444440', backgroundColor: '#ef444410'
  },
  logoutText: { color: '#ef4444', fontSize: 15, fontWeight: 'bold', marginLeft: 8 },
  footer: { textAlign: 'center', color: COLORS.textDark, fontSize: 11, marginVertical: 20 }
});
