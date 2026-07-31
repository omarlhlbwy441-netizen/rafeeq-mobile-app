"""Rafeeq Game Engine — UI System (Unity Canvas/UGUI architecture)"""
import * as THREE from "three";

export type UIAnchor = "topLeft" | "topCenter" | "topRight" | "middleLeft" | "middleCenter" | "middleRight" | "bottomLeft" | "bottomCenter" | "bottomRight" | "stretch";
export type UIPivot = "topLeft" | "top" | "topRight" | "left" | "center" | "right" | "bottomLeft" | "bottom" | "bottomRight";

export interface RectTransform {
  anchorMin: [number, number];
  anchorMax: [number, number];
  anchoredPosition: [number, number];
  sizeDelta: [number, number];
  pivot: [number, number];
  rotation: number;
  scale: [number, number];
}

export interface UIElement {
  id: string;
  name: string;
  type: "canvas" | "panel" | "text" | "image" | "button" | "slider" | "toggle" | "input" | "scrollbar" | "dropdown" | "scrollView";
  parent: string | null;
  children: string[];
  rectTransform: RectTransform;
  visible: boolean;
  interactable: boolean;
  color: string;
  alpha: number;
  raycastTarget: boolean;
  components: UIComponent[];
}

export interface UIComponent {
  type: string;
  properties: Record<string, any>;
}

export class RafeeqCanvas {
  id: string;
  name: string;
  renderMode: "screenSpaceOverlay" | "screenSpaceCamera" | "worldSpace" = "screenSpaceOverlay";
  sortOrder: number = 0;
  pixelPerfect: boolean = false;
  scaleFactor: number = 1;
  referenceResolution: [number, number] = [1920, 1080];
  screenMatchMode: "matchWidthOrHeight" | "expand" | "shrink" = "matchWidthOrHeight";
  matchWidthOrHeight: number = 0.5;
  elements: Map<string, UIElement> = new Map();
  private rootElements: string[] = [];

  constructor(name: string = "Canvas") {
    this.id = `canvas_${Date.now()}`;
    this.name = name;
  }

