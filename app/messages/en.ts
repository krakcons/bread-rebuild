const en = {
	title: "Bread: Food Banks in Calgary",
	description:
		"Bread is a directory of food resources in the greater Calgary area.",
	common: {
		name: "Name",
		email: "Email",
		optional: "Optional",
		back: "Back",
		to: "to",
		bread: "Bread",
		submit: "Submit",
	},
	search: "Search",
	free: "Free",
	list: "List",
	map: "Map",
	address: "Address",
	fees: "Fees",
	phoneTypes: {
		phone: "Phone",
		fax: "Fax",
		"toll-free": "Toll Free",
		tty: "TTY",
	},
	eligibility: "Eligibility",
	info: "Information",
	accessibility: "Accessibility",
	applicationProcess: "Application Process",
	additionalInfo: "Additional Information",
	contact: "Contact",
	userEmail: "User Email",
	website: "Website",
	hours: "Hours",
	saved: {
		title: "My Saved",
		description:
			"You can save resources here to find them later. Press the print button above to print out your saved resources.",
		save: "Save",
		saved: "Saved",
	},
	print: "Print",
	viewMore: "View More",
	day: "Schedule",
	none: "None",
	clear: "Clear",
	parking: "Parking",
	preparation: "Preparation Required",
	transit: "Transit",
	edit: "Edit",
	wheelchair: "Wheelchair Accessible",
	filters: {
		title: "Filters",
		description:
			"Filter resources by the following options and dietary requirements.",
		free: "Free",
		preparation: "Preparation Required",
		parking: "Parking",
		transit: "Transit",
		wheelchair: "Wheelchair Accessible",
	},
	terms: "Terms of Use",
	privacy: "Privacy Policy",
	dietaryOptions: "Dietary Options",
	poweredBy: "Powered by",
	dietaryOptionTypes: {
		vegetarian: "Vegetarian",
		vegan: "Vegan",
		halal: "Halal",
		kosher: "Kosher",
		"renal-disease": "Renal Disease",
		"gluten-free": "Gluten-Free",
		celiac: "Celiac",
		baby: "Baby",
		pet: "Pet",
		other: "Other",
	},
	daysOfWeek: {
		unassigned: "Unassigned",
		open: "Open",
		closed: "Closed",
		short: {
			mon: "Mon",
			tue: "Tue",
			wed: "Wed",
			thu: "Thu",
			fri: "Fri",
			sat: "Sat",
			sun: "Sun",
		},
		long: {
			mon: "Monday",
			tue: "Tuesday",
			wed: "Wednesday",
			thu: "Thursday",
			fri: "Friday",
			sat: "Saturday",
			sun: "Sunday",
		},
	},
	preview: "View Listing",
	admin: {
		title: "Admin",
		editing: "Editing:",
		dashboard: {
			title: "Dashboard",
			explanation:
				"This site allows you to manage your provider and listings. Providers are organizations that offer food resources and listings are the specific resources they offer.",
		},
		confirm: {
			title: "Leave without saving?",
			description:
				"Your changes have not been saved. If you leave, you will lose your changes.",
			confirm: "Confirm",
			cancel: "Cancel",
		},
		nav: {
			manage: "Manage",
			admin: "Admin",
			dashboard: "Dashboard",
			listings: "Listings",
			provider: "Provider",
			providers: "Providers",
			analytics: "Analytics",
			settings: "Settings",
			localeToggle: "Français",
			account: "Account",
			logout: "Logout",
			exit: "Exit to Bread",
		},
		verificationPending: {
			title: "Verification Pending",
			description:
				"Until verified your listings will not be public. This may take a few days.",
		},
		providers: {
			title: "Providers",
			description:
				"Manage your providers here. Verify and approve providers to allow them to create listings.",
			status: {
				pending: "Pending",
				approved: "Approved",
				rejected: "Rejected",
			},
		},
		onboarding: {
			title: "Create Your Provider",
			description:
				"Please enter your provider's name and contact information.",
			contact: {
				title: "Contact Information",
				description:
					"This will allow users to contact your provider. It can be overridden by the contact information in a specific listing.",
			},
		},
		auth: {
			login: {
				switch: {
					preface: "Need an account?",
					link: "Sign Up",
				},
				title: "Login",
				forgotPassword: "Forgot password?",
			},
			resetPassword: {
				title: "Reset Password",
				emailDescription:
					"Please enter your email to reset your password.",
				passwordDescription: "Please enter your new password.",
			},
			verifyEmail: {
				title: "Verify Email",
				description: {
					email_verification:
						"Please enter the code sent to your email. ",
					password_reset:
						"Please enter the code sent to your email. If you didn't receive it, make sure you entered the correct email.",
				},
				resend: {
					preface: "Need another code?",
					link: "Resend Code",
					success: "Code resent",
				},
			},
			signup: {
				title: "Sign Up",
				switch: {
					preface: "Already have an account?",
					link: "Login",
				},
			},
		},
		listings: {
			title: "Listings",
			description: "Manage your listings here.",
			empty: "No listings found.",
			new: {
				title: "New Listing",
				description: "Create a new listing.",
			},
			edit: {
				title: "Edit Listing",
				description: "Edit an existing listing.",
			},
		},
		provider: {
			title: "Provider",
			description: "Manage your provider information here.",
			sections: {
				provider: "Information",
				owner: "Owner Information",
				listings: "Listings",
			},
		},
		analytics: {
			title: "Analytics",
			description: "View your analytics here.",
			cards: {
				savedResources: {
					title: "Saved resources",
					description:
						"The number of resources actively saved by users.",
				},
			},
		},
	},
	offeringTypes: {
		meal: "Meals",
		groceries: "Groceries",
		delivery: "Delivery",
		hamper: "Hampers",
		pantry: "Pantry",
		"drop-in": "Drop-in",
		market: "Market",
		other: "Other",
	},
	form: {
		common: {
			submit: "Submit",
			description: "Description",
			optional: "Optional",
		},
		auth: {
			password: "Password",
			passwordConfirmation: "Confirm Password",
			passwordStrength: {
				title: "Password Strength",
				"0": "Very Weak",
				"1": "Very Weak",
				"2": "Weak",
				"3": "Good",
				"4": "Strong",
			},
			errors: {
				email: "Email already in use",
			},
		},
		resetPassword: {
			code: "Code",
		},
		provider: {
			name: "Name",
			contact: {
				title: "Contact Information",
				description:
					"This will allow users to contact your provider. It can be overridden by the contact information in a specific listing.",
			},
			success: {
				create: "Provider created",
				update: "Provider updated",
			},
		},
		contact: {
			website: "Website",
			phoneNumbers: "Phone Numbers",
			addPhoneNumber: "Add Phone Number",
		},
		listing: {
			fallback: "Fallback:",
			success: {
				create: "Listing created",
				update: "Listing updated",
			},
			offerings: {
				title: "Offerings",
				description: "Select the offerings for your listing.",
			},
			capacity: {
				title: "Capacity",
				example: "Ex: We can serve 30 people a day",
			},
			delete: {
				title: "Delete Listing",
				description:
					"Are you sure you want to delete this listing? This action cannot be undone and will remove it from search and each users saved listings.",
				confirm: "Delete",
				cancel: "Cancel",
			},
			dietaryOptions: {
				title: "Dietary Options",
				description: "Select the dietary options for your listing.",
			},
			offering: {
				title: "Offering",
			},
			location: {
				title: "Location",
				description: "Enter the location of your listing.",
				full: "Full Address",
				placeholder: "Enter an address",
				street: "Street",
				city: "City",
				province: "Province",
				country: "Country",
				postalCode: "Postal Code",
			},
			hours: {
				title: "Hours",
				description: "The hours of operation for your listing.",
				startTime: "Start Time",
				endTime: "End Time",
			},
			eligibility: {
				title: "Eligibility",
				example:
					"Only people over 50 and/or with a low income are eligible",
			},
			contact: {
				title: "Contact Information",
				description:
					"This will allow users to contact your provider. If no contact information is provided, the provider's contact information will be used.",
			},
			toggles: {
				title: "Options",
				description:
					"Select the options for this listing. Optionally add notes on each to help the user.",
				parking: {
					title: "Parking Available",
					description: "Does your listing have parking available?",
					example:
						"There is a parking lot in the back of the building.",
				},
				free: {
					title: "Free",
					description: "Is your listing free?",
					example: "The listing is free",
				},
				preparation: {
					title: "Preparation Required",
					description:
						"Does your listing require the user to prepare the food themselves?",
					example:
						"The listing requires kitchen facilities (stove, oven, etc.)",
				},
				transit: {
					title: "Near Transit",
					description: "Is your listing near public transit?",
					example: "The listing is a 5 minute walk from Jane Station",
				},
				wheelchair: {
					title: "Wheelchair Accessible",
					description: "Is your listing accessible by wheelchair?",
					example:
						"The listing has wheelchair ramps and is on the ground floor",
				},
			},
			notes: "Notes",
		},
	},
	table: {
		empty: "No results.",
		filter: "Filter results...",
		sort: {
			asc: "Asc",
			desc: "Desc",
			hide: "Hide",
		},
		name: "Name",
		status: "Status",
		rowsPerPage: "Rows per page",
		page: "Page",
		of: "of",
		goToFirstPage: "Go to first page",
		goToPreviousPage: "Go to previous page",
		goToNextPage: "Go to next page",
		goToLastPage: "Go to last page",
	},
	faq: {
		title: "FAQ",
		description: "Frequently asked questions about Bread.",
		general: {
			title: "General Questions",
			list: {
				"0": {
					question: "What is Bread?",
					answer: "Bread is a free platform that connects people with food resources in Calgary. It allows food providers to list their services, ensuring individuals and families facing food insecurity can find reliable and up-to-date information on food assistance programs.",
				},
				"1": {
					question: "Who can use Bread?",
					answer: "Bread is a tool for anyone who needs reliable, up-to-date information about food resources assistance – whether you’re looking for food resources, helping someone else find that support, or part of an organization providing food, Bread is here to help.",
				},
				"2": {
					question:
						"How does Bread make it easier to find food assistance?",
					answer: "Bread makes it easy by providing up-to-date and verified information, so you can trust that the details about food resources are accurate and safe.",
				},
				"3": {
					question: "Is Bread accessible on all devices?",
					answer: "Yes, Bread is a web app, so you can access it on any device with a web browser—no downloads needed! It works seamlessly on desktop, mobile, and tablet.",
				},
			},
		},
		seekers: {
			title: "Seeker Questions",
			list: {
				"0": {
					question: "How can I find food through Bread?",
					answer: "Simply use the search and filter options on Bread to choose what you need based on your location, dietary needs, or other criteria. You’ll get an updated list of food resources with details like operating days, location and more. You can also save or print the list for easy access.",
				},
				"1": {
					question: "How does Bread make finding food easier for me?",
					answer: "Bread provides up-to-date, reliable information of the food resources in Calgary, including service hours and accessibility details. This saves you time and effort, allowing you to find what you need quickly.",
				},
				"2": {
					question:
						"What types of food resources are available on Bread?",
					answer: "Bread connects you with various food providers, from community pantries to large organizations like the Calgary Food Bank. You can find emergency food assistance, meal programs, and special dietary options like Kosher, Halal, or vegetarian.",
				},
				"3": {
					question:
						"How do I know if I'm eligible for the food programs listed?",
					answer: "You can check the eligibility criteria listed for each program. Providers will indicate any requirements, such as income level, residency, or other factors.",
				},
				"4": {
					question:
						"How do I know if the information on Bread is up to date?",
					answer: "Bread regularly prompts providers to verify their program information, ensuring that details like hours of operation and food availability are accurate and up to date.",
				},
				"5": {
					question: "Do I need to download an app to use Bread?",
					answer: "No, Bread is a web app, so you can access it directly on any device with a web browser—no downloads needed!",
				},
				"6": {
					question:
						"What should I do if I can't find the type of food I need?",
					answer: "Bread allows you to filter offerings based on dietary needs or specific types of food. If you don’t find what you’re looking for, try refining your search or reaching out to providers directly through the platform.",
				},
				"7": {
					question:
						"Is Bread easy to use if I’m not very tech-savvy?",
					answer: "Yes! It is designed to be simple and easy to navigate, so you can find food support even if you’re not very familiar with technology.",
				},
				"8": {
					question:
						"Does Bread help me feel secure in where I go for food support?",
					answer: "Yes, Bread carefully curates’ food resource information to guide you to safe and welcoming spaces, helping you feel more confident in your search.",
				},
				"9": {
					question:
						"Can I use Bread to find food resources outside of Calgary?",
					answer: "Bread currently focuses on helping you find food resources in Calgary. As we grow, we hope to add more regions in the future. Stay tuned for updates!",
				},
			},
		},
	},
};

export default en;
