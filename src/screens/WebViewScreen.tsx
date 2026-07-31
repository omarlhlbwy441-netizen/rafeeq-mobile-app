import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import WebViewComponent from '@components/WebViewComponent';
import { COLORS } from '@utils/constants';

export default function WebViewScreen() {
  const route = useRoute();
  const { uri, title } = route.params as any;

  return (
    <View style={styles.container}>
      <WebViewComponent uri={uri} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }
});
