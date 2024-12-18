import { ComponentProps, lazy, Suspense } from "react";

const DynamicMap = lazy(() =>
	import("react-map-gl/maplibre").then((mod) => ({
		default: mod.Map,
	})),
);

type MapProps = ComponentProps<typeof DynamicMap>;

export const Map = (props: MapProps) => {
	return (
		<Suspense
			fallback={<div className="h-[80vh] animate-pulse bg-gray-100" />}
		>
			<DynamicMap {...props} />
		</Suspense>
	);
};

export const Marker = lazy(() =>
	import("react-map-gl/maplibre").then((mod) => ({
		default: mod.Marker,
	})),
);

export const Popup = lazy(() =>
	import("react-map-gl/maplibre").then((mod) => ({
		default: mod.Popup,
	})),
);
