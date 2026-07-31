import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@utils/constants';

export default function ThankYouEgyptScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#0a0a0f', '#1a0a2e', '#0f172a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
          <View style={styles.hexagon}>
            <Ionicons name="shield-checkmark" size={60} color="#0ea5e9" />
          </View>

          <Text style={styles.title}>رفيق</Text>
          <Text style={styles.subtitle}>Rafeeq Kernel v2.3.0</Text>

          <View style={styles.divider} />

          <Text style={styles.quote}>
            "من بعد فضل الله أشكر دولة مصر لأنها أتاحت لي فرصة لكي أقوم بهذا العمل"
          </Text>
          <Text style={styles.author}>— مؤسس رفيق</Text>

          <View style={styles.features}>
            <FeatureItem icon="hardware-chip" text="نظام ذكاء اصطناعي ذاتي التطور" />
            <FeatureItem icon="people" text="10+ وكلاء متخصصين" />
            <FeatureItem icon="cloud" text="بنية سحابية متكاملة" />
            <FeatureItem icon="code-slash" text="توليد أكواد تلقائي" />
            <FeatureItem icon="globe" text="إدارة مشاريع متكاملة" />
          </View>

          <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login' as never)}>
            <LinearGradient colors={['#0ea5e9', '#8b5cf6']} style={styles.btnGradient}>
              <Text style={styles.btnText}>ابدأ الرحلة</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footer}>Built with ❤️ in Egypt 🇪🇬</Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Ionicons name={icon as any} size={18} color="#0ea5e9" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  content: { alignItems: 'center' },
  hexagon: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: 'rgba(14,165,233,0.1)',
    borderWidth: 2, borderColor: '#0ea5e9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0ea5e9', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 10
  },
  title: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 2 },
  subtitle: { fontSize: 14, color: '#8b5cf6', marginTop: 4, fontWeight: '600' },
  divider: { width: 60, height: 3, backgroundColor: '#0ea5e9', borderRadius: 2, marginVertical: 20 },
  quote: { fontSize: 16, color: '#e2e8f0', textAlign: 'center', lineHeight: 26, fontStyle: 'italic' },
  author: { fontSize: 13, color: '#94a3b8', marginTop: 8 },
  features: { width: '100%', marginTop: 24, marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20 },
  featureText: { color: '#cbd5e1', marginLeft: 12, fontSize: 14 },
  btn: { width: '80%', marginTop: 8, borderRadius: 16, overflow: 'hidden' },
  btnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginRight: 8 },
  footer: { marginTop: 24, fontSize: 12, color: '#475569' }
});
