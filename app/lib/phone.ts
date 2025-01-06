export const formatPhoneNumber = (phone: string) => {
	// Remove any spaces and non-numeric characters (except '+')
	const cleaned = phone.replace(/[^\d+]/g, "");

	// Check if number includes country code
	const hasCountryCode = cleaned.startsWith("+1") || cleaned.startsWith("1");
	const prefix = hasCountryCode ? "+1-" : "";
	const digits = hasCountryCode
		? cleaned.slice(cleaned.startsWith("+") ? 2 : 1)
		: cleaned;

	// Format as +1 XXX-XXX-XXXX or XXX-XXX-XXXX
	return `${prefix}${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};
