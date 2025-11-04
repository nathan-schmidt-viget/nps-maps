import geoJson from "../assets/nps.json";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import { MAP_DEFAULTS } from "./constants";
import type { NPSFeature, SearchResult } from "../types";

export function getLocalNPSbyCode(
  selectedItem: string
): NPSFeature | undefined {
  const item = geoJson.features.find(
    (item) => item.properties.Code === selectedItem
  );
  return item as NPSFeature | undefined;
}

export function getLocalNPSbyName(selectedItem: string): string | undefined {
  const item = geoJson.features.find(
    (item) =>
      item.properties.Name.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") === selectedItem.toLowerCase()
  );
  return item?.properties.Code;
}

export function getSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function formatPhoneNumber(phoneNumberString: string): string | null {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return null;
}

export function sortItems(
  searchResult: SearchResult,
  searchRadius: string = MAP_DEFAULTS.SEARCH_RADIUS
): NPSFeature[] {
  const sortedGeoMap = [...geoJson.features] as NPSFeature[];
  const options = { units: "miles" as const };

  //add the distance to the array
  sortedGeoMap.forEach((item: NPSFeature) => {
    item.properties.distance = turf.distance(
      searchResult.coordinates,
      item.geometry.coordinates as [number, number],
      options
    );
    item.show = item.properties.distance > Number(searchRadius) ? false : true;
  });

  //sort the array by the distance
  sortedGeoMap.sort((a: NPSFeature, b: NPSFeature) => {
    if (a.properties.distance && b.properties.distance) {
      if (a.properties.distance > b.properties.distance) {
        return 1;
      }
      if (a.properties.distance < b.properties.distance) {
        return -1;
      }
    }
    return 0; // a must be equal to b
  });

  //set the sorted array to the geoMap
  return sortedGeoMap;
}

export function flyToLocation(
  map: React.RefObject<mapboxgl.Map>,
  currentItem: NPSFeature
): void {
  map.current?.flyTo({
    center: currentItem.geometry.coordinates,
    zoom: 8.5,
    duration: 3000,
    essential: true, // This animation is considered essential with
    //respect to prefers-reduced-motion
  });
}
