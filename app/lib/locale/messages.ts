export const english = {
	title: "Bread: Food Banks in Calgary",
	description:
		"Bread is a directory of food resources in the greater Calgary area.",
	common: {
		name: "Name",
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
	email: "Email",
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
			admin: "Admin",
			dashboard: "Dashboard",
			listings: "Listings",
			provider: "Provider",
			analytics: "Analytics",
			settings: "Settings",
			localeToggle: "Français",
			account: "Account",
			logout: "Logout",
			exit: "Exit to Bread",
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
	},
	form: {
		common: {
			submit: "Submit",
			description: "Description",
			optional: "Optional",
			email: "Email",
		},
		auth: {
			password: "Password",
			passwordConfirmation: "Confirm Password",
			passwordStrength: {
				title: "Password Strength",
				0: "Very Weak",
				1: "Very Weak",
				2: "Weak",
				3: "Good",
				4: "Strong",
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
};

export const french: typeof english = {
	title: "Bread: Banques alimentaires à Calgary",
	description:
		"Bread est un répertoire de ressources alimentaires dans la région de Calgary.",
	common: {
		name: "Nom",
		optional: "Optionnel",
		back: "Retour",
		to: "à",
		bread: "Bread",
		submit: "Soumettre",
	},
	search: "Rechercher",
	free: "Gratuit",
	list: "Liste",
	map: "Carte",
	address: "Adresse",
	fees: "Frais",
	edit: "Modifier",
	phoneTypes: {
		phone: "Téléphone",
		fax: "Fax",
		"toll-free": "Téléphone sans frais",
		tty: "TTY",
	},
	info: "Informations",
	eligibility: "Eligibilité",
	accessibility: "Accessibilité",
	applicationProcess: "Processus d'application",
	additionalInfo: "Informations supplémentaires",
	contact: "Contact",
	email: "Courriel",
	website: "Site Web",
	hours: "Horaires",
	saved: {
		title: "Ma Sauvegardé",
		description:
			"Vous pouvez enregistrer des ressources ici pour les retrouver plus tard. Pressez le bouton d'impression ci-dessus pour imprimer vos ressources enregistrées.",
		save: "Sauvegarder",
		saved: "Sauvegardé",
	},
	print: "Imprimer",
	viewMore: "Voir plus",
	day: "Itinéraire",
	none: "Aucun",
	clear: "Effacer",
	parking: "Parking",
	preparation: "Préparation Requise",
	transit: "Transit",
	wheelchair: "Accessible au Fauteuil Roulant",
	preview: "Voir la liste",
	filters: {
		title: "Filtres",
		description:
			"Filtrer les ressources par les options suivantes et les exigences alimentaires.",
		free: "Gratuit",
		preparation: "Préparation Requise",
		parking: "Parking",
		transit: "Proche du Transit",
		wheelchair: "Accessible au Fauteuil Roulant",
	},
	terms: "Conditions d'utilisation",
	privacy: "Politique de confidentialité",
	dietaryOptions: "Options Diététiques",
	daysOfWeek: {
		unassigned: "Non assigné",
		open: "Ouvert",
		closed: "Fermé",
		short: {
			mon: "Lun",
			tue: "Mar",
			wed: "Mer",
			thu: "Jeu",
			fri: "Ven",
			sat: "Sam",
			sun: "Dim",
		},
		long: {
			mon: "Lundi",
			tue: "Mardi",
			wed: "Mercredi",
			thu: "Jeudi",
			fri: "Vendredi",
			sat: "Samedi",
			sun: "Dimanche",
		},
	},
	admin: {
		dashboard: {
			title: "Tableau de bord",
			explanation:
				"Ce site vous permet de gérer vos fournisseurs et annonces. Les fournisseurs sont des organisations qui offrent des ressources alimentaires et les annonces sont les ressources spécifiques qu'ils offrent.",
		},
		title: "Admin",
		editing: "Edition :",
		confirm: {
			title: "Quitter sans enregistrer?",
			description:
				"Vos modifications n'ont pas été enregistrées. Si vous quittez, vous perdrez vos modifications.",
			confirm: "Confirmer",
			cancel: "Annuler",
		},
		nav: {
			admin: "Admin",
			dashboard: "Tableau de bord",
			listings: "Annonces",
			provider: "Fournisseurs",
			analytics: "Analytiques",
			settings: "Paramètres",
			localeToggle: "Anglais",
			account: "Compte",
			logout: "Déconnexion",
			exit: "Quitter Bread",
		},
		onboarding: {
			title: "Créer Votre Fournisseur",
			description:
				"Veuillez entrer le nom et les informations de contact de votre fournisseur.",
			contact: {
				title: "Informations de contact",
				description:
					"Cela permet aux utilisateurs de contacter votre fournisseur. Il peut être remplacé par les informations de contact dans une liste spécifique.",
			},
		},
		auth: {
			login: {
				switch: {
					preface: "Besoin d'un compte?",
					link: "S'enregistrer",
				},
				title: "Connexion",
				forgotPassword: "Mot de passe oublié?",
			},
			resetPassword: {
				title: "Réinitialiser le mot de passe",
				emailDescription:
					"Veuillez entrer votre email pour réinitialiser votre mot de passe.",
				passwordDescription:
					"Veuillez entrer votre nouveau mot de passe.",
			},
			verifyEmail: {
				title: "Vérifier votre email",
				description: {
					email_verification:
						"Veuillez entrer le code envoyé à votre email.",
					password_reset:
						"Veuillez entrer le code envoyé à votre email. Si vous ne l'avez pas reçu, veuillez vérifier votre adresse email.",
				},
				resend: {
					preface: "Besoin d'un autre code?",
					link: "Renvoyer le code",
					success: "Code renvoyé",
				},
			},
			signup: {
				title: "S'enregistrer",
				switch: {
					preface: "Vous avez déjà un compte?",
					link: "Connexion",
				},
			},
		},
		listings: {
			title: "Listes",
			description: "Gérez vos listings ici.",
			empty: "Aucun listing trouvé.",
			new: {
				title: "Nouvelle Liste",
				description: "Créer une nouvelle liste.",
			},
			edit: {
				title: "Modifier une Liste",
				description: "Modifier une liste existante.",
			},
		},
		provider: {
			title: "Fournisseur",
			description: "Gérer vos informations de fournisseur ici.",
		},
		analytics: {
			title: "Statistiques",
			description: "Voir vos statistiques ici.",
			cards: {
				savedResources: {
					title: "Ressources sauvegardées",
					description:
						"Le nombre de ressources sauvegardées par les utilisateurs.",
				},
			},
		},
	},
	offeringTypes: {
		meal: "Repas",
		groceries: "Légumes",
		delivery: "Livraison",
		hamper: "Hampers",
		pantry: "Pantry",
		"drop-in": "Drop-in",
		market: "Marché",
	},
	form: {
		common: {
			submit: "Soumettre",
			description: "Description",
			optional: "Optionnel",
			email: "Courriel",
		},
		auth: {
			password: "Mot de passe",
			passwordConfirmation: "Confirmer le mot de passe",
			passwordStrength: {
				title: "Force du mot de passe",
				0: "Très Faible",
				1: "Très Faible",
				2: "Faible",
				3: "Bon",
				4: "Très Fort",
			},
			errors: {
				email: "Courriel déjà utilisé",
			},
		},
		resetPassword: {
			code: "Code",
		},

		provider: {
			name: "Nom",
			contact: {
				title: "Informations de contact",
				description:
					"Cela permet aux utilisateurs de contacter votre fournisseur. Il peut être remplacé par les informations de contact dans une liste spécifique.",
			},
			success: {
				create: "Fournisseur créé",
				update: "Fournisseur mis à jour",
			},
		},
		contact: {
			website: "Site Web",
			phoneNumbers: "Téléphones",
			addPhoneNumber: "Ajouter un téléphone",
		},
		listing: {
			fallback: "De repli :",
			success: {
				create: "Annonce créée",
				update: "Annonce mise à jour",
			},
			delete: {
				title: "Supprimer l'annonce",
				description:
					"Êtes-vous sûr de vouloir supprimer cette annonce?",
				confirm: "Supprimer",
				cancel: "Annuler",
			},
			dietaryOptions: {
				title: "Options Diététiques",
				description:
					"Sélectionnez les options diététiques pour votre listing.",
			},
			offering: {
				title: "Offre",
			},
			capacity: {
				title: "Capacité",
				example: "Ex : Capacité de 100 personnes",
			},
			location: {
				title: "Localisation",
				description: "Entrez la localisation de votre listing.",
				full: "Adresse complète",
				placeholder: "Entrez une adresse",
				street: "Rue",
				city: "Ville",
				province: "Province",
				country: "Pays",
				postalCode: "Code postal",
			},
			hours: {
				title: "Horaires",
				description: "Les horaires d'ouverture de votre listing.",
				startTime: "Heure de début",
				endTime: "Heure de fin",
			},
			eligibility: {
				title: "Eligibilité",
				example:
					"Seules les personnes de 18 ans et plus et/ou avec un faible revenu sont éligibles",
			},
			contact: {
				title: "Informations de contact",
				description:
					"Cela permet aux utilisateurs de contacter votre fournisseur. Il peut être remplacé par les informations de contact dans une liste spécifique.",
			},
			toggles: {
				title: "Options",
				description:
					"Sélectionnez les options pour cette liste. Optionnellement, ajoutez des notes sur chacune pour aider l'utilisateur.",
				free: {
					title: "Gratuit",
					description: "Est-ce que votre listing est gratuit?",
					example: "Le ressource est gratuit",
				},
				preparation: {
					title: "Préparation Requise",
					description:
						"Est-ce que votre listing requiert que l'utilisateur prépare le repas?",
					example: "Le ressource requiert de chauffer",
				},
				transit: {
					title: "Proche du Transit",
					description:
						"Est-ce que votre listing est proche du transit?",
					example:
						"Le ressource est à 5 minutes de la station de métro",
				},
				wheelchair: {
					title: "Accessible au Fauteuil Roulant",
					description:
						"Est-ce que votre listing est accessible au fauteuil roulant?",
					example: "Le ressource a des rampes pour fauteuil roulant",
				},
				parking: {
					title: "Parking Disponible",
					description: "Est-ce que votre listing a du parking?",
					example: "Le ressource a un parking à l'arrière",
				},
			},
			notes: "Notes",
		},
	},
};
