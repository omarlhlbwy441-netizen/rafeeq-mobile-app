import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Store {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export default function StoreScreen() {
  const { isAuthenticated } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStore, setNewStore] = useState({ name: "", slug: "", description: "" });

  useEffect(() => {
    if (isAuthenticated) loadStores();
  }, [isAuthenticated]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const data = await api.myStores();
      setStores(data);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newStore.name || !newStore.slug) {
      Alert.alert("Error", "Name and slug are required");
      return;
    }
    try {
      await api.createStore(newStore.name, newStore.slug, newStore.description);
      setModalVisible(false);
      setNewStore({ name: "", slug: "", description: "" });
      loadStores();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Please login to manage your stores</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Stores</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ New Store</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#6366f1" style={{ marginTop: 40 }} />
      ) : stores.length === 0 ? (
        <Text style={styles.empty}>No stores yet. Create your first one!</Text>
      ) : (
        <FlatList
          data={stores}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSlug}>@{item.slug}</Text>
              <Text style={styles.cardDesc}>{item.description || "No description"}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.badge, item.is_active ? styles.active : styles.inactive]}>
                  {item.is_active ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Create Store</Text>
            <TextInput
              style={styles.input}
              placeholder="Store Name"
              placeholderTextColor="#888"
              value={newStore.name}
              onChangeText={(t) => setNewStore({ ...newStore, name: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Slug (unique identifier)"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={newStore.slug}
              onChangeText={(t) => setNewStore({ ...newStore, slug: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#888"
              multiline
              value={newStore.description}
              onChangeText={(t) => setNewStore({ ...newStore, description: t })}
            />
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
              <Text style={styles.buttonText}>Create Store</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#fff" },
  addBtn: { backgroundColor: "#6366f1", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: "#fff", fontWeight: "700" },
  empty: { color: "#888", textAlign: "center", marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: "#12121a",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  cardSlug: { fontSize: 13, color: "#6366f1", marginTop: 2 },
  cardDesc: { fontSize: 14, color: "#888", marginTop: 6 },
  cardFooter: { marginTop: 10 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontSize: 12 },
  active: { backgroundColor: "#10b98120", color: "#10b981" },
  inactive: { backgroundColor: "#ef444420", color: "#ef4444" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000cc",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 16 },
  input: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  button: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  cancel: { color: "#888", textAlign: "center", marginTop: 16, fontSize: 15 },
});
