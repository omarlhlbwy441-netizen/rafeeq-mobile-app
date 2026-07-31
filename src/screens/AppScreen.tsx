import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import WebViewComponent from '@components/WebViewComponent';

const APP_HTML = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>رفيق - Rafeeq</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #0a0a0f; color: #e2e8f0; font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh; overflow-x: hidden;
}
.hero {
  text-align: center; padding: 40px 20px;
  background: linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0f172a 100%);
}
.logo {
  width: 80px; height: 80px; margin: 0 auto 20px;
  background: linear-gradient(135deg, #0ea5e9, #8b5cf6, #10b981);
  border-radius: 24px; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 40px rgba(14,165,233,0.3);
  font-size: 36px;
}
h1 { font-size: 28px; margin-bottom: 8px; background: linear-gradient(90deg, #0ea5e9, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.subtitle { color: #94a3b8; font-size: 14px; }
.grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  padding: 20px; max-width: 600px; margin: 0 auto;
}
.card {
  background: #111118; border: 1px solid #1e293b; border-radius: 16px;
  padding: 20px; text-align: center; transition: all 0.3s;
}
.card:hover { border-color: #0ea5e9; transform: translateY(-2px); }
.card-icon { font-size: 28px; margin-bottom: 8px; }
.card-title { font-size: 14px; font-weight: bold; margin-bottom: 4px; }
.card-desc { font-size: 11px; color: #64748b; }
.footer {
  text-align: center; padding: 30px; color: #475569; font-size: 12px;
}
</style>
</head>
<body>
<div class="hero">
  <div class="logo">🐺</div>
  <h1>رفيق</h1>
  <p class="subtitle">Your Intelligent AI Companion</p>
</div>
<div class="grid">
  <div class="card"><div class="card-icon">🤖</div><div class="card-title">الوكلاء</div><div class="card-desc">10+ وكيل ذكي</div></div>
  <div class="card"><div class="card-icon">🧬</div><div class="card-title">التطور</div><div class="card-desc">تطور ذاتي</div></div>
  <div class="card"><div class="card-icon">🐙</div><div class="card-title">GitHub</div><div class="card-desc">تكامل تلقائي</div></div>
  <div class="card"><div class="card-icon">🎮</div><div class="card-title">الألعاب</div><div class="card-desc">محرك ألعاب</div></div>
  <div class="card"><div class="card-icon">🎬</div><div class="card-title">الفيديو</div><div class="card-desc">توليد فيديو</div></div>
  <div class="card"><div class="card-icon">🌐</div><div class="card-title">المواقع</div><div class="card-desc">بناء مواقع</div></div>
  <div class="card"><div class="card-icon">🗄️</div><div class="card-title">قاعدة البيانات</div><div class="card-desc">PostgreSQL + Redis</div></div>
  <div class="card"><div class="card-icon">📊</div><div class="card-title">المراقبة</div><div class="card-desc">Grafana + Prometheus</div></div>
</div>
<div class="footer">
  Rafeeq Kernel v2.3.0 | Built with ❤️ in Egypt 🇪🇬
</div>
</body>
</html>
`;

export default function AppScreen() {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webTitle}>رفيق</Text>
        <Text style={styles.webSubtitle}>استخدم Expo Go على الجوال لتجربة التطبيق الكامل</Text>
      </View>
    );
  }
  return <WebViewComponent html={APP_HTML} />;
}

const styles = StyleSheet.create({
  webContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0f' },
  webTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 8 },
  webSubtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', paddingHorizontal: 40 }
});
