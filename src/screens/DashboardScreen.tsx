import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function DashboardScreen({ navigation }: any) {
  const { user, isAuthenticated } = useAuth();
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const data = await api.healthCheck();
      setHealth(data);
    } catch {
      setHealth({ status: "offline" });
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: "🏪", label: "My Store", screen: "Store", color: "#6366f1" },
    { icon: "👤", label: "Profile", screen: "Profile", color: "#10b981" },
    { icon: "⚙️", label: "Settings", screen: "Settings", color: "#f59e0b" },
    { icon: "📊", label: "Analytics", screen: "Analytics", color: "#8b5cf6" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Welcome back, {user?.full_name || user?.username || "Guest"}!
        </Text>
        <View style={[styles.statusBadge, health?.status === "healthy" ? styles.healthy : styles.offline]}>
          <Text style={styles.statusText}>
            {health?.status === "healthy" ? "🟢 Online" : "🔴 Offline"}
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="API Version" value={health?.version || "—"} />
        <StatCard label="Environment" value={health?.environment || "—"} />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.grid}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={[styles.card, { borderLeftColor: item.color, borderLeftWidth: 4 }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.cardIcon}>{item.icon}</Text>
            <Text style={styles.cardLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {user?.role === "admin" && (
        <>
          <Text style={styles.sectionTitle}>Admin</Text>
          <TouchableOpacity
            style={[styles.adminCard, { borderLeftColor: "#ef4444", borderLeftWidth: 4 }]}
            onPress={() => navigation.navigate("Admin")}
          >
            <Text style={styles.cardIcon}>🛡️</Text>
            <Text style={styles.cardLabel}>Admin Dashboard</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f" },
  header: {
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
  },
  greeting: { fontSize: 22, fontWeight: "800", color: "#fff" },
  statusBadge: {
    alignSelf: "flex-start",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  healthy: { backgroundColor: "#10b98120" },
  offline: { backgroundColor: "#ef444420" },
  statusText: { fontSize: 12, fontWeight: "700" },
  statsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#12121a",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  statValue: { fontSize: 18, fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: 12, color: "#888", marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#12121a",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardLabel: { fontSize: 14, fontWeight: "700", color: "#fff" },
  adminCard: {
    marginHorizontal: 16,
    backgroundColor: "#12121a",
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1e1e2e",
    marginBottom: 20,
  },
});
