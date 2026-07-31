import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Agent } from '@types';
import { COLORS } from '@utils/constants';

interface AgentCardProps {
  agent: Agent;
  onPress: () => void;
  isActive: boolean;
}

export default function AgentCard({ agent, onPress, isActive }: AgentCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, isActive && styles.active]}>
      <View style={[styles.iconContainer, { backgroundColor: agent.color + '20' }]}>
        <Ionicons name={agent.icon as any} size={28} color={agent.color} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{agent.name}</Text>
        <Text style={styles.role}>{agent.role}</Text>
        <Text style={styles.desc} numberOfLines={1}>{agent.description}</Text>
      </View>
      <View style={[styles.status, { backgroundColor: agent.color + '30' }]}>
        <View style={[styles.dot, { backgroundColor: agent.color }]} />
        <Text style={[styles.statusText, { color: agent.color }]}>
          {agent.status === 'active' ? 'نشط' : agent.status === 'busy' ? 'مشغول' : 'خامل'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  active: {
    borderColor: COLORS.primary,
    borderWidth: 2
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    flex: 1,
    marginLeft: 12
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text
  },
  role: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 2
  },
  desc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600'
  }
});
