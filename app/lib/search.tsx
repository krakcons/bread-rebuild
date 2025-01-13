import {
	Accessibility,
	Bus,
	Car,
	DollarSign,
	UtensilsCrossed,
} from "lucide-react";

export const filterIcons = {
	free: <DollarSign size={18} />,
	preparation: <UtensilsCrossed size={18} />,
	parking: <Car size={18} />,
	transit: <Bus size={18} />,
	wheelchair: <Accessibility size={18} />,
} as const;
