import { useEffect, useState } from "react";

export const useDebounce = <T>(
	value: T,
	delay?: number
): { debouncedValue: T; isPending: boolean } => {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);
	const [isPending, setIsPending] = useState(true);

	useEffect(() => {
		setIsPending(true);
		const timer = setTimeout(() => {
			setDebouncedValue(value);
			setIsPending(false);
		}, delay || 500);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return { debouncedValue, isPending };
};
