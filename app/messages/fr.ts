import type { Messages } from "@/lib/locale";

const fr: Messages = {
	title: "Bread: Banques alimentaires à Calgary",
	description:
		"Bread est un répertoire de ressources alimentaires dans la région de Calgary.",
	common: {
		name: "Nom",
		email: "Courriel",
		optional: "Optionnel",
		back: "Retour",
		to: "à",
		bread: "Bread",
		submit: "Soumettre",
	},
	userEmail: "Courriel de l'utilisateur",
	search: "Rechercher",
	poweredBy: "Propulsé par",
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
	dietaryOptionTypes: {
		vegetarian: "Végétarien",
		vegan: "Végétalien",
		halal: "Halal",
		kosher: "Cachère",
		"renal-disease": "Maladie Rénale",
		"gluten-free": "Sans gluten",
		celiac: "Céliaque",
		baby: "Bébé",
		pet: "Animal de compagnie",
		other: "Autre",
	},
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
		verificationPending: {
			title: "Verification en attente",
			description:
				"Jusqu'à ce que votre fournisseur soit vérifié, vos annonces ne seront pas publiques. Cela peut prendre quelques jours.",
		},
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
			manage: "Gérer",
			admin: "Admin",
			dashboard: "Tableau de bord",
			listings: "Annonces",
			provider: "Fournisseur",
			providers: "Fournisseurs",
			analytics: "Analytiques",
			settings: "Paramètres",
			localeToggle: "Anglais",
			account: "Compte",
			logout: "Déconnexion",
			exit: "Quitter Bread",
		},
		providers: {
			title: "Fournisseurs",
			description: "Gérer vos fournisseurs ici.",
			status: {
				pending: "En attente",
				approved: "Approuvé",
				rejected: "Rejeté",
			},
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
			sections: {
				provider: "Fournisseur",
				owner: "Propriétaire",
				listings: "Listes",
			},
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
		hamper: "Paniers",
		pantry: "Garde-manger",
		"drop-in": "Entrée libre",
		market: "Marché",
		other: "Autre",
	},
	form: {
		common: {
			submit: "Soumettre",
			description: "Description",
			optional: "Optionnel",
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
			offerings: {
				title: "Offres",
				description: "Sélectionnez les offres pour votre listing.",
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
	table: {
		name: "Nom",
		status: "Statut",
		empty: "Aucun résultat.",
		filter: "Filtrer les résultats...",
		sort: {
			asc: "Croissant",
			desc: "Décroissant",
			hide: "Masquer",
		},
		rowsPerPage: "Lignes par page",
		page: "Page",
		of: "de",
		goToFirstPage: "Aller à la première page",
		goToPreviousPage: "Aller à la page précédente",
		goToNextPage: "Aller à la page suivante",
		goToLastPage: "Aller à la dernière page",
	},
	faq: {
		title: "FAQ",
		description: "Questions fréquemment posées sur Bread.",
		general: {
			title: "Questions générales",
			list: {
				"0": {
					question: "Qu'est-ce que Bread ?",
					answer: "Bread est une plateforme gratuite qui met en relation les personnes avec les ressources alimentaires à Calgary. Elle permet aux fournisseurs de nourriture de répertorier leurs services, garantissant ainsi aux individus et aux familles confrontés à l'insécurité alimentaire de trouver des informations fiables et à jour sur les programmes d'aide alimentaire.",
				},
				"1": {
					question: "Qui peut utiliser Bread ?",
					answer: "Bread est un outil pour toute personne ayant besoin d'informations fiables et à jour sur l'aide alimentaire – que vous cherchiez des ressources alimentaires, que vous aidiez quelqu'un d'autre à trouver ce soutien, ou que vous fassiez partie d'une organisation fournissant de la nourriture, Bread est là pour vous aider.",
				},
				"2": {
					question:
						"Comment Bread facilite-t-il la recherche d'aide alimentaire ?",
					answer: "Bread simplifie la recherche en fournissant des informations à jour et vérifiées, vous pouvez donc être sûr que les détails sur les ressources alimentaires sont précis et fiables.",
				},
				"3": {
					question:
						"Bread est-il accessible sur tous les appareils ?",
					answer: "Oui, Bread est une application web, vous pouvez donc y accéder sur n'importe quel appareil avec un navigateur web—aucun téléchargement nécessaire ! Il fonctionne parfaitement sur ordinateur, mobile et tablette.",
				},
			},
		},
		seekers: {
			title: "Questions pour les utilisateurs",
			list: {
				"0": {
					question:
						"Comment puis-je trouver de la nourriture via Bread ?",
					answer: "Utilisez simplement les options de recherche et de filtrage sur Bread pour choisir ce dont vous avez besoin en fonction de votre localisation, de vos besoins alimentaires ou d'autres critères. Vous obtiendrez une liste à jour des ressources alimentaires avec des détails comme les jours d'ouverture, l'emplacement et plus encore. Vous pouvez également sauvegarder ou imprimer la liste pour un accès facile.",
				},
				"1": {
					question:
						"Comment Bread me facilite-t-il la recherche de nourriture ?",
					answer: "Bread fournit des informations fiables et à jour sur les ressources alimentaires à Calgary, y compris les heures de service et les détails d'accessibilité. Cela vous fait gagner du temps et des efforts, vous permettant de trouver rapidement ce dont vous avez besoin.",
				},
				"2": {
					question:
						"Quels types de ressources alimentaires sont disponibles sur Bread ?",
					answer: "Bread vous met en relation avec divers fournisseurs alimentaires, des garde-manger communautaires aux grandes organisations comme la Banque alimentaire de Calgary. Vous pouvez trouver de l'aide alimentaire d'urgence, des programmes de repas et des options alimentaires spéciales comme Kasher, Halal ou végétarien.",
				},
				"3": {
					question:
						"Comment savoir si je suis éligible aux programmes alimentaires répertoriés ?",
					answer: "Vous pouvez vérifier les critères d'éligibilité indiqués pour chaque programme. Les fournisseurs indiqueront toutes les exigences, comme le niveau de revenu, la résidence ou d'autres facteurs.",
				},
				"4": {
					question:
						"Comment savoir si les informations sur Bread sont à jour ?",
					answer: "Bread invite régulièrement les fournisseurs à vérifier les informations de leur programme, garantissant ainsi que les détails comme les heures d'ouverture et la disponibilité des aliments sont précis et à jour.",
				},
				"5": {
					question:
						"Dois-je télécharger une application pour utiliser Bread ?",
					answer: "Non, Bread est une application web, vous pouvez donc y accéder directement sur n'importe quel appareil avec un navigateur web—aucun téléchargement nécessaire !",
				},
				"6": {
					question:
						"Que dois-je faire si je ne trouve pas le type de nourriture dont j'ai besoin ?",
					answer: "Bread vous permet de filtrer les offres en fonction des besoins alimentaires ou des types spécifiques de nourriture. Si vous ne trouvez pas ce que vous cherchez, essayez d'affiner votre recherche ou de contacter directement les fournisseurs via la plateforme.",
				},
				"7": {
					question:
						"Bread est-il facile à utiliser si je ne suis pas très à l'aise avec la technologie ?",
					answer: "Oui ! Il est conçu pour être simple et facile à naviguer, vous pouvez donc trouver une aide alimentaire même si vous n'êtes pas très familier avec la technologie.",
				},
				"8": {
					question:
						"Bread m'aide-t-il à me sentir en sécurité là où je vais chercher de l'aide alimentaire ?",
					answer: "Oui, Bread sélectionne soigneusement les informations sur les ressources alimentaires pour vous guider vers des espaces sûrs et accueillants, vous aidant à vous sentir plus confiant dans votre recherche.",
				},
				"9": {
					question:
						"Puis-je utiliser Bread pour trouver des ressources alimentaires en dehors de Calgary ?",
					answer: "Bread se concentre actuellement sur l'aide à la recherche de ressources alimentaires à Calgary. Au fur et à mesure de notre croissance, nous espérons ajouter plus de régions à l'avenir. Restez à l'écoute pour les mises à jour !",
				},
			},
		},
	},
};

export default fr;