  createElement(type: UIElement["type"], name: string, parent: string | null = null): UIElement {
    const id = `ui_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const element: UIElement = {
      id,
      name,
      type,
      parent,
      children: [],
      rectTransform: {
        anchorMin: [0.5, 0.5],
        anchorMax: [0.5, 0.5],
        anchoredPosition: [0, 0],
        sizeDelta: [100, 100],
        pivot: [0.5, 0.5],
        rotation: 0,
        scale: [1, 1],
      },
      visible: true,
      interactable: true,
      color: "#ffffff",
      alpha: 1,
      raycastTarget: true,
      components: [],
    };

    this.elements.set(id, element);
    if (parent) {
      const parentEl = this.elements.get(parent);
      if (parentEl) parentEl.children.push(id);
    } else {
      this.rootElements.push(id);
    }

    return element;
  }

  createPanel(name: string, parent: string | null = null): UIElement {
    const panel = this.createElement("panel", name, parent);
    panel.rectTransform.anchorMin = [0, 0];
    panel.rectTransform.anchorMax = [1, 1];
    panel.rectTransform.anchoredPosition = [0, 0];
    panel.rectTransform.sizeDelta = [0, 0];
    panel.color = "#1a1a2e";
    panel.alpha = 0.9;
    return panel;
  }

  createText(name: string, text: string, parent: string | null = null): UIElement {
    const textEl = this.createElement("text", name, parent);
    textEl.components.push({
      type: "Text",
      properties: {
        text,
        fontSize: 14,
        fontStyle: "normal",
        alignment: "center",
        color: "#ffffff",
        lineSpacing: 1.2,
        richText: true,
        overflow: "overflow",
      },
    });
    return textEl;
  }

  createButton(name: string, text: string, parent: string | null = null): UIElement {
    const btn = this.createElement("button", name, parent);
    btn.rectTransform.sizeDelta = [120, 40];
    btn.color = "#6366f1";
    btn.components.push({
      type: "Button",
      properties: {
        text,
        transition: "colorTint",
        colors: {
          normal: "#6366f1",
          highlighted: "#818cf8",
          pressed: "#4f46e5",
          disabled: "#374151",
        },
        onClick: null,
      },
    });
    return btn;
  }

  createImage(name: string, sprite: string, parent: string | null = null): UIElement {
    const img = this.createElement("image", name, parent);
    img.components.push({
      type: "Image",
      properties: {
        sprite,
        color: "#ffffff",
        type: "simple",
        preserveAspect: false,
        fillCenter: true,
      },
    });
    return img;
  }

  createSlider(name: string, min: number = 0, max: number = 1, parent: string | null = null): UIElement {
    const slider = this.createElement("slider", name, parent);
    slider.rectTransform.sizeDelta = [160, 20];
    slider.components.push({
      type: "Slider",
      properties: {
        min,
        max,
        value: min,
        wholeNumbers: false,
        direction: "leftToRight",
        fillRect: null,
        handleRect: null,
        onValueChanged: null,
      },
    });
    return slider;
  }

  createToggle(name: string, text: string, parent: string | null = null): UIElement {
    const toggle = this.createElement("toggle", name, parent);
    toggle.rectTransform.sizeDelta = [120, 30];
    toggle.components.push({
      type: "Toggle",
      properties: {
        text,
        isOn: false,
        toggleTransition: "fade",
        graphic: null,
        onValueChanged: null,
      },
    });
    return toggle;
  }

  createInputField(name: string, placeholder: string, parent: string | null = null): UIElement {
    const input = this.createElement("input", name, parent);
    input.rectTransform.sizeDelta = [200, 36];
    input.color = "#1a1a2e";
    input.components.push({
      type: "InputField",
      properties: {
        text: "",
        placeholder,
        characterLimit: 0,
        contentType: "standard",
        lineType: "singleLine",
        caretBlinkRate: 0.85,
        onValueChanged: null,
        onEndEdit: null,
      },
    });
    return input;
  }

  setAnchor(elementId: string, anchor: UIAnchor): void {
    const el = this.elements.get(elementId);
    if (!el) return;

    const anchors: Record<UIAnchor, [[number, number], [number, number]]> = {
      topLeft: [[0, 1], [0, 1]],
      topCenter: [[0.5, 1], [0.5, 1]],
      topRight: [[1, 1], [1, 1]],
      middleLeft: [[0, 0.5], [0, 0.5]],
      middleCenter: [[0.5, 0.5], [0.5, 0.5]],
      middleRight: [[1, 0.5], [1, 0.5]],
      bottomLeft: [[0, 0], [0, 0]],
      bottomCenter: [[0.5, 0], [0.5, 0]],
      bottomRight: [[1, 0], [1, 0]],
      stretch: [[0, 0], [1, 1]],
    };

    const [min, max] = anchors[anchor];
    el.rectTransform.anchorMin = min;
    el.rectTransform.anchorMax = max;
  }

  setPivot(elementId: string, pivot: UIPivot): void {
    const el = this.elements.get(elementId);
    if (!el) return;

    const pivots: Record<UIPivot, [number, number]> = {
      topLeft: [0, 1],
      top: [0.5, 1],
      topRight: [1, 1],
      left: [0, 0.5],
      center: [0.5, 0.5],
      right: [1, 0.5],
      bottomLeft: [0, 0],
      bottom: [0.5, 0],
      bottomRight: [1, 0],
    };

    el.rectTransform.pivot = pivots[pivot];
  }

  destroyElement(elementId: string): void {
    const el = this.elements.get(elementId);
    if (!el) return;

    // Remove from parent
    if (el.parent) {
      const parent = this.elements.get(el.parent);
      if (parent) {
        parent.children = parent.children.filter((id) => id !== elementId);
      }
    } else {
      this.rootElements = this.rootElements.filter((id) => id !== elementId);
    }

    // Destroy children recursively
    el.children.forEach((childId) => this.destroyElement(childId));

    this.elements.delete(elementId);
  }

  getElement(id: string): UIElement | undefined {
    return this.elements.get(id);
  }

  findElement(name: string): UIElement | undefined {
    for (const el of this.elements.values()) {
      if (el.name === name) return el;
    }
    return undefined;
  }

  serialize(): object {
    return {
      id: this.id,
      name: this.name,
      renderMode: this.renderMode,
      sortOrder: this.sortOrder,
      elements: Array.from(this.elements.values()),
    };
  }
}
