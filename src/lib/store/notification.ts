import { create } from "zustand";

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
}

export const NotificationStore = create<NotificationState>((set, get) => ({
  limit: 1,
  position: "top-center",
  //   setProps: ({ position, limit }) => set({ position, limit }),
  setProps: ({ position, limit }) => {
    const currentState = get();
    set({
      position: position ?? currentState.position,
      limit: limit ?? currentState.limit,
    });
  },
}));
