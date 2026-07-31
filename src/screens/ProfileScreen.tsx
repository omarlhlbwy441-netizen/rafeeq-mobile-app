import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please login first</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.full_name?.[0] || user?.username?.[0] || "?"}
          </Text>
        </View>
        <Text style={styles.name}>{user?.full_name || user?.username}</Text>
        <Text style={styles.username}>@{user?.username}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{user?.role}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <InfoRow label="Email" value={user?.email} />
        <InfoRow label="Status" value={user?.is_active ? "Active" : "Inactive"} />
        <InfoRow label="User ID" value={String(user?.id)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate("Store")}
        >
          <Text style={styles.actionText}>🏪 My Store</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={[styles.actionText, styles.logoutText]}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f" },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: "700", color: "#fff" },
  name: { fontSize: 22, fontWeight: "700", color: "#fff" },
  username: { fontSize: 14, color: "#888", marginTop: 4 },
  badge: {
    marginTop: 8,
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: "#6366f1", fontSize: 12, fontWeight: "600" },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#1e1e2e" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2e",
  },
  rowLabel: { color: "#888", fontSize: 14 },
  rowValue: { color: "#fff", fontSize: 14, fontWeight: "500" },
  actionButton: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  actionText: { color: "#fff", fontSize: 15, fontWeight: "600" },
  logoutButton: { borderColor: "#ef4444" },
  logoutText: { color: "#ef4444" },
  emptyText: { color: "#888", textAlign: "center", marginTop: 40, fontSize: 16 },
  button: {
    backgroundColor: "#6366f1",
    marginHorizontal: 40,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
