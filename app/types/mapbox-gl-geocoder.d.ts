declare module "@mapbox/mapbox-gl-geocoder" {
  import mapboxgl from "mapbox-gl";

  interface MapboxGeocoderOptions {
    accessToken: string;
    mapboxgl: typeof mapboxgl;
    countries?: string;
    marker?: boolean;
    proximity?: string;
    trackProximity?: boolean;
    placeholder?: string;
  }

  interface GeocoderResult {
    geometry: {
      coordinates: [number, number];
      type: string;
    };
    [key: string]: unknown;
  }

  interface IControl {
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
  }

  class MapboxGeocoder implements IControl {
    constructor(options: MapboxGeocoderOptions);
    on(
      event: string,
      callback: (event: { result: GeocoderResult }) => void
    ): void;
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
  }

  export default MapboxGeocoder;
}
