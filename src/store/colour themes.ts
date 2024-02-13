
export class ColourTheme {
	primary: string;
	secondary: string;
	backgroundPrimary: string;
	backgroundSecondary: string;
	text: string;
	generic: string;
	contrast: string;
	light: string;
	// translucent: string;
	// translucentLess: string;
	// contrastTranslucent: string;
	// contrastTranslucentLess: string;
	// backgroundPrimaryTranslucent: string;
	// primaryTranslucent: string;
	// secondaryTranslucent: string;
	type: "dark" | "light";
	pieceHome: { background: string; colour: string; };
	pieceRival: { background: string; colour: string; };
	translucence: { l: string; m: string; s: string; xs: string; };
	shadow: { default: string; icon: string; };
	glow: { default: string; icon: string; };
	constructor({
		type = "dark",
		generic = type == "dark" ? "#FFFFFF" : "#000000",
		contrast = type == "dark" ? "#000000" : "#FFFFFF",

		primary = "#3D68A9",
		secondary = "#2A8FAF",
		backgroundPrimary = "#232527",
		backgroundSecondary = "#2B3D51",
		text = type == "dark" ? "#FFFFFF99" : "#000000b3",

		translucence = type == "dark" ? {
			l: "19", /* 10% */
			m: "40", /* 25% */
			s: "66", /* 40% */
			xs: "b3", /* 70% */
		} : {
			l: "19",
			m: "26", /* 15% */
			s: "66",
			xs: "8d", /* 55% */
		},

		// backgroundPrimaryTranslucent = backgroundPrimary + translucence.xs, /* 70% */
		// primaryTranslucent = primary + translucence.m, /* 30% */
		// secondaryTranslucent = secondary + translucence.m, /* 30% */
		shadow = {
			default: "#000000" + translucence.m,
			icon: "#000000" + translucence.m,
		},
		glow = {
			default: primary + translucence.m,
			icon: secondary + translucence.xs,
		},

		pieceHome = { background: "#FFFFFF", colour: primary },
		pieceRival = { background: secondary, colour: generic },
	}: {
		type?: "dark" | "light",
		generic?: "#FFFFFF" | "#000000" | string,
		contrast?: "#000000" | "#FFFFFF" | string,
		primary?: string,
		secondary?: string,
		backgroundPrimary?: string,
		backgroundSecondary?: string,
		text?: string,
		translucence?: {
			l: string,
			m: string,
			s: string,
			xs: string,
		},
		backgroundPrimaryTranslucent?: string,
		primaryTranslucent?: string,
		secondaryTranslucent?: string,

		shadow?: {
			default: string,
			icon: string,
		},
		glow?: {
			default: string,
			icon: string,
		},

		pieceHome?: {
			background: string,
			colour: string,
		},
		pieceRival?: {
			background: string,
			colour: string,
		},
	} = {}) {
		this.type = type;
		this.generic = generic;
		this.contrast = contrast;
		this.light = "#FFF";

		this.primary = primary;
		this.secondary = secondary;
		this.backgroundPrimary = backgroundPrimary;
		this.backgroundSecondary = backgroundSecondary;
		this.text = text;
		this.translucence = translucence;
		// this.translucent = this.generic + translucence.l; /* 10% */
		// this.translucentLess = this.generic + translucence.m; /* 30% */
		// this.contrastTranslucent = this.contrast + translucence.m; /* 30% */
		// this.contrastTranslucentLess = this.contrast + translucence.s; /* 40% */
		// this.backgroundPrimaryTranslucent = backgroundPrimaryTranslucent;
		// this.primaryTranslucent = primaryTranslucent;
		// this.secondaryTranslucent = secondaryTranslucent;
		this.shadow = shadow;
		this.glow = glow;

		this.pieceHome = pieceHome;
		this.pieceRival = pieceRival;
	}
}

export const colourThemes: { [key: string]: ColourTheme } = {
	"Main": new ColourTheme(),
	"Warm": new ColourTheme({
		type: "dark",
		primary: "#C96342",
		secondary: "#D09856",
		backgroundPrimary: "#353738",
		backgroundSecondary: "#704436",
	}),
	"Monochrome": new ColourTheme({
		type: "dark",
		primary: "#7D8084",
		secondary: "#9FA4AB",
		backgroundPrimary: "#373A3D",
		backgroundSecondary: "#4F5256",
	}),
	"Clay": new ColourTheme({
		type: "dark",
		primary: "#D56371",
		secondary: "#DC895B",
		backgroundPrimary: "#342E2C",
		backgroundSecondary: "#6D373E",
	}),
	"Cool": new ColourTheme({
		type: "dark",
		primary: "#4F7096",
		secondary: "#5F93A9",
		backgroundPrimary: "#242930",
		backgroundSecondary: "#2F4850",
	}),
	"Nature": new ColourTheme({
		type: "dark",
		primary: "#638F4E",
		secondary: "#699F85",
		backgroundPrimary: "#2C2D28",
		backgroundSecondary: "#3A543D",
	}),
	"Cream": new ColourTheme({
		type: "light",
		primary: "#E3B296",
		secondary: "#DF9D6D",
		backgroundPrimary: "#F1DFDE",
		backgroundSecondary: "#F9BEB6",
	}),
	"Chocolate": new ColourTheme({
		type: "dark",
		primary: "#876158",
		secondary: "#9F7146",
		backgroundPrimary: "#2E2626",
		backgroundSecondary: "#573D37",
	}),
	"Original": new ColourTheme({
		type: "light",
		primary: "#E45151",
		secondary: "#AEA058",
		backgroundPrimary: "#EBEBEB",
		backgroundSecondary: "#E1D17B",
		pieceRival: {
			background: "#FFFFFF",
			colour: "#000000"
		}
	}),
}
