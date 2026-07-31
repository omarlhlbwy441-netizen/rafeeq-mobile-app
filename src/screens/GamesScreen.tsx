import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import * as THREE from "three";
import { useAuth } from "../context/AuthContext";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

interface SceneObject {
  id: string;
  name: string;
  type: "mesh" | "light" | "camera" | "particle";
  mesh: THREE.Object3D;
  selected: boolean;
}

export default function GamesScreen() {
  const { isAuthenticated } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTool, setSelectedTool] = useState<"select" | "move" | "rotate" | "scale">("select");
  const [selectedObject, setSelectedObject] = useState<SceneObject | null>(null);
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [projectName, setProjectName] = useState("Untitled Game");

  const rendererRef = useRef<Renderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsRef = useRef<Map<string, SceneObject>>(new Map());
  const animFrameRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  // ===== GL CONTEXT SETUP =====
  const onContextCreate = useCallback((gl: WebGLRenderingContext) => {
    const { drawingBufferWidth: w, drawingBufferHeight: h } = gl;

    // Renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(w, h);
    renderer.setClearColor(0x0a0a0f);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.Fog(0x0a0a0f, 10, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.set(5, 5, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Lighting
    const ambient = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Grid
    const grid = new THREE.GridHelper(50, 50, 0x2a2a3e, 0x1a1a2e);
    scene.add(grid);

    // Default cube
    addMeshToScene("Cube", "box", 0x6366f1, [0, 0.5, 0]);

    // Render loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();

      if (isPlaying) {
        // Game logic here
        objectsRef.current.forEach((obj) => {
          if (obj.type === "mesh" && obj.mesh.userData.rotating) {
            obj.mesh.rotation.y += delta;
          }
        });
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  }, [isPlaying]);

  // ===== OBJECT MANAGEMENT =====
  const addMeshToScene = (name: string, shape: string, color: number, position: [number, number, number]) => {
    const scene = sceneRef.current;
    if (!scene) return;

    let geometry: THREE.BufferGeometry;
    switch (shape) {
      case "sphere": geometry = new THREE.SphereGeometry(0.5, 32, 32); break;
      case "cylinder": geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32); break;
      case "cone": geometry = new THREE.ConeGeometry(0.5, 1, 32); break;
      case "torus": geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100); break;
      case "plane": geometry = new THREE.PlaneGeometry(2, 2); break;
      default: geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    const material = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const id = `obj_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const obj: SceneObject = { id, name, type: "mesh", mesh, selected: false };
    objectsRef.current.set(id, obj);
    setObjects((prev) => [...prev, obj]);
    setSelectedObject(obj);
  };

  const addLightToScene = (type: "point" | "spot") => {
    const scene = sceneRef.current;
    if (!scene) return;

    let light: THREE.Light;
    if (type === "point") {
      light = new THREE.PointLight(0xffaa00, 1, 100);
    } else {
      light = new THREE.SpotLight(0xffffff, 1);
    }
    light.position.set(0, 5, 0);
    scene.add(light);

    const id = `light_${Date.now()}`;
    const obj: SceneObject = { id, name: `${type} Light`, type: "light", mesh: light, selected: false };
    objectsRef.current.set(id, obj);
    setObjects((prev) => [...prev, obj]);
  };

  const addParticleSystem = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    const count = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const id = `particle_${Date.now()}`;
    const obj: SceneObject = { id, name: "Particle System", type: "particle", mesh: particles, selected: false };
    objectsRef.current.set(id, obj);
    setObjects((prev) => [...prev, obj]);
  };

  const deleteSelected = () => {
    if (!selectedObject) return;
    const scene = sceneRef.current;
    if (!scene) return;

    scene.remove(selectedObject.mesh);
    objectsRef.current.delete(selectedObject.id);
    setObjects((prev) => prev.filter((o) => o.id !== selectedObject.id));
    setSelectedObject(null);
  };

  const updateObjectTransform = (axis: "x" | "y" | "z", value: number, transform: "position" | "rotation" | "scale") => {
    if (!selectedObject) return;
    const mesh = selectedObject.mesh;
    const current = mesh[transform];
    current[axis] = value;
    mesh[transform].set(current.x, current.y, current.z);
    setObjects([...objects]);
  };

  const duplicateSelected = () => {
    if (!selectedObject || selectedObject.type !== "mesh") return;
    const pos = selectedObject.mesh.position;
    addMeshToScene(
      `${selectedObject.name} (Copy)`,
      "box",
      (selectedObject.mesh as THREE.Mesh).material instanceof THREE.MeshStandardMaterial
        ? ((selectedObject.mesh as THREE.Mesh).material as THREE.MeshStandardMaterial).color.getHex()
        : 0x6366f1,
      [pos.x + 1.5, pos.y, pos.z]
    );
  };

  // ===== CAMERA CONTROLS =====
  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(5, 5, 10);
      cameraRef.current.lookAt(0, 0, 0);
    }
  };

  const zoomCamera = (factor: number) => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(factor);
    }
  };

  // ===== PLAY/STOP =====
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    objectsRef.current.forEach((obj) => {
      if (obj.type === "mesh") {
        obj.mesh.userData.rotating = !isPlaying;
      }
    });
  };

  // ===== UI =====
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Please login to use the Game Engine</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎮 {projectName}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.playBtn, isPlaying && styles.playing]} onPress={togglePlay}>
            <Text style={styles.playBtnText}>{isPlaying ? "⏹ Stop" : "▶ Play"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowProjectsModal(true)}>
            <Text style={styles.iconBtnText}>📁</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        {(["select", "move", "rotate", "scale"] as const).map((tool) => (
          <TouchableOpacity
            key={tool}
            style={[styles.toolBtn, selectedTool === tool && styles.toolActive]}
            onPress={() => setSelectedTool(tool)}
          >
            <Text style={styles.toolText}>
              {tool === "select" ? "🔍" : tool === "move" ? "↔️" : tool === "rotate" ? "🔄" : "📐"}
            </Text>
            <Text style={[styles.toolLabel, selectedTool === tool && styles.toolLabelActive]}>
              {tool}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.toolbarDivider} />
        <TouchableOpacity style={styles.toolBtn} onPress={() => setShowAddModal(true)}>
          <Text style={styles.toolText}>➕</Text>
          <Text style={styles.toolLabel}>Add</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolBtn} onPress={duplicateSelected}>
          <Text style={styles.toolText}>📋</Text>
          <Text style={styles.toolLabel}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolBtn, { backgroundColor: "#ef444420" }]} onPress={deleteSelected}>
          <Text style={styles.toolText}>🗑️</Text>
          <Text style={[styles.toolLabel, { color: "#ef4444" }]}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {/* Hierarchy Panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>📋 Hierarchy</Text>
          <FlatList
            data={objects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.hierarchyItem, item.selected && styles.hierarchySelected]}
                onPress={() => {
                  setSelectedObject(item);
                  setObjects(objects.map((o) => ({ ...o, selected: o.id === item.id })));
                }}
              >
                <Text style={styles.hierarchyIcon}>
                  {item.type === "mesh" ? "🧊" : item.type === "light" ? "💡" : item.type === "particle" ? "✨" : "📷"}
                </Text>
                <Text style={[styles.hierarchyText, item.selected && styles.hierarchyTextSelected]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.hierarchyList}
          />
        </View>

        {/* Viewport */}
        <View style={styles.viewport}>
          <GLView style={styles.glView} onContextCreate={onContextCreate} />

          {/* Viewport Overlay Controls */}
          <View style={styles.viewportOverlay}>
            <TouchableOpacity style={styles.vpBtn} onPress={resetCamera}>
              <Text style={styles.vpBtnText}>🏠</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.vpBtn} onPress={() => zoomCamera(0.9)}>
              <Text style={styles.vpBtnText}>🔍+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.vpBtn} onPress={() => zoomCamera(1.1)}>
              <Text style={styles.vpBtnText}>🔍-</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Inspector Panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>⚙️ Inspector</Text>
          <ScrollView>
            {selectedObject ? (
              <View style={styles.inspector}>
                <Text style={styles.inspectorHeader}>{selectedObject.name}</Text>
                <Text style={styles.inspectorType}>{selectedObject.type}</Text>

                {/* Transform */}
                <Text style={styles.inspectorSection}>Position</Text>
                {(["x", "y", "z"] as const).map((axis) => (
                  <View key={axis} style={styles.transformRow}>
                    <Text style={[styles.axisLabel, { color: axis === "x" ? "#ef4444" : axis === "y" ? "#10b981" : "#6366f1" }]}>
                      {axis.toUpperCase()}
                    </Text>
                    <TextInput
                      style={styles.transformInput}
                      value={selectedObject.mesh.position[axis].toFixed(2)}
                      keyboardType="numeric"
                      onChangeText={(v) => updateObjectTransform(axis, parseFloat(v) || 0, "position")}
                    />
                  </View>
                ))}

                <Text style={styles.inspectorSection}>Rotation</Text>
                {(["x", "y", "z"] as const).map((axis) => (
                  <View key={axis} style={styles.transformRow}>
                    <Text style={[styles.axisLabel, { color: axis === "x" ? "#ef4444" : axis === "y" ? "#10b981" : "#6366f1" }]}>
                      {axis.toUpperCase()}
                    </Text>
                    <TextInput
                      style={styles.transformInput}
                      value={selectedObject.mesh.rotation[axis].toFixed(2)}
                      keyboardType="numeric"
                      onChangeText={(v) => updateObjectTransform(axis, parseFloat(v) || 0, "rotation")}
                    />
                  </View>
                ))}

                <Text style={styles.inspectorSection}>Scale</Text>
                {(["x", "y", "z"] as const).map((axis) => (
                  <View key={axis} style={styles.transformRow}>
                    <Text style={[styles.axisLabel, { color: axis === "x" ? "#ef4444" : axis === "y" ? "#10b981" : "#6366f1" }]}>
                      {axis.toUpperCase()}
                    </Text>
                    <TextInput
                      style={styles.transformInput}
                      value={selectedObject.mesh.scale[axis].toFixed(2)}
                      keyboardType="numeric"
                      onChangeText={(v) => updateObjectTransform(axis, parseFloat(v) || 0, "scale")}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.emptyPanel}>Select an object to edit</Text>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Add Object Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Add Object</Text>

            <Text style={styles.modalSection}>3D Shapes</Text>
            <View style={styles.modalGrid}>
              {[
                { icon: "🧊", label: "Cube", shape: "box", color: 0x6366f1 },
                { icon: "🔵", label: "Sphere", shape: "sphere", color: 0x10b981 },
                { icon: "🛢️", label: "Cylinder", shape: "cylinder", color: 0xf59e0b },
                { icon: "🔺", label: "Cone", shape: "cone", color: 0xef4444 },
                { icon: "🍩", label: "Torus", shape: "torus", color: 0x8b5cf6 },
                { icon: "⬜", label: "Plane", shape: "plane", color: 0x64748b },
              ].map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={styles.modalItem}
                  onPress={() => {
                    addMeshToScene(item.label, item.shape, item.color, [0, 0.5, 0]);
                    setShowAddModal(false);
                  }}
                >
                  <Text style={styles.modalItemIcon}>{item.icon}</Text>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalSection}>Lighting & FX</Text>
            <View style={styles.modalGrid}>
              <TouchableOpacity style={styles.modalItem} onPress={() => { addLightToScene("point"); setShowAddModal(false); }}>
                <Text style={styles.modalItemIcon}>💡</Text>
                <Text style={styles.modalItemText}>Point Light</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => { addLightToScene("spot"); setShowAddModal(false); }}>
                <Text style={styles.modalItemIcon}>🔦</Text>
                <Text style={styles.modalItemText}>Spot Light</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalItem} onPress={() => { addParticleSystem(); setShowAddModal(false); }}>
                <Text style={styles.modalItemIcon}>✨</Text>
                <Text style={styles.modalItemText}>Particles</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.modalClose} onPress={() => setShowAddModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0f" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
    backgroundColor: "#12121a",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  headerActions: { flexDirection: "row", gap: 8 },
  playBtn: {
    backgroundColor: "#10b981",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  playing: { backgroundColor: "#ef4444" },
  playBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  iconBtn: {
    backgroundColor: "#1e1e2e",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  iconBtnText: { fontSize: 16 },

  // Toolbar
  toolbar: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
    backgroundColor: "#12121a",
    gap: 4,
  },
  toolBtn: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  toolActive: { backgroundColor: "#6366f130" },
  toolText: { fontSize: 16 },
  toolLabel: { fontSize: 10, color: "#888", marginTop: 2, textTransform: "capitalize" },
  toolLabelActive: { color: "#6366f1", fontWeight: "700" },
  toolbarDivider: { width: 1, backgroundColor: "#1e1e2e", marginHorizontal: 4 },

  // Main
  main: { flex: 1, flexDirection: "row" },

  // Panels
  panel: {
    width: 180,
    backgroundColor: "#12121a",
    borderRightWidth: 1,
    borderRightColor: "#1e1e2e",
  },
  panelTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e1e2e",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  hierarchyList: { flex: 1 },
  hierarchyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a2e",
  },
  hierarchySelected: { backgroundColor: "#6366f120" },
  hierarchyIcon: { fontSize: 14, marginRight: 6 },
  hierarchyText: { fontSize: 12, color: "#ccc" },
  hierarchyTextSelected: { color: "#6366f1", fontWeight: "700" },

  // Viewport
  viewport: { flex: 1, position: "relative" },
  glView: { flex: 1 },
  viewportOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    flexDirection: "row",
    gap: 6,
  },
  vpBtn: {
    backgroundColor: "#1e1e2e",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  vpBtnText: { fontSize: 14 },

  // Inspector
  inspector: { padding: 10 },
  inspectorHeader: { fontSize: 14, fontWeight: "700", color: "#fff" },
  inspectorType: { fontSize: 11, color: "#888", marginBottom: 12 },
  inspectorSection: {
    fontSize: 11,
    fontWeight: "700",
    color: "#888",
    marginTop: 12,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  transformRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  axisLabel: {
    width: 20,
    fontSize: 11,
    fontWeight: "800",
  },
  transformInput: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 6,
    padding: 6,
    color: "#fff",
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  emptyPanel: { color: "#888", textAlign: "center", marginTop: 20, fontSize: 12 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "#000000dd",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modal: {
    backgroundColor: "#12121a",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#1e1e2e",
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#fff", marginBottom: 16 },
  modalSection: {
    fontSize: 12,
    fontWeight: "700",
    color: "#888",
    marginTop: 12,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  modalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  modalItem: {
    width: "30%",
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2a2a3e",
  },
  modalItemIcon: { fontSize: 24, marginBottom: 4 },
  modalItemText: { fontSize: 11, color: "#fff", fontWeight: "600" },
  modalClose: {
    marginTop: 16,
    padding: 12,
    alignItems: "center",
  },
  modalCloseText: { color: "#888", fontSize: 14 },

  empty: { color: "#888", textAlign: "center", marginTop: 40, fontSize: 16 },
});
