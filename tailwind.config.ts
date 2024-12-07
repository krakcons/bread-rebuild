import { type Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	content: ["./app/**/*.tsx"],
	theme: {
		extend: {
			colors: {
				primary: "rgb(var(--color-primary))",
				"primary-background": "rgba(var(--color-primary), 0.1)",
				secondary: "rgb(var(--color-secondary))",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
