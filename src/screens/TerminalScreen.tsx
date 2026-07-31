import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Terminal from '@components/Terminal';
import { useApp } from '@context/AppContext';
import { COLORS } from '@utils/constants';

export default function TerminalScreen() {
  const { state, dispatch } = useApp();
  const [output, setOutput] = useState<string[]>([
    '🐺 Rafeeq Kernel Terminal v2.3.0',
    'Type "help" for available commands',
    '-----------------------------------'
  ]);

  const handleCommand = (cmd: string) => {
    const newOutput = [...output, `> ${cmd}`];

    switch (cmd.toLowerCase()) {
      case 'help':
        newOutput.push(
          'Available commands:',
          '  agents    - List active agents',
          '  status    - System status',
          '  evolve    - Trigger evolution',
          '  github    - GitHub status',
          '  db        - Database info',
          '  health    - Health check',
          '  clear     - Clear terminal',
          '  version   - Show version'
        );
        break;
      case 'agents':
        newOutput.push('Active agents:', ...state.activeAgents.map(a => `  • ${a}`));
        break;
      case 'status':
        newOutput.push('System Status: ONLINE', `Theme: ${state.theme}`, `Lang: ${state.language}`);
        break;
      case 'evolve':
        newOutput.push('Triggering self-evolution cycle...', '✓ Evolution engine started');
        dispatch({ type: 'ADD_LOG', payload: 'EVOLUTION: Triggered from terminal' });
        break;
      case 'github':
        newOutput.push('GitHub Manager: CONNECTED', 'Repos: dtr-hjin, dtr-n, dtr2, wolf-ai');
        break;
      case 'db':
        newOutput.push('PostgreSQL: CONNECTED', 'Redis: CONNECTED', 'Tables: 6');
        break;
      case 'health':
        newOutput.push('CPU: 45%', 'Memory: 62%', 'Uptime: 3d 5h 12m', 'Status: HEALTHY');
        break;
      case 'clear':
        newOutput.length = 0;
        newOutput.push('🐺 Rafeeq Kernel Terminal v2.3.0', 'Terminal cleared.');
        break;
      case 'version':
        newOutput.push('Rafeeq Kernel v2.3.0', 'Build: 2026.07.29', 'Platform: Expo/React Native');
        break;
      default:
        newOutput.push(`Command not found: ${cmd}`, 'Type "help" for available commands');
    }

    setOutput(newOutput);
    dispatch({ type: 'ADD_LOG', payload: `Terminal: ${cmd}` });
  };

  return (
    <View style={styles.container}>
      <Terminal onCommand={handleCommand} output={output} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background }
});
