import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Saved = { id: string; day?: string; seen?: boolean };

const useSaved = create<{
	saved: Saved[];
	toggleSaved: (id: string) => void;
	isSaved: (id: string) => boolean;
	updateDay: (id: string, day?: string) => void;
	getDay: (id: string) => string | undefined;
	resetSeen: () => void;
}>()(
	persist(
		(set, get) => ({
			saved: [],
			unseen: [],
			toggleSaved: (id) => {
				const isSaved = get().saved.some((s) => s.id === id);
				set((state) => ({
					saved: isSaved
						? state.saved.filter((s) => s.id !== id)
						: [...state.saved, { id, seen: false }],
				}));
			},
			isSaved: (id) => get().saved.some((s) => s.id === id),
			updateDay: (id, day) =>
				set((state) => ({
					saved: state.saved.map((s) =>
						s.id === id ? { ...s, day } : s,
					),
				})),
			getDay: (id) => get().saved.find((s) => s.id === id)?.day,
			resetSeen: () =>
				set({
					saved: get().saved.map((s) => ({ ...s, seen: true })),
				}),
		}),
		{
			name: "saved",
			storage: createJSONStorage(() => localStorage),
		},
	),
);

export default useSaved;
