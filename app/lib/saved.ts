import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

type Saved = { id: string; day?: string; seen?: boolean };

// You can use @tanstack/store outside of React components too!
export const savedStore = new Store<Saved[]>(
	typeof window !== "undefined"
		? JSON.parse(localStorage.getItem("saved-meals") || "[]")
		: [],
);

savedStore.subscribe(() => {
	localStorage.setItem("saved-meals", JSON.stringify(savedStore.state));
});

export const toggleSaved = (id: string) => {
	savedStore.setState((saved) => {
		const isSaved = saved.some((s) => s.id === id);
		return isSaved
			? saved.filter((s) => s.id !== id)
			: [...saved, { id, seen: false }];
	});
};

export const updateDay = (id: string, day: string) => {
	savedStore.setState((saved) =>
		saved.map((s) => (s.id === id ? { ...s, day } : s)),
	);
};

export const resetSeen = () => {
	savedStore.setState((saved) => saved.map((s) => ({ ...s, seen: true })));
};

export const useSaved = () => {
	return useStore(savedStore, (saved) => saved);
};

export const useSavedResource = (id: string) => {
	return useStore(savedStore, (saved) => saved.find((s) => s.id === id));
};
