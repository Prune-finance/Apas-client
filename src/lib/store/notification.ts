import { create } from "zustand";
import { NotificationMeta } from "../hooks/notifications";

type Meta = NotificationMeta | undefined;
interface NotificationState {
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  limit: number;
  setProps: (props: {
    position?: NotificationState["position"];
    limit?: number;
  }) => void;
  meta: Meta;
  setMeta: (meta: Meta) => void;
}

export const NotificationStore = create<NotificationState>((set, get) => ({
  limit: 1,
  position: "top-center",
  setProps: ({ position, limit }) => {
    const currentState = get();
    set({
      position: position ?? currentState.position,
      limit: limit ?? currentState.limit,
    });
  },
  meta: undefined,
  setMeta: (meta) => set({ meta }),
}));
