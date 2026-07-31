import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Header from '@components/Header';
import AgentCard from '@components/AgentCard';
import { useApp } from '@context/AppContext';
import { AGENTS } from '@utils/constants';
import { COLORS } from '@utils/constants';

export default function AgentsScreen() {
  const { state, dispatch } = useApp();

  const toggleAgent = (agentId: string) => {
    const isActive = state.activeAgents.includes(agentId);
    if (isActive) {
      dispatch({ type: 'DEACTIVATE_AGENT', payload: agentId });
      dispatch({ type: 'ADD_LOG', payload: `Agent ${agentId} deactivated` });
    } else {
      dispatch({ type: 'ACTIVATE_AGENT', payload: agentId });
      dispatch({ type: 'ADD_LOG', payload: `Agent ${agentId} activated` });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="الوكلاء الذكيون" />
      <ScrollView>
        <Text style={styles.subtitle}>10+ وكيل متخصص لخدمات مختلفة</Text>
        {AGENTS.map(agent => (
          <AgentCard
            key={agent.id}
            agent={{ ...agent, status: state.activeAgents.includes(agent.id) ? 'active' : 'idle' as any }}
            isActive={state.activeAgents.includes(agent.id)}
            onPress={() => toggleAgent(agent.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  subtitle: { color: COLORS.textMuted, textAlign: 'center', marginVertical: 12, fontSize: 13 }
});
