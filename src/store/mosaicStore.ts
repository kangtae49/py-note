import type {PyMenuAction} from "@/models";
import type {MosaicNode} from "react-mosaic-component";
import {create} from "zustand/react";
// import {useFormState} from "react-dom";

// type MosaicAction = "add" | "remove" | "expand" | "collapse";

interface MosaicStore {
  mosaicValue: MosaicNode<PyMenuAction> | null;
  setMosaicValue: (value: MosaicNode<PyMenuAction> | null) => void;
  addView: (id: PyMenuAction) => void;
  removeView: (id: PyMenuAction) => void;
  maximizeView: (id: PyMenuAction) => void;
  minimizeView: (id: PyMenuAction) => void;
}

export const useMosaicStore = create<MosaicStore>((set, get) => ({
  mosaicValue: null,
  setMosaicValue: (value) => set({ mosaicValue: value }),
  addView: (id: PyMenuAction) => {
    console.log("addView", id);
    let current = get().mosaicValue;
    if (!current) {
      set({ mosaicValue: id });
      return;
    }

    const collectIds = (node: MosaicNode<PyMenuAction> | null): PyMenuAction[] => {
      if (!node) return [];
      if (typeof node === 'string') return [node];
      return [...collectIds(node.first), ...collectIds(node.second)];
    };
    const existingIds = collectIds(current);

    if (!existingIds.includes(id)) {
      current = {
        direction: 'row',
        first: id,
        second: current,
      }
    }

    const updateSplit = (node: MosaicNode<PyMenuAction> | null): MosaicNode<PyMenuAction> | null => {
      if (!node) return null;
      console.log("updateSplit", node);

      if (typeof node === "string") {
        return node;
      }


      const first = updateSplit(node.first);
      const second = updateSplit(node.second);

      if (!first && !second) return null;
      if (!first) return second;
      if (!second) return first;


      let splitPercentage: number | undefined = undefined;
      if (typeof current !== 'string') {
        splitPercentage = current.splitPercentage;
        console.log('hello')
        if ((current.splitPercentage === 0 && current.first === id) || (current.splitPercentage === 100 && current.second === id)) {
          splitPercentage = 50;
        }
      }

      if (first === id || second === id) {
        return { ...node, splitPercentage: splitPercentage, first, second };
      }

      return { ...node, first, second };
    };
    set({ mosaicValue: updateSplit(current) });

  },
  removeView: (id: PyMenuAction) => {
    const removeNode = (node: MosaicNode<PyMenuAction> | null): MosaicNode<PyMenuAction> | null => {
      if (!node) return null;
      if (typeof node === 'string') {
        return node === id ? null : node;
      }
      const first = removeNode(node.first);
      const second = removeNode(node.second);

      if (!first && !second) return null;
      if (!first) return second;
      if (!second) return first;

      return { ...node, first, second };
    };

    const newValue = removeNode(get().mosaicValue);
    set({ mosaicValue: newValue });
  },
  maximizeView: (id: PyMenuAction) => {
    const updateSplit = (node: MosaicNode<PyMenuAction> | null): MosaicNode<PyMenuAction> | null => {
      if (!node) return null;

      if (typeof node === "string") {
        return node;
      }

      const first = updateSplit(node.first);
      const second = updateSplit(node.second);

      if (!first && !second) return null;
      if (!first) return second;
      if (!second) return first;

      if (first === id) {
        return { ...node, splitPercentage: 100, first, second };
      } else if(second === id) {
        return { ...node, splitPercentage: 0, first, second };
      }

      return { ...node, first, second };
    };

    set({ mosaicValue: updateSplit(get().mosaicValue) });
  },

  minimizeView: (id: PyMenuAction) => {
    const updateSplit = (node: MosaicNode<PyMenuAction> | null): MosaicNode<PyMenuAction> | null => {
      if (!node) return null;

      if (typeof node === "string") {
        return node;
      }

      const first = updateSplit(node.first);
      const second = updateSplit(node.second);

      if (!first && !second) return null;
      if (!first) return second;
      if (!second) return first;

      if (first === id) {
        return { ...node, splitPercentage: 0, first, second };
      } else if(second === id) {
        return { ...node, splitPercentage: 100, first, second };
      }

      return { ...node, first, second };
    };

    set({ mosaicValue: updateSplit(get().mosaicValue) });
  },

}));


