import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '@utils/constants';

interface LogViewerProps {
  logs: string[];
  maxHeight?: number;
}

export default function LogViewer({ logs, maxHeight = 300 }: LogViewerProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollRef.current && logs.length > 0) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [logs]);

  const getLogColor = (log: string) => {
    if (log.includes('ERROR') || log.includes('FAILED')) return COLORS.danger;
    if (log.includes('WARN')) return COLORS.warning;
    if (log.includes('SUCCESS') || log.includes('COMPLETED')) return COLORS.accent;
    if (log.includes('INFO')) return COLORS.primary;
    return COLORS.textMuted;
  };

  return (
    <View style={[styles.container, { maxHeight }]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>سجل النظام</Text>
        <Text style={styles.count}>{logs.length} سجل</Text>
      </View>
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content}>
        {logs.length === 0 ? (
          <Text style={styles.empty}>لا توجد سجلات بعد...</Text>
        ) : (
          logs.map((log, i) => (
            <Text key={i} style={[styles.logLine, { color: getLogColor(log) }]}>
              <Text style={styles.timestamp}>{new Date().toLocaleTimeString('ar-EG')} </Text>
              {log}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#050508',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginHorizontal: 16,
    marginVertical: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  headerText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 12
  },
  count: {
    color: COLORS.textMuted,
    fontSize: 11
  },
  scroll: {
    maxHeight: 250
  },
  content: {
    padding: 10
  },
  logLine: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginVertical: 1,
    lineHeight: 16
  },
  timestamp: {
    color: COLORS.textDark,
    fontSize: 10
  },
  empty: {
    color: COLORS.textDark,
    textAlign: 'center',
    paddingVertical: 20
  }
});
