import { useMemo } from "react";
// import { useTranslation } from "react-i18next";

export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const frenchDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export type DaySchedule = {
	day: string;
	open: string;
	close: string;
};

const convertTime = (time: string): string => {
	// Handle "0000" and "2400" as midnight
	if (time === "0000" || time === "2400") {
		return "0000";
	}

	const match24hr = time.match(/([01]\d|2[0-3])[0-5]\d/); // 0100, 0200, 0300, ..., 2300
	if (match24hr) {
		return time;
	}

	const matchTime = time.match(/(\d{1,2})(?::?(\d{2}))?\s*([ap]m)?/i); // 1pm, 12pm, 1am, 12am, 8:30, 9:30
	if (matchTime) {
		const [, hours, minutes, meridiem] = matchTime;

		if (!hours) {
			throw new Error(`Invalid time: ${time}`);
		}

		let hour = parseInt(hours, 10);
		let minute = minutes ? parseInt(minutes, 10) : 0;

		// Handle midnight (12:00 am)
		if (meridiem && meridiem.toLowerCase() === "am" && hour === 12) {
			hour = 0;
		} else if (meridiem && meridiem.toLowerCase() === "pm" && hour !== 12) {
			hour += 12;
		}

		return (
			hour.toString().padStart(2, "0") +
			minute.toString().padStart(2, "0")
		);
	}

	throw new Error(`Invalid time: ${time}`);
};
const formatTime = (time: string, locale: string): string => {
	const hour = parseInt(time.slice(0, 2), 10);
	const minute = time.slice(2);

	if (locale === "fr") {
		return `${hour}h${minute.padStart(2, "0")}`;
	} else {
		const period = hour < 12 ? "am" : "pm";

		// Adjust hour for midnight
		const formattedHour = hour === 0 ? 12 : hour % 12 || 12;

		return `${formattedHour}:${minute.padStart(2, "0")} ${period}`;
	}
};

export const parseSchedule = (
	hoursString: string,
	locale: string,
): DaySchedule[] => {
	const scheduleArray = hoursString
		.split(";")
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
	const result: DaySchedule[] = [];

	for (const s of scheduleArray) {
		let day = s.slice(0, 3);
		const [open, close] = s.slice(3).replace(/\s/g, "").split("-");

		if (!day || !open || !close) {
			throw new Error(`Invalid schedule string: ${s}`);
		}

		if (!days.includes(day)) {
			throw new Error(`Invalid day: ${day}`);
		}

		if (locale === "fr") {
			const frenchDay = frenchDays[days.indexOf(day)];
			if (!frenchDay) throw new Error(`Invalid day: ${day}`);
			day = frenchDay;
		}

		result.push({
			day,
			open: formatTime(convertTime(open), locale),
			close: formatTime(convertTime(close), locale),
		});
	}

	return result;
};

export const formatScheduleToString = (daySchedule: DaySchedule[]): string => {
	return daySchedule
		.map(({ day, open, close }) => `${day} ${open} - ${close};`)
		.join(" ");
};

export const useHours = (hoursString: string) => {
	// const { i18n } = useTranslation();
	return useMemo(() => {
		try {
			return parseSchedule(hoursString, "en");
		} catch (e) {
			console.error(e);
			return [];
		}
	}, [hoursString]);
};
