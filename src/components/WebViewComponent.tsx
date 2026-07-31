import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { COLORS } from '@utils/constants';

interface WebViewComponentProps {
  uri?: string;
  html?: string;
}

export default function WebViewComponent({ uri, html }: WebViewComponentProps) {
  // For web platform, show a message since WebView doesn't work on web
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webFallback]}>
        <View style={styles.hexagon}>
          <Text style={styles.emoji}>🐺</Text>
        </View>
        <Text style={styles.title}>رفيق</Text>
        <Text style={styles.subtitle}>WebView غير متوفر على الويب</Text>
        <Text style={styles.hint}>استخدم تطبيق Expo Go على الجوال</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={html ? { html } : uri ? { uri } : { html: '<h1>No content</h1>' }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        mixedContentMode="always"
      />
    </View>
  );
}

import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  webFallback: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  hexagon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: 'rgba(14,165,233,0.1)',
    borderWidth: 2, borderColor: '#0ea5e9',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20
  },
  emoji: { fontSize: 36 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8', marginBottom: 4 },
  hint: { fontSize: 12, color: '#0ea5e9', marginTop: 8 }
});
