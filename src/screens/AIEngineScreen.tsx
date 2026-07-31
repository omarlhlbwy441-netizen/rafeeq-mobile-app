import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: string;
}

export default function AIEngineScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'مرحباً! أنا WolfAlpha — مهندس النظام الرئيسي. كيف يمكنني مساعدتك اليوم؟', agent: 'WolfAlpha' }
  ]);
  const [input, setInput] = useState('');
  const { dispatch } = useApp();

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    dispatch({ type: 'ADD_LOG', payload: `AI Query: ${input.substring(0, 50)}` });

    setTimeout(() => {
      const responses = [
        'أفهم طلبك. سأقوم بتحليله وإعطائك أفضل الحلول.',
        'جاري معالجة البيانات... يمكنني مساعدتك في ذلك.',
        'تمام! سأنشئ لك كود مخصص لهذه المهمة.',
        'ممتاز، سأقوم بتفعيل الوكلاء المناسبين لهذا المشروع.'
      ];
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        agent: 'WolfAlpha'
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Header title="محرك الذكاء" />
      <ScrollView style={styles.messages} contentContainerStyle={{ padding: 16 }}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.botBubble]}>
            {msg.agent && (
              <View style={styles.agentTag}>
                <Ionicons name="hardware-chip-outline" size={12} color={COLORS.primary} />
                <Text style={styles.agentName}>{msg.agent}</Text>
              </View>
            )}
            <Text style={[styles.msgText, msg.role === 'user' ? styles.userText : styles.botText]}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="اكتب رسالتك..."
          placeholderTextColor={COLORS.textDark}
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  messages: { flex: 1 },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 18, marginVertical: 6 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: COLORS.primary + '20', borderBottomRightRadius: 4 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: COLORS.surface, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: COLORS.border },
  agentTag: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  agentName: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  msgText: { fontSize: 14, lineHeight: 20 },
  userText: { color: COLORS.text },
  botText: { color: COLORS.text },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, borderTopWidth: 1, borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  input: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border, maxHeight: 100
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginLeft: 10
  }
});
