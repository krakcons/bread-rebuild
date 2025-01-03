export const english = {
	title: "Bread: Food Banks in Calgary",
	description:
		"Bread is a directory of food resources in the greater Calgary area.",
	common: {
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
	accessibility: "Accessibility",
	applicationProcess: "Application Process",
	additionalInfo: "Additional Information",
	contact: "Contact",
	email: "Email",
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
	unassigned: "Unassigned",
	parking: "Parking",
	preparationRequired: "Preparation Required",
	transit: "Transit",
	filters: {
		title: "Filters",
		description:
			"Filter resources by the following options and dietary requirements.",
		free: "Free",
		preparationRequired: "Preparation Required",
		parkingAvailable: "Parking",
		nearTransit: "Near Transit",
		wheelchairAccessible: "Wheelchair Accessible",
	},
	terms: "Terms of Use",
	privacy: "Privacy Policy",
	dietaryOptions: "Dietary Options",
	admin: {
		title: "Admin",
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
			form: {
				email: "Email",
				password: "Password",
			},
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
				form: {
					code: "Code",
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
				form: {
					email: "Email",
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
			},
		},
		listings: {
			new: {
				title: "New Listing",
				description: "Create a new listing.",
				form: {
					description: "Description",
					contact: {
						title: "Contact Information",
						description:
							"This will allow users to contact your provider. It can be overridden by the contact information in a specific listing.",
						website: "Website",
						email: "Email",
						phoneNumbers: "Phone Numbers",
						addPhoneNumber: "Add Phone Number",
					},
					toggles: {
						title: "Options",
						description:
							"Select the options for this listing. Optionally add notes on each to help the user.",
					},
					parking: "Parking Available",
					free: "Free",
					preperation: "Preparation Required",
					transit: "Near Transit",
					wheelchair: "Wheelchair Accessible",
					notes: "Notes",
				},
			},
		},
	},
};

export const french: typeof english = {
	title: "Bread: Banques alimentaires à Calgary",
	description:
		"Bread est un répertoire de ressources alimentaires dans la région de Calgary.",
	common: {
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
	phoneTypes: {
		phone: "Téléphone",
		fax: "Fax",
		"toll-free": "Téléphone sans frais",
		tty: "TTY",
	},
	accessibility: "Accessibilité",
	applicationProcess: "Processus d'application",
	additionalInfo: "Informations supplémentaires",
	contact: "Contact",
	email: "Courriel",
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
	unassigned: "Non assigné",
	parking: "Parking",
	preparationRequired: "Préparation Requise",
	transit: "Transit",
	filters: {
		title: "Filtres",
		description:
			"Filtrer les ressources par les options suivantes et les exigences alimentaires.",
		free: "Gratuit",
		preparationRequired: "Préparation Requise",
		parkingAvailable: "Parking",
		nearTransit: "Proche du Transit",
		wheelchairAccessible: "Accessible au Fauteuil Roulant",
	},
	terms: "Conditions d'utilisation",
	privacy: "Politique de confidentialité",
	dietaryOptions: "Options Diététiques",
	admin: {
		title: "Admin",
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
			form: {
				email: "Courriel",
				password: "Mot de passe",
			},
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
				form: {
					code: "Code",
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
				form: {
					email: "Courriel",
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
			},
		},
		listings: {
			new: {
				title: "Nouvelle Liste",
				description: "Créer une nouvelle liste.",
				form: {
					description: "Description",
					contact: {
						title: "Informations de contact",
						description:
							"Cela permet aux utilisateurs de contacter votre fournisseur. Il peut être remplacé par les informations de contact dans une liste spécifique.",
						website: "Site Web",
						email: "Courriel",
						phoneNumbers: "Téléphones",
						addPhoneNumber: "Ajouter un téléphone",
					},
					toggles: {
						title: "Options",
						description:
							"Sélectionnez les options pour cette liste. Optionnellement, ajoutez des notes sur chacune pour aider l'utilisateur.",
					},
					parking: "Parking Disponible",
					free: "Gratuit",
					preperation: "Préparation Requise",
					transit: "Proche du Transit",
					wheelchair: "Accessible au Fauteuil Roulant",
					notes: "Notes",
				},
			},
		},
	},
};
