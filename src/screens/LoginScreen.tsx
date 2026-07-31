import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@context/AuthContext';
import { COLORS } from '@utils/constants';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, register, biometricLogin } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    let success;
    if (isRegister) {
      success = await register(name, email, password);
    } else {
      success = await login(email, password);
    }
    setLoading(false);
    if (success) {
      navigation.navigate('Main' as never);
    } else {
      Alert.alert('خطأ', isRegister ? 'فشل إنشاء الحساب' : 'بيانات الدخول غير صحيحة');
    }
  };

  const handleBiometric = async () => {
    const success = await biometricLogin();
    if (success) navigation.navigate('Main' as never);
    else Alert.alert('خطأ', 'فشل التحقق البيومتري');
  };

  return (
    <LinearGradient colors={['#0a0a0f', '#1a0a2e']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.logo}>
            <Ionicons name="shield-checkmark" size={50} color="#0ea5e9" />
            <Text style={styles.title}>رفيق</Text>
            <Text style={styles.subtitle}>Your Intelligent AI Companion</Text>
          </View>

          {isRegister && (
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
              <TextInput style={styles.input} placeholder="الاسم الكامل" placeholderTextColor={COLORS.textDark}
                value={name} onChangeText={setName} />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
            <TextInput style={styles.input} placeholder="البريد الإلكتروني" placeholderTextColor={COLORS.textDark}
              value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
            <TextInput style={styles.input} placeholder="كلمة المرور" placeholderTextColor={COLORS.textDark}
              value={password} onChangeText={setPassword} secureTextEntry={!showPass} />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
            <LinearGradient colors={['#0ea5e9', '#8b5cf6']} style={styles.btnGradient}>
              <Text style={styles.btnText}>{loading ? 'جاري...' : isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bioBtn} onPress={handleBiometric}>
            <Ionicons name="finger-print-outline" size={24} color="#0ea5e9" />
            <Text style={styles.bioText}>الدخول بالبصمة / Face ID</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
            <Text style={styles.switchText}>
              {isRegister ? 'لديك حساب؟ ' : 'ليس لديك حساب؟ '}
              <Text style={styles.switchLink}>{isRegister ? 'تسجيل الدخول' : 'إنشاء حساب'}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', marginTop: 12 },
  subtitle: { fontSize: 13, color: '#8b5cf6', marginTop: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 4,
    marginVertical: 8, borderWidth: 1, borderColor: COLORS.border
  },
  input: { flex: 1, color: COLORS.text, fontSize: 15, paddingVertical: 12, marginLeft: 10 },
  btn: { marginTop: 16, borderRadius: 14, overflow: 'hidden' },
  btnGradient: { paddingVertical: 16, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bioBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: 16, padding: 14, borderRadius: 14,
    borderWidth: 1, borderColor: '#0ea5e9'
  },
  bioText: { color: '#0ea5e9', marginLeft: 8, fontSize: 14, fontWeight: '600' },
  switchText: { color: COLORS.textMuted, textAlign: 'center', marginTop: 24, fontSize: 14 },
  switchLink: { color: '#0ea5e9', fontWeight: 'bold' }
});
