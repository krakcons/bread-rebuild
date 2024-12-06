import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useSaved = create<{
	savedIds: string[];
	setSavedIds: (ids: string[]) => void;
}>()(
	persist(
		(set) => ({
			savedIds: [],
			setSavedIds: (ids) => set({ savedIds: ids }),
		}),
		{
			name: "saved",
			storage: createJSONStorage(() => localStorage),
		}
	)
);

export default useSaved;
