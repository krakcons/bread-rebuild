import { StyleSpecification } from "maplibre-gl";

export const STYLE: StyleSpecification = {
	version: 8,
	sources: {
		"raster-tiles": {
			type: "raster",
			tiles: [
				"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
				"https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
			],
			tileSize: 256,
		},
	},
	layers: [
		{
			id: "osm-tiles",
			type: "raster",
			source: "raster-tiles",
			minzoom: 0,
			maxzoom: 19,
		},
	],
};
