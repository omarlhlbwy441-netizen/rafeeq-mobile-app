import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS } from '@utils/constants';

interface TerminalProps {
  onCommand: (cmd: string) => void;
  output: string[];
  prompt?: string;
}

export default function Terminal({ onCommand, output, prompt = 'rafeeq@kernel:~$' }: TerminalProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [output]);

  const handleSubmit = () => {
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>🐺 Rafeeq Terminal v2.3.0</Text>
      </View>
      <ScrollView ref={scrollRef} style={styles.output} contentContainerStyle={styles.outputContent}>
        {output.map((line, i) => (
          <Text key={i} style={styles.line}>{line}</Text>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <Text style={styles.prompt}>{prompt}</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={COLORS.textDark}
          placeholder="أدخل أمر..."
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050508',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: 16
  },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  headerText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12
  },
  output: {
    flex: 1,
    padding: 10
  },
  outputContent: {
    paddingBottom: 10
  },
  line: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 18,
    marginVertical: 1
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface
  },
  prompt: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginRight: 8
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 12,
    fontFamily: 'monospace',
    padding: 0
  }
});
