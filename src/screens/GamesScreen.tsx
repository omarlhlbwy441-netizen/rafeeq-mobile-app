import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@components/Header';
import Card from '@components/Card';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function GamesScreen() {
  const { dispatch } = useApp();
  const [projects, setProjects] = useState([
    { id: '1', name: 'Wolf RPG', genre: 'RPG', engine: 'Unity', status: 'development', progress: 45 },
    { id: '2', name: 'Space Shooter', genre: 'Action', engine: 'Godot', status: 'testing', progress: 80 },
    { id: '3', name: 'Puzzle Mind', genre: 'Puzzle', engine: 'Phaser', status: 'planning', progress: 15 }
  ]);

  const createGame = () => {
    Alert.prompt('مشروع جديد', 'اسم اللعبة:', (name) => {
      if (name) {
        setProjects([...projects, {
          id: Date.now().toString(),
          name, genre: 'New', engine: 'Unity', status: 'planning', progress: 0
        }]);
        dispatch({ type: 'ADD_LOG', payload: `Game project created: ${name}` });
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Game Architect" rightIcon="add-circle-outline" />
      <ScrollView>
        <TouchableOpacity style={styles.createBtn} onPress={createGame}>
          <Ionicons name="game-controller" size={24} color="#fff" />
          <Text style={styles.createText}>إنشاء لعبة جديدة</Text>
        </TouchableOpacity>

        {projects.map(game => (
          <Card key={game.id}>
            <View style={styles.gameHeader}>
              <View style={styles.gameIcon}>
                <Ionicons name="game-controller" size={24} color="#f97316" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameMeta}>{game.genre} • {game.engine}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: game.status === 'development' ? '#0ea5e920' : game.status === 'testing' ? '#f59e0b20' : '#64748b20' }]}>
                <Text style={[styles.statusText, { color: game.status === 'development' ? '#0ea5e9' : game.status === 'testing' ? '#f59e0b' : '#64748b' }]}>
                  {game.status === 'development' ? 'تطوير' : game.status === 'testing' ? 'اختبار' : 'تخطيط'}
                </Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${game.progress}%`, backgroundColor: '#f97316' }]} />
            </View>
            <Text style={styles.progressText}>{game.progress}% مكتمل</Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#f97316', margin: 16, padding: 16, borderRadius: 16
  },
  createText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  gameHeader: { flexDirection: 'row', alignItems: 'center' },
  gameIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f9731620', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  gameName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  gameMeta: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 11, fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: COLORS.border, borderRadius: 3, marginTop: 12 },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, textAlign: 'right' }
});
