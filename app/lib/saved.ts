import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Saved = { id: string; day?: string };

const useSaved = create<{
	saved: Saved[];
	toggleSaved: (saved: Saved) => void;
	isSaved: (id: string) => boolean;
	updateDay: (id: string, day?: string) => void;
	getDay: (id: string) => string | undefined;
}>()(
	persist(
		(set, get) => ({
			saved: [],
			toggleSaved: (saved) =>
				set((state) => ({
					saved: state.saved.includes(saved)
						? state.saved.filter((s) => s.id !== saved.id)
						: [...state.saved, saved],
				})),
			isSaved: (id) => get().saved.some((s) => s.id === id),
			updateDay: (id, day) =>
				set((state) => ({
					saved: state.saved.map((s) => (s.id === id ? { ...s, day } : s)),
				})),
			getDay: (id) => get().saved.find((s) => s.id === id)?.day,
		}),
		{
			name: "saved",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useSaved;
